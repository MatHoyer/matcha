import type { Infer } from '@matcha/common';
import { z } from '@matcha/common';

export const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.number().positive(),
  SERVER_PORT: z.number().positive(),
  CLIENT_PORT: z.number().positive(),
  AUTH_SECRET: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['DEV', 'PROD'] as const),
});
export type TEnv = Infer<typeof envSchema>;

export const env = {
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PORT: +(process.env.POSTGRES_PORT || -1),

  SERVER_PORT: +(process.env.SERVER_PORT || -1),

  CLIENT_PORT: +(process.env.CLIENT_PORT || -1),

  AUTH_SECRET: process.env.AUTH_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,

  NODE_ENV: process.env.NODE_ENV,
} as TEnv;
