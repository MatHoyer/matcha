import { z } from '../../validator/validator';
import { sendMessageSchema } from './send-message.schema';

export const events = {
  'send-message': sendMessageSchema,
  disconnect: z.null(),
};
