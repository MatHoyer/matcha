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
