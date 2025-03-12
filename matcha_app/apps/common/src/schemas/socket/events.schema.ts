import { z } from '../../validator/validator';

import { likeSchema, userSchema } from '../database.schema';
import { Infer } from '../../../dist/validator/validator';

export const sendMessageSchema = z.object({
  receiverId: userSchema.pick(['id']).shape.id,
  senderId: userSchema.pick(['id']).shape.id,
  message: z.string(),
});
export type TSendMessageSchema = Infer<typeof sendMessageSchema>;

export const likesSchema = z.object({
  receiverLikeId: userSchema.pick(['id']).shape.id,
  senderLikeId: userSchema.pick(['id']).shape.id,
});

export const events = {
  'send-message': sendMessageSchema,
  'send-feedback': sendMessageSchema,
  'send-like-unlike': likesSchema,
  disconnect: z.null(),
};
