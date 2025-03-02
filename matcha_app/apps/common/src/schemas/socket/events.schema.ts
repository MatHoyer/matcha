import { sendMessageSchema, TSendMessageSchema } from './send-message.schema';
import { z } from '../../validator/validator';

export const events = {
  'send-message': sendMessageSchema,
  disconnect: z.string(),
};

export type eventTypes = {
  'send-message': TSendMessageSchema;
};
