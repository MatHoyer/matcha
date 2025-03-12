import { Infer, z } from '../../validator/validator';

export const updateLocationSchemas = {
  requirements: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TUpdateLocationSchemas = {
  requirements: Infer<typeof updateLocationSchemas.requirements>;
  response: Infer<typeof updateLocationSchemas.response>;
};

export const isNeedUpdateLocationSchemas = {
  response: z.object({
    message: z.string(),
    isNeedUpdate: z.boolean(),
  }),
};
export type TIsNeedUpdateLocationSchemas = {
  response: Infer<typeof isNeedUpdateLocationSchemas.response>;
};

export const getUserLocationSchemas = {
  response: z.object({
    location: z.object({
      name: z.string(),
    }),
  }),
};
export type TGetUserLocationSchemas = {
  response: Infer<typeof getUserLocationSchemas.response>;
};
