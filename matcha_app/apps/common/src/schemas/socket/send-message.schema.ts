import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const sendMessageSchema = z.object({
  receiverId: userSchema.pick(['id']).shape.id,
  senderId: userSchema.pick(['id']).shape.id,
  message: z.string(),
});
export type TSendMessageSchema = Infer<typeof sendMessageSchema>;
