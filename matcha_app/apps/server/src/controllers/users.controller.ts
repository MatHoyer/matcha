import { getUserSchema, Infer, TErrorSchema } from '@matcha/common';
import type { Request, Response } from 'express';
import db from '../database/Database';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      take: 1,
    });
    res.status(200).json({ users } as Infer<typeof getUserSchema.response>);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' } as TErrorSchema);
  }
};
