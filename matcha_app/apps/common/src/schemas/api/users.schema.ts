import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const getUsersSchemas = {
  response: z.object({
    users: z.array(userSchema),
  }),
};
export type TGetUsersSchemas = {
  response: Infer<typeof getUsersSchemas.response>;
};

export const getUserSchemas = {
  response: z.object({
    user: userSchema,
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
    ]).shape,
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TUpdateUserSchemas = {
  requirements: Infer<typeof updateUserSchemas.requirements>;
  response: Infer<typeof updateUserSchemas.response>;
};
