import { GENDERS, ORIENTATIONS } from '../utils/datas';
import { Infer, z } from '../validator/validator';

export const genderSchema = z.enum(GENDERS);
export type TGender = Infer<typeof genderSchema>;

export const orientationSchema = z.enum(ORIENTATIONS);
export type TOrientation = Infer<typeof orientationSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number().min(18),
  gender: genderSchema,
  preference: orientationSchema,
  biography: z.string().optional(),
});
export type TUser = Infer<typeof userSchema>;
export type TUserWithNames = Pick<TUser, 'id' | 'name' | 'lastName'>;

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type TTag = Infer<typeof tagSchema>;

export const userTagSchema = z.object({
  userId: userSchema.pick(['id']).shape.id,
  tagId: tagSchema.pick(['id']).shape.id,
});
export type TUserTag = Infer<typeof userTagSchema>;

export const messageSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  receiverId: userSchema.pick(['id']).shape.id,
  content: z.string(),
  createdAt: z.date(),
});
export type TMessage = Infer<typeof messageSchema>;

export const reportSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  reportedId: userSchema.pick(['id']).shape.id,
  reason: z.string(),
});
export type TReport = Infer<typeof reportSchema>;

export const likeSchema = z.object({
  userId: userSchema.pick(['id']).shape.id,
  likedId: userSchema.pick(['id']).shape.id,
});
export type TLike = Infer<typeof likeSchema>;

export const notificationSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  message: z.string(),
  date: z.date(),
  read: z.boolean(),
});
export type TNotification = Infer<typeof notificationSchema>;

export const blockSchema = z.object({
  userId: userSchema.pick(['id']).shape.id,
  blockedId: userSchema.pick(['id']).shape.id,
});
export type TBlock = Infer<typeof blockSchema>;

export const globalLocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export type TGlobalLocation = Infer<typeof globalLocationSchema>;

export const userLocationSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  latitude: z.number(),
  longitude: z.number(),
  date: z.date(),
});
export type TUserLocation = Infer<typeof userLocationSchema>;

export const viewSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  viewedId: userSchema.pick(['id']).shape.id,
  date: z.date(),
});
export type TView = Infer<typeof viewSchema>;

export const imageSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  url: z.string(),
  isProfile: z.boolean(),
});
export type TImage = Infer<typeof imageSchema>;
