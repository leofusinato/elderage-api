import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Aged from '../models/Aged';
import Anamnesis from '../models/Anamnesis';

class AnamnesisController {
  async store(req: Request, res: Response) {
    const anamnesisRepo = getRepository(Anamnesis);
    const agedRepo = getRepository(Aged);
    const { aged_id } = req.body;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }
      const anamnesis = anamnesisRepo.create({
        user_id: req.userId,
        ...req.body,
      });
      await anamnesisRepo.save(anamnesis);
      return res.json(anamnesis);
    } catch {
      return res.sendStatus(400);
    }
  }
  async update(req: Request, res: Response) {
    const anamnesisRepo = getRepository(Anamnesis);
    const { anamnesisId } = req.params;

    try {
      const anamnesis = await anamnesisRepo.findOne({ id: anamnesisId });
      if (!anamnesis) {
        return res.status(404).json({ message: 'Anamnese não encontrada' });
      }

      const updated = {
        ...anamnesis,
        ...req.body,
      };
      await anamnesisRepo.save(updated);
      return res.json({ updated });
    } catch {
      return res.sendStatus(400);
    }
  }
  async delete(req: Request, res: Response) {
    const anamnesisRepo = getRepository(Anamnesis);
    const { anamnesisId } = req.params;

    try {
      const anamnesis = await anamnesisRepo.findOne({ id: anamnesisId });
      if (!anamnesis) {
        return res.status(404).json({ message: 'Anamnese não encontrada' });
      }
      await anamnesisRepo.delete({ id: anamnesisId });
      return res.json();
    } catch {
      return res.sendStatus(400);
    }
  }
  async indexFromAged(req: Request, res: Response) {
    const anamnesisRepo = getRepository(Anamnesis);
    const agedRepo = getRepository(Aged);
    const { agedId } = req.params;

    try {
      const aged = await agedRepo.findOne({ id: agedId });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const anamnesis = await anamnesisRepo.find({ aged_id: agedId });
      return res.json(anamnesis);
    } catch {
      return res.sendStatus(400);
    }
  }
  async index(req: Request, res: Response) {
    const anamnesisRepo = getRepository(Anamnesis);
    const { anamnesisId } = req.params;

    try {
      const anamnesis = await anamnesisRepo.findOne({ id: anamnesisId });
      if (!anamnesis) {
        return res.status(404).json({ message: 'Anamnese não encontrada' });
      }
      return res.json(anamnesis);
    } catch {
      return res.sendStatus(400);
    }
  }
}
export default new AnamnesisController();
