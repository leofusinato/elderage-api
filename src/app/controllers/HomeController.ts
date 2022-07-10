import { Request, Response } from 'express';
import { Between, getRepository } from 'typeorm';
import CheckinMedication from '../models/CheckinMedication';
import User from '../models/User';

class HomeController {
  async index(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const checkinsRepository = getRepository(CheckinMedication);

    try {
      const user = await userRepository.findOne(
        { id: req.userId },
        { relations: ['ageds'] }
      );
      const date = new Date();
      const todayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      const tasks = await checkinsRepository.find({
        where: { created_at: Between(todayStart, date) },
        relations: ['medication', 'medication.aged'],
      });

      return res.json({ ageds: user.ageds, tasks });
    } catch {
      return res.sendStatus(400);
    }
  }
}

export default new HomeController();
