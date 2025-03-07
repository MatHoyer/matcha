import { Infer, z } from '../../validator/validator';
import { notificationSchema, userSchema } from '../database.schema';

export const notificationsSchemas = {
  requirements: z.object({
    userId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    notifications: z.array(notificationSchema),
  }),
};
export type TNotificationsSchemas = {
  requirements: Infer<typeof notificationsSchemas.requirements>;
  response: Infer<typeof notificationsSchemas.response>;
};
