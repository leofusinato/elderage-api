import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mailer, { DEFAULT_FROM_EMAIL } from '../modules/mailer';

import User from '../models/User';
import RefreshToken from '../models/RefreshToken';

class AuthController {
  async authenticate(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const refreshRepository = getRepository(RefreshToken);
    const { email, password } = req.body;

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return res.sendStatus(401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.sendStatus(401);
    }

    const refreshToken = await refreshRepository.findOne({
      where: { user_id: user.id },
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.PASSWORD_JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    delete user.password;

    return res.json({ user, token, refreshToken: refreshToken.id });
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const userRepo = getRepository(User);
    try {
      const user = await userRepo.findOne({ email });
      if (!user) {
        return res.sendStatus(404);
      }
      const token = crypto.randomInt(100000, 999999).toString();

      const now = new Date();
      now.setHours(now.getHours() + 1);

      user.password_reset_expires = now;
      user.password_reset_token = token;

      await userRepo.save(user);

      mailer.sendMail(
        {
          to: email,
          from: DEFAULT_FROM_EMAIL,
          html: {
            content: `<p>Você esqueceu a sua senha? Não tem problema, utilize este token: ${token}</p>`,
          },
          // html: { path: 'src/app/resources/mail/auth/forgot_password.html' },
          // context: { token },
        },
        (err) => {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message:
                'Não foi possível enviar e-mail de esquecimento de senha, tente novamente',
            });
          }
          return res.send();
        }
      );
    } catch {
      return res.sendStatus(400);
    }
  }

  async verifyPasswordToken(req: Request, res: Response) {
    const userRepo = getRepository(User);
    const { email, token } = req.body;

    try {
      const user = await userRepo.findOne({ email });
      if (!user) {
        return res.sendStatus(404);
      }

      if (token !== user.password_reset_token) {
        return res.status(400).send({ message: 'Token inválido' });
      }

      const now = new Date();
      if (now > user.password_reset_expires) {
        return res.status(400).send({
          message:
            'Token expirado. Por favor, gere outro realizando a solicitação de esquecimento de senha novamente',
        });
      }

      return res.sendStatus(200);
    } catch {
      return res.status(400).send({
        message: 'Não foi possível verificar o token, tente novamente.',
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const userRepo = getRepository(User);
    const { email, password } = req.body;

    try {
      const user = await userRepo.findOne({ email });
      if (!user) {
        return res.sendStatus(404);
      }

      user.password = password;
      await userRepo.save(user);

      return res.sendStatus(200);
    } catch {
      return res.status(400).send({
        message: 'Não foi possível resetar a senha, tente novamente.',
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { refresh_token } = req.body;
    const refreshTokenRepo = getRepository(RefreshToken);

    try {
      const refreshToken = await refreshTokenRepo.findOne({
        id: refresh_token,
      });
      if (!refreshToken) {
        return res.status(404).json({ message: 'Token não encontrado' });
      }
      const token = jwt.sign(
        { id: refreshToken.user_id },
        process.env.PASSWORD_JWT_SECRET_KEY,
        { expiresIn: '1d' }
      );

      return res.json({ token });
    } catch {
      return res.status(400).send({
        message: 'Não foi possível realizar a requisição, tente novamente.',
      });
    }
  }
}

export default new AuthController();
