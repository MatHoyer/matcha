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
      location: Infer<
        typeof advancedSearchSchema.response
      >['users'][number]['location'];
      tags: Infer<
        typeof advancedSearchSchema.response
      >['users'][number]['tags'];
      fame: Infer<
        typeof advancedSearchSchema.response
      >['users'][number]['fame'];
    }[];
  };
};

export const forYouSchema = {
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
        location: z.object({
          order: z.number(),
          name: z.string(),
        }),
        tags: z.object({
          order: z.number(),
          names: z.array(tagSchema),
        }),
        fame: z.number(),
      })
    ),
  }),
};
export type TForYouSchema = {
  requirements: Infer<typeof forYouSchema.requirements>;
  response: {
    users: {
      user: Infer<typeof userSchema>;
      location: Infer<
        typeof forYouSchema.response
      >['users'][number]['location'];
      tags: Infer<typeof forYouSchema.response>['users'][number]['tags'];
      fame: Infer<typeof forYouSchema.response>['users'][number]['fame'];
    }[];
  };
};

export const suggestUsersSchema = {
  response: z.object({
    users: z.array(
      z.object({
        user: userSchema,
        location: z.object({
          order: z.number(),
          name: z.string(),
        }),
        tags: z.object({
          order: z.number(),
          names: z.array(tagSchema),
        }),
        fame: z.number(),
      })
    ),
  }),
};
export type TSuggestUsersSchema = {
  response: {
    users: {
      user: Infer<typeof userSchema>;
      location: Infer<
        typeof suggestUsersSchema.response
      >['users'][number]['location'];
      tags: Infer<typeof suggestUsersSchema.response>['users'][number]['tags'];
      fame: Infer<typeof suggestUsersSchema.response>['users'][number]['fame'];
    }[];
  };
};
