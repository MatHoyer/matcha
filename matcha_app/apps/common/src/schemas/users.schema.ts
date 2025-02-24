import { z } from '../validator';
import { userSchema } from './database.schema';

export const getUserSchema = {
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
