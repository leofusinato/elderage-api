import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Aged from '../models/Aged';
import AgedMedication from '../models/AgedMedication';

class AgedMedicationController {
  async store(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
    const { aged_id } = req.params;
    const { description, details, time_type, time_description } = req.body;

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

      return res.send(medication);
    } catch (err) {
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

      const medications = await medicationRepo.find();

      return res.send(medications);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async delete(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
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

      await medicationRepo.delete({ id: medication_id });

      return res.send();
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async update(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const medicationRepo = getRepository(AgedMedication);
    const { aged_id, medication_id } = req.params;
    const { description, details, time_type, time_description } = req.body;

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
        time_description,
      };
      await medicationRepo.save(updated);

      return res.json(updated);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
}

export default new AgedMedicationController();
