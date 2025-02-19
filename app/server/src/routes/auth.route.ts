import { Router } from 'express';
import { login, signin } from '../controllers/auth.controller.ts';
import { loginSchema, signinSchema } from '../schemas/auth.schema.ts';
import { bodyParser } from './bodyParser.ts';

const authRouter = Router();

authRouter.post('/signin', bodyParser(signinSchema), signin);
authRouter.post('/login', bodyParser(loginSchema), login);

export default authRouter;
