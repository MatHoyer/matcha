import { z } from '@matcha/common';

const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.number().positive(),
  SERVER_URL: z.string().url(),
  SERVER_PORT: z.number().positive(),
  CLIENT_PORT: z.number().positive(),
  AUTH_SECRET: z.string(),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_API_EMAIL_FROM: z.string(),
  RESEND_API_EMAIL_TO: z.string(),
  NODE_ENV: z.enum(['DEV', 'PROD'] as const),
});

export const env = envSchema.parse({
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PORT: process.env.POSTGRES_PORT,

  SERVER_URL: process.env.SERVER_URL,
  SERVER_PORT: process.env.SERVER_PORT,

  CLIENT_PORT: process.env.CLIENT_PORT,

  AUTH_SECRET: process.env.AUTH_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_API_EMAIL_FROM: process.env.RESEND_API_EMAIL_FROM,
  RESEND_API_EMAIL_TO: process.env.RESEND_API_EMAIL_TO,
  NODE_ENV: process.env.NODE_ENV,
});
