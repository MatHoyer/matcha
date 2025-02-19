import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from '../utils/validator.ts';

export const bodyParser =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.error(`Error at ${req.url}:`, error);
      res.status(500).json({ error: 'Body not good' });
    }
  };
