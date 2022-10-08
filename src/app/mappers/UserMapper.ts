import Aged from '../models/Aged';
import { getOwnerUserFromAged } from '../repositories/AgedRespository';

export const userMapper = async (aged: Aged, userId: string) => {
  const owner = await getOwnerUserFromAged(aged.id);
  if (owner) {
    return { ...aged, owner: owner.usersId === userId };
  }
  return { ...aged, owner: false };
};
