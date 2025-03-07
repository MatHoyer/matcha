import { Infer, z } from '../../validator/validator';
import { tagSchema } from '../database.schema';

export const getTagsSchemas = {
  response: z.object({
    tags: z.array(tagSchema),
  }),
};
export type TTagSchemas = {
  response: Infer<typeof getTagsSchemas.response>;
};

export const createTagSchemas = {
  requirements: z.object({
    name: z.string().min(1),
  }),
  response: z.object({
    message: z.string(),
  }),
};
export type TCreateTagSchemas = {
  requirements: Infer<typeof createTagSchemas.requirements>;
  response: Infer<typeof createTagSchemas.response>;
};

export const getUserTagsSchemas = {
  response: z.object({
    tags: z.array(tagSchema),
  }),
};
export type TGetUserTagsSchemas = {
  response: Infer<typeof getUserTagsSchemas.response>;
};
