import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const advancedSearchSchema = {
  requirements: z.object({
    ages: z.object({
      min: z.number(),
      max: z.number(),
    }),
    fame: z.number().min(1),
    location: z.string(),
    tags: z.array(z.string()),
  }),
  response: z.object({
    users: z.array(userSchema),
  }),
};
export type TAdvancedSearchSchema = {
  requirements: Infer<typeof advancedSearchSchema.requirements>;
  response: Infer<typeof advancedSearchSchema.response>;
};
