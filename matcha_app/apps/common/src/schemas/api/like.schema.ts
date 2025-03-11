import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const isLikedSchemas = {
  response: z.object({
    isLiked: z.boolean(),
  }),
};
export type TIsLikedSchemas = {
  response: Infer<typeof isLikedSchemas.response>;
};

export const createLikeSchemas = {
  requirements: z.object({
    likedId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TCreateLikeSchemas = {
  requirements: Infer<typeof createLikeSchemas.requirements>;
  response: Infer<typeof createLikeSchemas.response>;
};

export const deleteLikeSchemas = {
  requirements: z.object({
    likedId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TDeleteLikeSchemas = {
  requirements: Infer<typeof deleteLikeSchemas.requirements>;
  response: Infer<typeof deleteLikeSchemas.response>;
};
