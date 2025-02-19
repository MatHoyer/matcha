import { Router } from 'express';
import { login, signin } from '../controllers/auth.controller.js';
import { bodyParser } from '../controllers/bodyParser.js';
import { loginSchema, signinSchema } from '../schemas/auth.schema.js';

const authRouter = Router();

authRouter.post('/signin', bodyParser(signinSchema), signin);
authRouter.post('/login', bodyParser(loginSchema), login);

export default authRouter;
