import { errorSchema, TErrorSchema } from '@matcha/common';
import { CookieOptions, Response } from 'express';

export const defaultResponse = (data: {
  res: Response;
  status: number;
  cookie?: { name: string; val: string; options: CookieOptions };
  json: Omit<TErrorSchema, 'fields'> & Partial<Pick<TErrorSchema, 'fields'>>;
}) => {
  const { res, cookie } = data;
  let { status, json } = data;

  if (!json.fields) {
    json.fields = [];
  }
  try {
    errorSchema.parse(json);
  } catch (_error) {
    json = {
      message: 'Internal server error',
      fields: [],
    };
    status = 500;
  }
  if (!cookie) {
    return res.status(status).json(json);
  }
  res.status(status).cookie(cookie.name, cookie.val, cookie.options).json(json);
};
