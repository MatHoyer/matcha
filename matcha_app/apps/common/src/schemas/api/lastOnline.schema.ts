import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const lastOnlineSchema = {
  requirements: z.object({
    userId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    lastOnline: z.string(),
  }),
};
export type TLastOnlineSchema = {
  requirements: Infer<typeof lastOnlineSchema.requirements>;
};
