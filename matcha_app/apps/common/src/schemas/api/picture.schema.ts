import { Infer } from '../../validator/validator';

import { z } from '../../validator/validator';
import { imageSchema, userSchema } from '../database.schema';

export const getPictureSchemas = {
  response: z.object({
    id: imageSchema.pick(['id']).shape.id,
    isProfile: z.boolean(),
    file: z.file(),
  }),
};
export type TGetPictureSchemas = {
  response: Infer<typeof getPictureSchemas.response>;
};

export const getPicturesSchemas = {
  requirements: z.object({
    userId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    pictures: z.array(
      z.object({
        id: imageSchema.pick(['id']).shape.id,
        isProfile: z.boolean(),
        file: z.file(),
      })
    ),
  }),
};
export type TGetPicturesSchemas = {
  requirements: Infer<typeof getPicturesSchemas.requirements>;
  response: Infer<typeof getPicturesSchemas.response>;
};

export const createPictureSchemas = {
  requirements: z.object({
    picture: z.file().accept(['image/']),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TCreatePictureSchemas = {
  requirements: Infer<typeof createPictureSchemas.requirements>;
  response: Infer<typeof createPictureSchemas.response>;
};
