import { Infer, z } from '../../validator/validator';

export const blockUserSchemas = {
  requirements: z.object({
    userId: z.number(),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TBlockUserSchemas = {
  requirements: Infer<typeof blockUserSchemas.requirements>;
  response: Infer<typeof blockUserSchemas.response>;
};

export const unblockUserSchemas = {
  requirements: z.object({
    userId: z.number(),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TUnblockUserSchemas = {
  requirements: Infer<typeof unblockUserSchemas.requirements>;
  response: Infer<typeof unblockUserSchemas.response>;
};
