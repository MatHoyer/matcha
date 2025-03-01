import { TUser } from '@matcha/common';
import db from '../database/Database';

export const fameCalculator = async (userId: TUser['id']) => {
  const likes = await db.like.findMany({
    where: {
      likedId: userId,
    },
  });

  return Math.min(likes.length / 5, 5);
};
