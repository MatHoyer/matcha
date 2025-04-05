import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const signupSchemas = {
  requirements: z.object({
    ...userSchema.pick([
      'name',
      'lastName',
      'email',
      'username',
      'birthDate',
      'gender',
      'preference',
    ]).shape,
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
  }),
  response: z.object({
    message: z.string(),
    resendToken: z.string(),
  }),
};
export type TSignupSchemas = {
  requirements: Infer<typeof signupSchemas.requirements>;
  response: Infer<typeof signupSchemas.response>;
};

export const loginSchemas = {
  requirements: userSchema.pick(['username', 'password']),
  response: z.object({
    message: z.string(),
    resendToken: z.string().optional(),
  }),
};
export type TLoginSchemas = {
  requirements: Infer<typeof loginSchemas.requirements>;
  response: Infer<typeof loginSchemas.response>;
};

export const resendConfirmSchemas = {
  response: z.object({
    message: z.string(),
  }),
};
export type TResendConfirmSchemas = {
  response: Infer<typeof resendConfirmSchemas.response>;
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
      'username',
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
