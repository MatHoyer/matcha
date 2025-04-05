import { TBlockUserSchemas, TUnblockUserSchemas } from '@matcha/common';
import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const blockUser = async (req: Request, res: Response) => {
  const { userId } = req.body as TBlockUserSchemas['requirements'];
  const { id } = req.user;

  const block = await db.block.findFirst({
    where: {
      userId: id,
      blockedId: userId,
    },
  });
  if (!block) {
    await db.block.create({
      data: {
        userId: id,
        blockedId: userId,
      },
    });
  }

  return defaultResponse({
    res,
    status: 200,
    json: { message: 'User blocked' },
  });
};

export const unblockUser = async (req: Request, res: Response) => {
  const { userId } = req.body as TUnblockUserSchemas['requirements'];
  const { id } = req.user;

  const block = await db.block.findFirst({
    where: {
      userId: id,
      blockedId: userId,
    },
  });
  if (block) {
    await db.block.remove({
      where: {
        id: block.id,
      },
    });
  }

  return defaultResponse({
    res,
    status: 200,
    json: { message: 'User unblocked' },
  });
};
