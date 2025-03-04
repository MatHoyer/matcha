import { Infer, z } from '../../validator/validator';
import { messageSchema, userSchema } from '../database.schema';

export const messagesSchemas = {
  requirements: z.object({
    userId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    messages: z.array(messageSchema),
  }),
};
export type TMessagesSchemas = {
  requirements: Infer<typeof messagesSchemas.requirements>;
  response: Infer<typeof messagesSchemas.response>;
};
