import { z, type Infer } from './utils/validator.js';

export const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.string(),
  SERVER_PORT: z.string(),
  CLIENT_PORT: z.string(),
  AUTH_SECRET: z.string(),
});
export type TEnv = Infer<typeof envSchema>;

export const env = {
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PORT: process.env.POSTGRES_PORT,

  SERVER_PORT: process.env.SERVER_PORT,

  CLIENT_PORT: process.env.CLIENT_PORT,

  AUTH_SECRET: process.env.AUTH_SECRET,
} as TEnv;
