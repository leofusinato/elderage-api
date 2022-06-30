import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Aged from '../models/Aged';
import AgedEvent from '../models/AgedEvents';

class AgedEventController {
  async store(req: Request, res: Response) {
    const { aged_id, local, description, date } = req.body;

    const agedRepository = getRepository(Aged);
    const eventRepository = getRepository(AgedEvent);

    try {
      const aged = await agedRepository.findOne({ id: aged_id });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const event = eventRepository.create({
        aged_id,
        local,
        description,
        date,
      });
      await eventRepository.save(event);

      return res.json(event);
    } catch {
      return res.sendStatus(400);
    }
  }
  async index(req: Request, res: Response) {
    const { eventId } = req.params;
    const eventRepository = getRepository(AgedEvent);

    try {
      const event = await eventRepository.findOne({ id: eventId });
      if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      return res.json(event);
    } catch {
      return res.sendStatus(400);
    }
  }
  async indexFromAged(req: Request, res: Response) {
    const { agedId } = req.params;
    const agedRepository = getRepository(Aged);
    const eventRepository = getRepository(AgedEvent);

    try {
      const aged = await agedRepository.findOne({ id: agedId });
      if (!aged) {
        return res.status(404).json({ message: 'Idoso não encontrado' });
      }

      const events = await eventRepository.find({ aged_id: agedId });

      return res.json(events);
    } catch {
      return res.sendStatus(400);
    }
  }
  async delete(req: Request, res: Response) {
    const { eventId } = req.params;
    const eventRepository = getRepository(AgedEvent);

    try {
      const event = await eventRepository.findOne({ id: eventId });
      if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      await eventRepository.delete({ id: eventId });

      return res.json();
    } catch {
      return res.sendStatus(400);
    }
  }
  async update(req: Request, res: Response) {
    const { eventId } = req.params;
    const { local, description, date } = req.body;

    const eventRepository = getRepository(AgedEvent);

    try {
      const event = await eventRepository.findOne({ id: eventId });
      if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      const updated = { ...event, local, description, date };
      await eventRepository.save({ ...event, local, description, date });

      return res.json(updated);
    } catch {
      return res.sendStatus(400);
    }
  }
}

export default new AgedEventController();
