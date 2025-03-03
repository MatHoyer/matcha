import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const getUsersSchemas = {
  response: z.object({
    users: z.array(
      userSchema.pick([
        'id',
        'name',
        'lastName',
        'email',
        'age',
        'gender',
        'preference',
      ])
    ),
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
