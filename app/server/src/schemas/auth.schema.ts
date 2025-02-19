import { z, type Infer } from '../utils/validator.ts';

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type TSigninSchema = Infer<typeof signinSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type TLoginSchema = Infer<typeof loginSchema>;
