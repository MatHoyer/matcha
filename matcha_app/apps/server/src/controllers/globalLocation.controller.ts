import { Request, Response } from 'express';
import db from '../database/Database';

export const getGlobalLocations = async (_req: Request, res: Response) => {
  const gl = await db.globalLocation.findMany({});

  res.status(200).json({ globalLocations: gl });
};
