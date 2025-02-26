import { getUserSchema, Infer } from '@matcha/common';
import type { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({});
    res.status(200).json({ users } as Infer<typeof getUserSchema.response>);
  } catch (error) {
    console.error('Error fetching users:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};
