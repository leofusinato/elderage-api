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
}

export default new AgedController();
