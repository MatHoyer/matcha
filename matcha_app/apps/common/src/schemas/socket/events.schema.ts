import { z } from '../../validator/validator';

import { userSchema } from '../database.schema';
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

export const viewsSchema = z.object({
  receiverViewId: userSchema.pick(['id']).shape.id,
  senderViewId: userSchema.pick(['id']).shape.id,
});

export const events = {
  'send-message': sendMessageSchema,
  'send-feedback': sendMessageSchema,
  'send-like-unlike': likesSchema,
  'send-view': viewsSchema,
  // disconnect: z.null(),
  disconnect: z.union([z.null(), z.string()]),
};
