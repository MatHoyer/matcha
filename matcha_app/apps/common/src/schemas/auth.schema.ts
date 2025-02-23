import { z } from '../validator';
import { userSchema } from './database.schema';

export const signupSchemas = {
  requirements: userSchema.pick([
    'name',
    'lastName',
    'email',
    'password',
    'age',
    'gender',
    'preference',
  ]),
  response: z.object({
    message: z.string(),
  }),
};

export const loginSchemas = {
  requirements: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: z.object({
    message: z.string(),
  }),
};

export const logoutSchemas = {
  response: z.object({
    message: z.string(),
  }),
};

export const sessionSchemas = {
  response: z.object({
    user: userSchema.pick([
      'id',
      'name',
      'lastName',
      'email',
      'age',
      'gender',
      'preference',
    ]),
  }),
};
