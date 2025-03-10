import { Infer, z } from '../../validator/validator';
import { notificationSchema, userSchema } from '../database.schema';

export const notificationsOtherUserSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  otherUserId: userSchema.pick(['id']).shape.id.optional(),
  otherUser: userSchema.optional(),
  message: z.string(),
  date: z.date(),
  read: z.boolean(),
});
export type TNotificationsOtherUserSchema = Infer<
  typeof notificationsOtherUserSchema
>;

export const notificationsSchemas = {
  requirements: z.object({
    userId: userSchema.pick(['id']).shape.id,
  }),
  response: z.object({
    notificationsWithUser: z.array(notificationsOtherUserSchema),
  }),
};
export type TNotificationsSchemas = {
  requirements: Infer<typeof notificationsSchemas.requirements>;
  response: Infer<typeof notificationsSchemas.response>;
};

export const readMessageNotificationSchemas = {
  requirements: z.object({
    userId: userSchema.pick(['id']).shape.id,
    otherUserId: userSchema.pick(['id']).shape.id,
  }),
  response: {},
};
