import { loginSchemas, signupSchemas, z } from '@matcha/common';
import { Router } from 'express';
import {
  confirm,
  login,
  logout,
  session,
  signup,
} from '../controllers/auth.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const authRouter = Router();

authRouter.post('/signup', bodyParser(signupSchemas.requirements), signup);
authRouter.post('/login', bodyParser(loginSchemas.requirements), login);
authRouter.get('/confirm/:token', paramsParser(z.object({ token: z.string() })), confirm);
authRouter.get('/logout', logout);
authRouter.get('/session', session);

export default authRouter;
