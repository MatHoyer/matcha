import { GENDERS, ORIENTATIONS } from '../../datas';
import { z } from '../../validator';

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  parssword: z.string(),
  age: z.number(),
  gender: z.enum(GENDERS),
  preference: z.enum(ORIENTATIONS),
  biography: z.string().optional(),
});
