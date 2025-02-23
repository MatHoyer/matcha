import { loginSchemas, signupSchemas } from '@matcha/common';
import { Router } from 'express';
import {
  login,
  logout,
  session,
  signup,
} from '../controllers/auth.controller.js';
import { bodyParser } from './bodyParser.js';

const authRouter = Router();

authRouter.post('/signup', bodyParser(signupSchemas.requirements), signup);
authRouter.post('/login', bodyParser(loginSchemas.requirements), login);
authRouter.get('/logout', logout);
authRouter.get('/session', session);

export default authRouter;
