import { ZodType } from '@matcha/common';
import type { NextFunction, Request, Response } from 'express';
import { defaultResponse } from '../utils/defaultResponse';

export const bodyParser =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      console.error('Bad body error: ', parsed.error);
      return defaultResponse({
        res,
        status: 400,
        json: { message: 'Bad body', fields: parsed.error.fields },
      });
    }
    next();
  };
