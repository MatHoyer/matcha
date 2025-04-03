import { Infer, z } from '../../validator/validator';

export const reportUserSchemas = {
  requirements: z.object({
    reason: z.string(),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TReportUserSchemas = {
  requirements: Infer<typeof reportUserSchemas.requirements>;
  response: Infer<typeof reportUserSchemas.response>;
};
