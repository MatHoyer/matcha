import { Infer, z } from '../../validator/validator';
import { tagSchema, userSchema } from '../database.schema';

export const getUsersSchemas = {
  response: z.object({
    users: z.array(
      userSchema.pick([
        'id',
        'name',
        'lastName',
        'email',
        'gender',
        'preference',
        'age',
        'birthDate',
        'biography',
        'lastTimeOnline',
        'isOnline',
      ])
    ),
  }),
};
export type TGetUsersSchemas = {
  response: Infer<typeof getUsersSchemas.response>;
};

export const usersMatchSchemas = {
  response: z.object({
    matched: z.boolean(),
  }),
};

export const getUserSchemas = {
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
      'lastTimeOnline',
      'isOnline',
    ]),
  }),
};
export type TGetUserSchemas = {
  response: Infer<typeof getUserSchemas.response>;
};

export const updateUserSchemas = {
  requirements: z.object({
    ...userSchema.pick([
      'name',
      'lastName',
      'email',
      'gender',
      'preference',
      'birthDate',
      'biography',
    ]).shape,
    tags: z.array(tagSchema.pick(['name']).shape.name),
    location: z.string(),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TUpdateUserSchemas = {
  requirements: Infer<typeof updateUserSchemas.requirements>;
  response: Infer<typeof updateUserSchemas.response>;
};

export const getUserFameSchemas = {
  response: z.object({
    fame: z.number(),
  }),
};
export type TGetUserFameSchemas = {
  response: Infer<typeof getUserFameSchemas.response>;
};

export const askResetPasswordSchemas = {
  response: z.object({
    message: z.string(),
  }),
};
export type TAskResetPasswordSchemas = {
  response: Infer<typeof askResetPasswordSchemas.response>;
};

export const resetPasswordSchemas = {
  requirements: z.object({
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TResetPasswordSchemas = {
  requirements: Infer<typeof resetPasswordSchemas.requirements>;
  response: Infer<typeof resetPasswordSchemas.response>;
};

export const isBlockedSchemas = {
  response: z.object({
    blocked: z.boolean(),
  }),
};
export type TIsBlockedSchemas = {
  response: Infer<typeof isBlockedSchemas.response>;
};
