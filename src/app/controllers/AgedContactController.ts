import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Aged from "../models/Aged";

import AgedContact from "../models/AgedContact";

class AgedContactController {
  async store(req: Request, res: Response) {
    const agedRepository = getRepository(Aged);
    const repository = getRepository(AgedContact);
    const { aged_id } = req.params;
    const { type, description } = req.body;

    try {
      const aged = await agedRepository.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: "Idoso não encontrado" });
      }

      const contact = repository.create({ aged_id, type, description });
      await repository.save(contact);

      return res.json(contact);
    } catch {
      return res.sendStatus(400);
    }
  }
  async listFromAged(req: Request, res: Response) {
    const { aged_id } = req.params;

    try {
      const agedRepository = getRepository(Aged);
      const repository = getRepository(AgedContact);

      const aged = await agedRepository.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: "Idoso não encontrado" });
      }

      const contacts = await repository.find({ aged_id });
      return res.json(contacts);
    } catch {
      return res.sendStatus(400);
    }
  }
}

export default new AgedContactController();
