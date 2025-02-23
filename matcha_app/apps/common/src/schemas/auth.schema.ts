import { GENDERS, ORIENTATIONS } from '../datas';
import { z } from '../validator';

export const signupSchemas = {
  requirements: z.object({
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    age: z.number(),
    gender: z.enum(GENDERS),
    preference: z.enum(ORIENTATIONS),
  }),
  response: z.object({
    message: z.string(),
  }),
};

export const loginSchemas = {
  requirements: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: z.object({
    message: z.string(),
  }),
};

export const logoutSchemas = {
  response: z.object({
    message: z.string(),
  }),
};

export const sessionSchemas = {
  response: z.object({
    user: z.object({
      id: z.number(),
      name: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      age: z.number(),
      gender: z.enum(GENDERS),
      preference: z.enum(ORIENTATIONS),
    }),
  }),
};
