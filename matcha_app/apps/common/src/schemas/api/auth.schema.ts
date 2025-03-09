import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const signupSchemas = {
  requirements: userSchema.pick([
    'name',
    'lastName',
    'email',
    'password',
    'birthDate',
    'gender',
    'preference',
  ]),
  response: z.object({
    message: z.string(),
  }),
};
export type TSignupSchemas = {
  requirements: Infer<typeof signupSchemas.requirements>;
  response: Infer<typeof signupSchemas.response>;
};

export const loginSchemas = {
  requirements: userSchema.pick(['email', 'password']),
  response: z.object({
    message: z.string(),
  }),
};
export type TLoginSchemas = {
  requirements: Infer<typeof loginSchemas.requirements>;
  response: Infer<typeof loginSchemas.response>;
};

export const confirmSchemas = {
  response: z.object({
    message: z.string(),
  }),
};
export type TConfirmSchemas = {
  response: Infer<typeof confirmSchemas.response>;
};

export const logoutSchemas = {
  response: z.object({
    message: z.string(),
  }),
};
export type TLogoutSchemas = {
  response: Infer<typeof logoutSchemas.response>;
};

export const sessionSchemas = {
  response: z.object({
    user: userSchema.pick([
      'id',
      'name',
      'lastName',
      'email',
      'gender',
      'preference',
      'age',
      'birthDate',
      'biography',
    ]),
  }),
};
export type TSessionSchemas = {
  response: Infer<typeof sessionSchemas.response>;
};
