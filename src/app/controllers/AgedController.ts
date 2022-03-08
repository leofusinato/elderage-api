import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Aged from "../models/Aged";
import AgedContact from "../models/AgedContact";
import User from "../models/User";

class AgedController {
  async store(req: Request, res: Response) {
    const agedRepository = getRepository(Aged);
    const userRepository = getRepository(User);
    const contactRepository = getRepository(AgedContact);

    const { name, birthdate, gender, address, city, state, contacts } =
      req.body;

    try {
      const userId = req.userId;

      const aged = agedRepository.create({
        user_id: userId,
        name,
        birthdate,
        gender,
        address,
        city,
        state,
      });
      await agedRepository.save(aged);

      contacts.map(async (contact: AgedContact) => {
        const newContact = contactRepository.create({
          aged_id: aged.id,
          type: contact.type,
          description: contact.description,
        });
        await contactRepository.save(newContact);
      });

      const user = await userRepository.findOne(
        { id: userId },
        { relations: ["ageds"] }
      );

      user.ageds = [...user.ageds, aged];
      userRepository.save(user);

      return res.json(aged);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async list(req: Request, res: Response) {
    const agedRepository = getRepository(Aged);
    const ageds = await agedRepository.find();
    return res.json(ageds);
  }
  async delete(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const contactsRepo = getRepository(AgedContact);

    const { aged_id } = req.params;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });

      if (!aged) {
        return res.status(404).json({ message: "Idoso não encontrado" });
      }
      if (aged.user_id != req.userId) {
        return res
          .status(403)
          .json({ message: "Apenas quem cadastrou o idoso pode excluí-lo" });
      }
      await contactsRepo.delete({ aged_id });
      await agedRepo.delete({ id: aged_id });

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
}

export default new AgedController();
