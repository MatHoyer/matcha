import { Infer } from '../../validator/validator';

import { z } from '../../validator/validator';
import { imageSchema, userSchema } from '../database.schema';

export const getPictureSchemas = {
  response: z.object({
    id: imageSchema.pick(['id']).shape.id,
    isProfile: z.boolean(),
    file: z.object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
      buffer: z.array(z.number()),
    }),
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
        file: z.object({
          name: z.string(),
          type: z.string(),
          size: z.number(),
          buffer: z.array(z.number()),
        }),
      })
    ),
  }),
};
export type TGetPicturesSchemas = {
  requirements: Infer<typeof getPicturesSchemas.requirements>;
  response: Infer<typeof getPicturesSchemas.response>;
};

export const getProfilePictureSchemas = {
  response: z.object({
    picture: z.object({
      id: imageSchema.pick(['id']).shape.id,
      isProfile: z.boolean(),
      file: z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
        buffer: z.array(z.number()),
      }),
    }),
  }),
};
export type TGetProfilePictureSchemas = {
  response: Infer<typeof getProfilePictureSchemas.response>;
};

export const createPictureSchemas = {
  requirements: z.object({
    picture: z.object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
      buffer: z.array(z.number()),
    }),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TCreatePictureSchemas = {
  requirements: Infer<typeof createPictureSchemas.requirements>;
  response: Infer<typeof createPictureSchemas.response>;
};

export const deletePictureSchemas = {
  response: z.object({
    message: z.string(),
  }),
};
export type TDeletePictureSchemas = {
  response: Infer<typeof deletePictureSchemas.response>;
};

export const updatePictureSchemas = {
  requirements: z.object({
    ...imageSchema.pick(['isProfile']).partial().shape,
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TUpdatePictureSchemas = {
  requirements: Infer<typeof updatePictureSchemas.requirements>;
  response: Infer<typeof updatePictureSchemas.response>;
};
