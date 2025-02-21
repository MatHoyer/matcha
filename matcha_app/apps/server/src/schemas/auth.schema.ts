import type { Infer } from '@matcha/common';
import { z } from '@matcha/common';

export const signupSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number(),
  gender: z.enum(['Male', 'Female'] as const),
  preference: z.enum(['Heterosexual', 'Bisexual', 'Homosexual'] as const),
});
export type TSignupSchema = Infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type TLoginSchema = Infer<typeof loginSchema>;
