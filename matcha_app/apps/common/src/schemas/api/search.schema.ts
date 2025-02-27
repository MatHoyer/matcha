import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const targetedSearchSchema = {
  requirements: z.object({
    ages: z.object({
      min: z.number(),
      max: z.number(),
    }),
    fame: z.number(),
    location: z.string(),
    tags: z.array(z.string()),
  }),
  response: z.object({
    users: z.array(userSchema),
  }),
};
export type TTargetedSearchSchema = {
  requirements: Infer<typeof targetedSearchSchema.requirements>;
  response: Infer<typeof targetedSearchSchema.response>;
};
