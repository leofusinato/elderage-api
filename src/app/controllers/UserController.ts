import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';

import dayjs from 'dayjs';

class UserController {
  async list(req: Request, res: Response) {
    const repository = getRepository(User);

    const users = await repository.find();
    users.map((user) => {
      delete user.password;
    });

    return res.send(users);
  }

  async store(req: Request, res: Response) {
    const userRepo = getRepository(User);
    const refreshTokenRepo = getRepository(RefreshToken);

    const { email, name, password } = req.body;

    const userExists = await userRepo.findOne({ where: { email } });
    if (userExists) {
      return res.sendStatus(409);
    }

    const user = userRepo.create({ email, name, password });
    await userRepo.save(user);

    const expiresIn = dayjs().add(30, 'day').unix();
    const refreshToken = refreshTokenRepo.create({
      user_id: user.id,
      expires_in: expiresIn,
    });
    await refreshTokenRepo.save(refreshToken);

    return res.json({ user, refreshToken });
  }
}

export default new UserController();
