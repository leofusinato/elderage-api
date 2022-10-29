import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import mailer, { DEFAULT_FROM_EMAIL } from '../modules/mailer';

import Aged from '../models/Aged';
import Invite from '../models/Invite';
import User from '../models/User';

class InviteController {
  async my(req: Request, res: Response) {
    const inviteRepo = getRepository(Invite);
    const invites = await inviteRepo.find({ user_id: req.userId });
    return res.json(invites);
  }
  async guest(req: Request, res: Response) {
    const inviteRepo = getRepository(Invite);
    const invites = await inviteRepo.find({
      where: { guest_id: req.userId },
      relations: ['aged', 'user'],
    });
    return res.json(invites);
  }
  async store(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const userRepo = getRepository(User);
    const inviteRepo = getRepository(Invite);

    const { aged_id, guest_email } = req.body;

    try {
      const guest = await userRepo.findOne({ email: guest_email });
      if (!guest) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const invite = inviteRepo.create({
        situation: 1,
        aged_id,
        guest_id: guest.id,
        user_id: req.userId,
      });
      await inviteRepo.save(invite);

      const user = await userRepo.findOne({ id: req.userId });

      mailer.sendMail(
        {
          to: guest.email,
          from: DEFAULT_FROM_EMAIL,
          subject: 'Elderage | Convite',
          html: {
            content: `<p>Você recebeu um convite para cuidar do idoso ${aged.name}! O convite foi feito pelo usuário ${user.name}</p>`,
          },
        },
        (err) => {
          if (err) {
            return res.status(400).send({
              message: 'Não foi possível enviar e-mail, tente novamente',
            });
          }
          return res.send();
        }
      );

      return res.json(invite);
    } catch {
      return res.sendStatus(400);
    }
  }
  async accept(req: Request, res: Response) {
    const inviteRepo = getRepository(Invite);
    const agedRepo = getRepository(Aged);
    const userRepo = getRepository(User);

    const { invite_id } = req.params;

    try {
      const invite = await inviteRepo.findOne(
        { id: invite_id },
        { relations: ['user'] }
      );
      if (!invite) {
        return res.status(404).json({ message: 'Convite não encontrado' });
      }
      const aged = await agedRepo.findOne({ id: invite.aged_id });
      const user = await userRepo.findOne(
        { id: invite.guest_id },
        { relations: ['ageds'] }
      );

      user.ageds = [...user.ageds, aged];
      await userRepo.save(user);
      await inviteRepo.save({ ...invite, situation: 2 });

      mailer.sendMail(
        {
          to: invite.user.email,
          from: DEFAULT_FROM_EMAIL,
          subject: 'Elderage | Convite Aceito',
          html: {
            content: `<p>Seu convite enviado para ${user.name} para cuidar do idoso ${aged.name} foi aceito!</p>`,
          },
        },
        (err) => {
          if (err) {
            return res.status(400).send({
              message: 'Não foi possível enviar e-mail, tente novamente',
            });
          }
          return res.send();
        }
      );

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
  async decline(req: Request, res: Response) {
    const inviteRepo = getRepository(Invite);

    const { invite_id } = req.params;

    try {
      const invite = await inviteRepo.findOne(
        { id: invite_id },
        { relations: ['user', 'guest', 'aged'] }
      );
      if (!invite) {
        return res.status(404).json({ message: 'Convite não encontrado' });
      }

      await inviteRepo.save({ ...invite, situation: 3 });

      mailer.sendMail(
        {
          to: invite.user.email,
          from: DEFAULT_FROM_EMAIL,
          subject: 'Elderage | Convite Recusado',
          html: {
            content: `<p>Seu convite enviado para ${invite.guest.name} para cuidar do idoso ${invite.aged.name} foi recusado.</p>`,
          },
        },
        (err) => {
          if (err) {
            return res.status(400).send({
              message: 'Não foi possível enviar e-mail, tente novamente',
            });
          }
          return res.send();
        }
      );

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
}

export default new InviteController();
