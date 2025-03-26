import { differenceInYears } from 'date-fns';
import { GENDERS, NOTIF_TYPES, ORIENTATIONS } from '../utils/datas';
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
  age: z.number(),
  birthDate: z
    .date()
    .refine(
      (date) => differenceInYears(new Date(), date) >= 18,
      'You must be at least 18 years old to use this app'
    ),
  gender: genderSchema,
  preference: orientationSchema,
  biography: z.string().optional().nullable(),
  lastTimeOnline: z.date(),
  isOnline: z.boolean().optional(),
});
export type TUser = Infer<typeof userSchema>;
export type TUserWithNames = Pick<TUser, 'id' | 'name' | 'lastName'>;

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type TTag = Infer<typeof tagSchema>;

export const userTagSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  tagId: tagSchema.pick(['id']).shape.id,
});
export type TUserTag = Infer<typeof userTagSchema>;

export const messageSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  receiverId: userSchema.pick(['id']).shape.id,
  message: z.string(),
  date: z.date(),
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
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  likedId: userSchema.pick(['id']).shape.id,
});
export type TLike = Infer<typeof likeSchema>;

export const notificationSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  otherUserId: userSchema.pick(['id']).shape.id.optional(),
  type: z.enum(NOTIF_TYPES),
  date: z.date(),
  read: z.boolean(),
});
export type TNotification = Infer<typeof notificationSchema>;

export const blockSchema = z.object({
  id: z.number(),
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

export const locationSchema = z.object({
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  date: z.date(),
});
export type TLocation = Infer<typeof locationSchema>;

export const userLocationSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  locationId: locationSchema.pick(['id']).shape.id,
});
export type TUserLocation = Infer<typeof userLocationSchema>;

export const viewSchema = z.object({
  id: z.number(),
  userId: userSchema.pick(['id']).shape.id,
  viewerId: userSchema.pick(['id']).shape.id,
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
