import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

class UserController {
  async list(req: Request, res: Response) {
    const repository = getRepository(User);

    const users = await repository.find();
    users.map((user) => {
      delete user.password;
    });

    return res.send(users);
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, name, password } = req.body;

    const userExists = await repository.findOne({ where: { email } });
    if (userExists) {
      return res.sendStatus(409);
    }

    const user = repository.create({ email, name, password });
    await repository.save(user);

    return res.json(user);
  }
}

export default new UserController();
