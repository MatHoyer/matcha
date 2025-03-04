import { getUsersSchemas, Infer, z } from '@matcha/common';
import type { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({});
    res.status(200).json({ users } as Infer<typeof getUsersSchemas.response>);
  } catch (error) {
    console.error('Error fetching users:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const paramsSchema = z.object({
      id: z.number(),
    });
    paramsSchema.parse({ id: +id });
    const user = await db.user.findFirst({
      where: {
        id: +id,
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
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};
