import { Infer, z } from '../../validator/validator';
import { globalLocationSchema } from '../database.schema';

export const getGlobalLocationsSchemas = {
  response: z.object({
    globalLocations: z.array(globalLocationSchema),
  }),
};
export type TGlobalLocationsSchemas = {
  response: Infer<typeof getGlobalLocationsSchemas.response>;
};
