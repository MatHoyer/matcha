import { Infer, z } from '../../validator/validator';
import { tagSchema, userSchema } from '../database.schema';

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
    users: z.array(
      z.object({
        user: userSchema,
        location: z.string(),
        tags: z.array(tagSchema),
        fame: z.number(),
      })
    ),
  }),
};
export type TAdvancedSearchSchema = {
  requirements: Infer<typeof advancedSearchSchema.requirements>;
  response: {
    users: {
      user: Infer<typeof userSchema>;
      location: Infer<typeof advancedSearchSchema.requirements>['location'];
      tags: Infer<typeof tagSchema>[];
      fame: Infer<typeof advancedSearchSchema.requirements>['fame'];
    }[];
  };
};
