import { Request, Response } from 'express';
import {
  Between,
  getManager,
  getRepository,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import AgedEvent from '../models/AgedEvents';

import AgedMedication from '../models/AgedMedication';
import CheckinMedication from '../models/CheckinMedication';
import User from '../models/User';

class HomeController {
  async index(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const eventRepository = getRepository(AgedEvent);
    const checkinsRepository = getRepository(CheckinMedication);
    const entityManager = getManager();

    try {
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
      const date = new Date();
      const todayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const todayEnd = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59
      );

      let nextTasks = [];
      for (let aged of user.ageds) {
        const medications = aged.medications;
        for (let medication of medications) {
          const startDateFormatted = `${todayStart.getFullYear()}-${
            todayEnd.getMonth() + 1
          }-${todayStart.getDate()}`;
          if (medication.time_type == 1) {
            const countCheckinsToday = await checkinsRepository.count({
              medication_id: medication.id,
              date_hour_applied: MoreThanOrEqual(startDateFormatted),
            });
            if (countCheckinsToday <= medication.time_description) {
              nextTasks.push({
                ...medication,
                aged,
                remaining: medication.time_description - countCheckinsToday,
              });
            }
          } else if (medication.time_type == 2) {
            for (let schedule of medication.schedules) {
              const endDateFormatted = `${todayEnd.getFullYear()}-${
                todayEnd.getMonth() + 1
              }-${todayEnd.getDate()} 23:59:59`;
              const exists = await entityManager.query(`
                SELECT *
                  FROM checkin_medications
                WHERE medication_id = '${medication.id}'
                  AND schedule_id = '${schedule.id}'
                  AND date_hour_applied BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
              `);
              if (exists.length == 0) {
                nextTasks.push({
                  ...medication,
                  aged,
                  schedule: schedule.time,
                });
              }
            }
          }
        }
      }

      const completedTasks = await checkinsRepository.find({
        where: { created_at: Between(todayStart, date) },
        relations: ['medication', 'medication.aged'],
      });

      return res.json({ ageds: user.ageds, tasks: completedTasks, nextTasks });
    } catch {
      return res.sendStatus(400);
    }
  }
}

export default new HomeController();
