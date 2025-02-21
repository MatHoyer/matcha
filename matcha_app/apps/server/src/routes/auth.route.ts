import { Router } from 'express';
import {
  login,
  logout,
  session,
  signup,
} from '../controllers/auth.controller.js';
import { loginSchema, signupSchema } from '../schemas/auth.schema.js';
import { bodyParser } from './bodyParser.js';

const authRouter = Router();

authRouter.post('/signup', bodyParser(signupSchema), signup);
authRouter.post('/login', bodyParser(loginSchema), login);
authRouter.get('/logout', logout);
authRouter.get('/session', session);

export default authRouter;
