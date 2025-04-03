import { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const reportUser = async (req: Request, res: Response) => {
  const { reason } = req.body;
  const { userId } = req.params;
  const { id } = req.user;

  const user = await db.user.findFirst({
    where: {
      id: +userId,
    },
  });
  if (!user) {
    return defaultResponse({
      res,
      status: 404,
      json: {
        message: 'User not found',
      },
    });
  }

  await db.report.create({
    data: {
      reportedId: user.id,
      userId: id,
      reason,
    },
  });

  return defaultResponse({
    res,
    status: 200,
    json: {
      message: 'Report created',
    },
  });
};
