import { getManager, getRepository } from 'typeorm';
import AgedUser from '../models/AgedUser';

export const addUserToAged = async (
  agedId: string,
  userId: string,
  owner: boolean = false
) => {
  const agedUsersRepo = getRepository(AgedUser);
  const newUser = await agedUsersRepo.save({
    usersId: userId,
    agedsId: agedId,
    owner,
  });
  return newUser;
  //   const entityManager = getManager();
  //   const sql = `
  //     INSERT INTO public.users_ageds_ageds(
  //         "usersId", "agedsId", owner)
  //         VALUES (${userId}, ${agedId}, ${owner});
  //     `;
  //   await entityManager.query(sql);
};

export const getAllUsersFromAged = async (agedId: string) => {
  const agedUsersRepo = getRepository(AgedUser);
  const list = await agedUsersRepo.find({ where: { agedsId: agedId } });
  return list;
  //   const entityManager = getManager();
  //   const sql = `SELECT * FROM public.users_ageds_ageds WHERE aged_id  = ${agedId}`;
};

export const getOwnerUserFromAged = async (agedId: string) => {
  const entityManager = getManager();
  const sql = `SELECT * FROM users_ageds_ageds WHERE "agedsId"  = '${agedId}' AND owner = true`;
  const owner = await entityManager.query(sql);
  return owner[0];
  //   const agedUsersRepo = getRepository(AgedUser);
  //   const list = await agedUsersRepo.findOne({
  //     where: { agedsId: agedId, owner: true },
  //   });
  //   return list;
};
