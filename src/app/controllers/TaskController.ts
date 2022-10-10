import { Request, Response } from 'express';
import { Between, getRepository } from 'typeorm';
import AgedMedication from '../models/AgedMedication';
import CheckinMedication from '../models/CheckinMedication';
import User from '../models/User';
import { getUserTasks } from '../utils/sql';

class TaskController {
  async tasksFromDate(req: Request, res: Response) {
    const { date } = req.params;
    const checkinRepo = getRepository(CheckinMedication);
    const medicationRepo = getRepository(AgedMedication);
    const userRepo = getRepository(User);
    try {
      const dateFormatted = new Date(date);
      const startDateFormatted = `${dateFormatted.getFullYear()}-${
        dateFormatted.getMonth() + 1
      }-${dateFormatted.getDate()}`;
      const endDateFormatted = `${dateFormatted.getFullYear()}-${
        dateFormatted.getMonth() + 1
      }-${dateFormatted.getDate()} 23:59:59`;
      const user = await userRepo.findOne(
        { id: req.userId },
        {
          relations: [
            'ageds',
            'ageds.medications',
            'ageds.medications.schedules',
          ],
        }
      );
      let done = [];
      for (let aged of user.ageds) {
        for (let medication of aged.medications) {
          try {
            const checkins = await checkinRepo.find({
              where: {
                medication_id: medication.id,
                date_hour_applied: Between(
                  startDateFormatted,
                  endDateFormatted
                ),
              },
              relations: ['medication', 'medication.aged', 'schedule'],
            });
            checkins.forEach((checkin) => {
              done.push({
                medication: {
                  description: medication.description,
                  time_type: medication.time_type,
                  details: medication.details,
                },
                aged: {
                  gender: checkin.medication.aged.gender,
                  name: checkin.medication.aged.name,
                },
                schedule: checkin.schedule.time,
                schedule_id: checkin.schedule_id,
              });
            });
          } catch (e) {
            console.log(e);
          }
        }
      }
      const tasks = await getUserTasks(req.userId, dateFormatted);
      if (!tasks) {
        return res.status(400).json({ message: 'Erro ao buscar as tarefas' });
      }
      return res.json({ done, pending: tasks });
    } catch {
      return res.status(400).json({ message: 'Erro ao buscar as tarefas' });
    }
  }
}

export default new TaskController();
