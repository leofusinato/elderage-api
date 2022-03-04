import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Aged from "../models/Aged";
import User from "../models/User";

class AgedController {
    async store(req: Request, res: Response) {
        const agedRepository = getRepository(Aged);
        const userRepository = getRepository(User);

        const { name, birthdate, gender, address, city, state } = req.body;

        try { 
            const aged = agedRepository.create({ name, birthdate, gender, address, city, state });
            await agedRepository.save(aged);

            const userId = req.userId;
            const user = await userRepository.findOne({ id: userId }, { relations: ['ageds'] });

            user.ageds = [...user.ageds, aged];
            userRepository.save(user);
    
            return res.json(aged);
        } catch(err) {
            return res.sendStatus(400);
        }

    }
}

export default new AgedController();