import { getManager, getRepository, MoreThanOrEqual } from 'typeorm';
import CheckinMedication from '../models/CheckinMedication';
import User from '../models/User';
import { getLocaledDate } from './date';

async function getUserTasks(userId: string, date: Date) {
  const userRepository = getRepository(User);
  const checkinsRepository = getRepository(CheckinMedication);
  const entityManager = getManager();

  try {
    const user = await userRepository.findOne(
      { id: userId },
      {
        relations: [
          'ageds',
          'ageds.medications',
          'ageds.medications.schedules',
        ],
      }
    );
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

    const dateEndToCompare = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    dateEndToCompare.setHours(dateEndToCompare.getHours() + 3);
    console.log(dateEndToCompare);

    let nextTasks = [];
    for (let aged of user.ageds) {
      const medications = aged.medications;
      for (let medication of medications) {
        if (medication.created_at <= dateEndToCompare) {
          const startDateFormatted = `${dateStart.getFullYear()}-${
            dateStart.getMonth() + 1
          }-${dateStart.getDate()}`;
          if (medication.time_type == 1) {
            const countCheckinsToday = await checkinsRepository.count({
              medication_id: medication.id,
              date_hour_applied: MoreThanOrEqual(startDateFormatted),
            });
            if (countCheckinsToday < medication.time_description) {
              nextTasks.push({
                medication: {
                  id: medication.id,
                  description: medication.description,
                  time_type: medication.time_type,
                  details: medication.details,
                },
                aged: {
                  gender: aged.gender,
                  name: aged.name,
                },
                remaining: medication.time_description - countCheckinsToday,
              });
            }
          } else if (medication.time_type == 2) {
            for (let schedule of medication.schedules) {
              const endDateFormatted = `${dateEnd.getFullYear()}-${
                dateEnd.getMonth() + 1
              }-${dateEnd.getDate()} 23:59:59`;
              const exists = await entityManager.query(`
                  SELECT *
                    FROM checkin_medications
                  WHERE medication_id = '${medication.id}'
                    AND schedule_id = '${schedule.id}'
                    AND date_hour_applied BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
                `);
              if (exists.length == 0) {
                nextTasks.push({
                  medication: {
                    id: medication.id,
                    description: medication.description,
                    time_type: medication.time_type,
                    details: medication.details,
                  },
                  aged: {
                    gender: aged.gender,
                    name: aged.name,
                  },
                  schedule: schedule.time,
                  schedule_id: schedule.id,
                });
              }
            }
          }
        }
      }
    }

    return nextTasks;
  } catch {
    return false;
  }
}

export { getUserTasks };
