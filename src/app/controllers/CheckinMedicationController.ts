import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Aged from '../models/Aged';
import AgedMedication from '../models/AgedMedication';
import CheckinMedication from '../models/CheckinMedication';

class CheckinMedicationController {
  async store(req: Request, res: Response) {
    const checkinRepo = getRepository(CheckinMedication);
    const medicationRepo = getRepository(AgedMedication);

    const { medication_id, date_hour_applied, schedule_id } = req.body;

    try {
      const medication = await medicationRepo.findOne({ id: medication_id });
      if (!medication) {
        return res.status(404).json({ message: 'Medicação não encontrada' });
      }
      const checkin = checkinRepo.create({
        user_id: req.userId,
        medication_id,
        date_hour_applied,
        schedule_id,
      });
      await checkinRepo.save(checkin);

      return res.json(checkin);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async indexFromMedication(req: Request, res: Response) {
    const checkinRepo = getRepository(CheckinMedication);
    const medicationRepo = getRepository(AgedMedication);

    const { medication_id } = req.params;

    try {
      const medication = await medicationRepo.findOne({ id: medication_id });
      if (!medication) {
        return res.status(404).json({ message: 'Medicação não encontrada' });
      }

      const checkins = await checkinRepo.find({ medication_id });
      return res.json(checkins);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async indexFromUser(req: Request, res: Response) {
    const checkinRepo = getRepository(CheckinMedication);
    try {
      const checkins = await checkinRepo.find({ user_id: req.userId });
      return res.json(checkins);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async indexFromAged(req: Request, res: Response) {
    const checkinRepo = getRepository(CheckinMedication);
    const agedRepo = getRepository(Aged);

    const { aged_id } = req.params;
    const { date } = req.query;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      let sql = `SELECT * FROM checkin_medications LEFT JOIN aged_medication ON aged_medication.id = checkin_medications.medication_id WHERE aged_medication.aged_id = '${aged_id}'`;
      if (date) {
        sql += ` AND DATE(checkin_medications.date_hour_applied) = '${date}'`;
      }

      const checkins = await checkinRepo.query(sql);
      return res.json(checkins);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
}

export default new CheckinMedicationController();
