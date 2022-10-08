import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { userMapper } from '../mappers/UserMapper';
import Aged from '../models/Aged';
import AgedContact from '../models/AgedContact';
import AgedUser from '../models/AgedUser';
import User from '../models/User';
import { getOwnerUserFromAged } from '../repositories/AgedRespository';

class AgedController {
  async store(req: Request, res: Response) {
    const agedRepository = getRepository(Aged);
    const userRepository = getRepository(User);
    const agedUsersRepo = getRepository(AgedUser);
    const contactRepository = getRepository(AgedContact);

    const { name, birthdate, gender, address, city, state, contacts } =
      req.body;

    try {
      const userId = req.userId;

      const aged = agedRepository.create({
        name,
        birthdate,
        gender,
        address,
        city,
        state,
      });
      const newAged = await agedRepository.save(aged);
      await agedUsersRepo.save({
        usersId: userId,
        agedsId: newAged.id,
        owner: true,
      });

      contacts.map(async (contact: AgedContact) => {
        const newContact = contactRepository.create({
          aged_id: aged.id,
          type: contact.type,
          description: contact.description,
          name: contact.name,
        });
        await contactRepository.save(newContact);
      });

      const user = await userRepository.findOne(
        { id: userId },
        { relations: ['ageds'] }
      );

      userRepository.save(user);

      return res.json(aged);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
  async list(req: Request, res: Response) {
    const agedRepository = getRepository(Aged);
    const ageds = await agedRepository.find();
    const list = [];
    for (let aged of ageds) {
      const mapped = await userMapper(aged, req.userId);
      list.push(mapped);
    }
    return res.json(list);
  }
  async index(req: Request, res: Response) {
    const { aged_id } = req.params;
    const agedRepository = getRepository(Aged);
    try {
      const aged = await agedRepository.findOne(
        { id: aged_id },
        { relations: ['contacts', 'medications'] }
      );
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }
      const mappedUser = await userMapper(aged, req.userId);
      return res.json(mappedUser);
    } catch {
      return res.sendStatus(400);
    }
  }
  async delete(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const contactsRepo = getRepository(AgedContact);

    const { aged_id } = req.params;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });

      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }
      const ownerUser = await getOwnerUserFromAged(aged.id);
      if (ownerUser.usersId != req.userId) {
        return res
          .status(403)
          .json({ message: 'Apenas quem cadastrou o idoso pode excluí-lo' });
      }
      await contactsRepo.delete({ aged_id });
      await agedRepo.delete({ id: aged_id });

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
  async update(req: Request, res: Response) {
    const agedRepo = getRepository(Aged);
    const contactsRepo = getRepository(AgedContact);

    const { aged_id } = req.params;
    const { name, birthdate, gender, address, city, state, contacts } =
      req.body;

    try {
      const aged = await agedRepo.findOne({ id: aged_id });

      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }
      const ownerUser = await getOwnerUserFromAged(aged.id);
      if (ownerUser.usersId != req.userId) {
        return res
          .status(403)
          .json({ message: 'Apenas quem cadastrou o idoso pode alterá-lo' });
      }

      const updated = {
        ...aged,
        name,
        birthdate,
        gender,
        address,
        city,
        state,
      };
      await agedRepo.save(updated);

      if (!!contacts && contacts.constructor === Array) {
        contacts.map(async (contact) => {
          const contactToUpdate = await contactsRepo.findOne({
            id: contact.id,
          });
          if (!contactToUpdate) {
            return res.status(404).json({ message: 'Contato não encontrado' });
          }
          await contactsRepo.save({
            ...contactToUpdate,
            type: contact.type,
            description: contact.description,
          });
        });
      }

      return res.status(200).json({ updated });
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
}

export default new AgedController();
