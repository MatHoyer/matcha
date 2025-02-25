import { Infer, z } from '../validator';

export const errorSchema = z.object({
  fields: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
    })
  ),
  message: z.string(),
});
export type TErrorSchema = Infer<typeof errorSchema>;
