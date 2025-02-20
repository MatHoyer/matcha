import { z, type Infer } from '../utils/validator.ts';

export const signinSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number(),
  gender: z.enum(['Male', 'Female'] as const),
  preference: z.enum(['Heterosexual', 'Bisexual', 'Homosexual'] as const),
});
export type TSigninSchema = Infer<typeof signinSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type TLoginSchema = Infer<typeof loginSchema>;
