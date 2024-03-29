import { Request, Response } from 'express';
import { Between, getRepository } from 'typeorm';
import CheckinMedication from '../models/CheckinMedication';
import User from '../models/User';
import { getLocaledDate } from '../utils/date';
import { getUserTasks } from '../utils/sql';

class HomeController {
  async index(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const checkinsRepository = getRepository(CheckinMedication);

    const user = await userRepository.findOne(
      { id: req.userId },
      {
        relations: [
          'ageds',
          'ageds.medications',
          'ageds.medications.schedules',
        ],
      }
    );
    const date = getLocaledDate(new Date());
    const dateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const dateEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    dateEnd.setHours(dateEnd.getHours() + 3);

    console.log({ dateStart, dateEnd });
    const completedTasks = await checkinsRepository.find({
      where: {
        date_hour_applied: Between(dateStart, dateEnd),
        user_id: req.userId,
      },
      relations: ['medication', 'medication.aged'],
    });

    const nextTasks = await getUserTasks(req.userId, date);
    if (!nextTasks) {
      return res.sendStatus(400);
    }
    return res.json({ ageds: user.ageds, tasks: completedTasks, nextTasks });
  }
}

export default new HomeController();
