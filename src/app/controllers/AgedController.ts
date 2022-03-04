import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Aged from "../models/Aged";

class AgedController {
    async store(req: Request, res: Response) {
        const repository = getRepository(Aged);

        const { name, birthdate, gender, address, city, state } = req.body;

        try { 
            const aged = repository.create({ name, birthdate, gender, address, city, state });
            await repository.save(aged);
    
            return res.json(aged);
        } catch {
            return res.sendStatus(400);
        }

    }
}

export default new AgedController();