import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Aged from '../models/Aged';
import AgedMedication from '../models/AgedMedication';
import ScheduleMedication from '../models/ScheduleMedication';

class AgedMedicationController {
  async store(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
    const scheduleRepo = getRepository(ScheduleMedication);
    const { aged_id } = req.params;
    const { description, details, time_type, time_description, schedules } =
      req.body;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const medication = medicationRepo.create({
        aged_id,
        description,
        details,
        time_type,
        time_description,
      });
      await medicationRepo.save(medication);

      if (schedules && schedules.length > 0) {
        for (let schedule of schedules) {
          const newSchedule = scheduleRepo.create({
            medication_id: medication.id,
            time: schedule,
          });
          await scheduleRepo.save(newSchedule);
        }
      }

      return res.send(medication);
    } catch (err) {
      console.log('erro ', err);
      return res.sendStatus(400);
    }
  }
  async list(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
    const { aged_id } = req.params;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const medications = await medicationRepo.find({
        where: {
          aged_id,
        },
        relations: ['schedules'],
      });

      return res.send(medications);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async delete(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
    const scheduleRepo = getRepository(ScheduleMedication);
    const { aged_id, medication_id } = req.params;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const medication = await medicationRepo.findOne({ id: medication_id });
      if (!medication) {
        return res.status(404).json({ message: 'Medicação não encontrada' });
      }
      if (medication.time_type === 2) {
        await scheduleRepo.delete({ medication_id });
      }
      await medicationRepo.delete({ id: medication_id });

      return res.send();
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
  async update(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
    const scheduleRepo = getRepository(ScheduleMedication);

    const { aged_id, medication_id } = req.params;
    const { description, details, time_type, time_description, schedules } =
      req.body;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const medication = await medicationRepo.findOne({ id: medication_id });
      if (!medication) {
        return res.status(404).json({ message: 'Medicação não encontrada' });
      }
      const updated = {
        ...medication,
        description,
        details,
        time_type,
        time_description: time_description || null,
      };
      await medicationRepo.save(updated);

      if (schedules && schedules.length > 0) {
        await scheduleRepo.delete({ medication_id });
        for (let schedule of schedules) {
          const newSchedule = scheduleRepo.create({
            medication_id,
            time: schedule,
          });
          await scheduleRepo.save(newSchedule);
        }
      }

      return res.json(updated);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
}

export default new AgedMedicationController();
