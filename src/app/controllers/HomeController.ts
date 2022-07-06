import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Aged from '../models/Aged';
import User from '../models/User';

class HomeController {
  async index(req: Request, res: Response) {
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOne(
        { id: req.userId },
        { relations: ['ageds'] }
      );
      return res.json({ ageds: user.ageds });
    } catch {
      return res.sendStatus(400);
    }
  }
}

export default new HomeController();
