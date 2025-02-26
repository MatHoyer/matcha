import { ZodType } from '@matcha/common';
import type { NextFunction, Request, Response } from 'express';
import { defaultResponse } from '../utils/defaultResponse';

export const bodyParser =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.error(`Error at ${req.url}:`, error);
      return defaultResponse({
        res,
        status: 500,
        json: { message: 'Bad body' },
      });
    }
  };
