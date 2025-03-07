import { ZodType } from '@matcha/common';
import { NextFunction, Request, Response } from 'express';
import { defaultResponse } from '../utils/defaultResponse';

export const paramsParser =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return defaultResponse({
        res,
        status: 400,
        json: { message: 'Bad params', fields: parsed.error.fields },
      });
    }
    next();
  };
