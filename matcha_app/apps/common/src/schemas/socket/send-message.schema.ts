import { Infer, z } from '../../validator/validator';
import { userSchema } from '../database.schema';

export const sendMessageSchema = z.object({
  receiverId: userSchema.shape.id,
  senderId: userSchema.shape.id,
  message: z.string(),
});
export type TSendMessageSchema = Infer<typeof sendMessageSchema>;
