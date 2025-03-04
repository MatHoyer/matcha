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

export const updateUserSchemas = {
  requirements: z.object({
    id: userSchema.pick(['id']).shape.id,
    ...userSchema
      .pick(['name', 'lastName', 'email', 'gender', 'preference', 'age'])
      .partial().shape,
  }),
  response: z.object({
    user: userSchema,
  }),
};
export type TUpdateUserSchemas = {
  requirements: Infer<typeof updateUserSchemas.requirements>;
  response: Infer<typeof updateUserSchemas.response>;
};
