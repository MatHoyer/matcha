import { resetPasswordSchemas, updateUserSchemas, z } from '@matcha/common';
import { Router } from 'express';
import {
  askResetPassword,
  blockedMe,
  getMatchUser,
  getUser,
  getUserFame,
  getUsers,
  haveMatched,
  isBlocked,
  resetPassword,
  updateUser,
} from '../controllers/user.controller';
import { bodyParser } from '../middlewares/bodyParser.middleware';
import { isLogged } from '../middlewares/isLogged.middleware';
import { paramsParser } from '../middlewares/paramsParser.middleware';
const userRouter = Router();

userRouter.get('/', isLogged, getUsers);
userRouter.get(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  getUser
);
userRouter.put(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  bodyParser(updateUserSchemas.requirements),
  updateUser
);
userRouter.get(
  '/fame/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  getUserFame
);

userRouter.get('/password/reset-password', isLogged, askResetPassword);
userRouter.post(
  '/password/reset-password/:token',
  paramsParser(z.object({ token: z.string() })),
  bodyParser(resetPasswordSchemas.requirements),
  resetPassword
);

userRouter.get(
  '/match/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  getMatchUser
);

userRouter.get(
  '/matched/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  haveMatched
);

userRouter.get(
  '/isBlocked/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  isBlocked
);

userRouter.get(
  '/blockedMe/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  blockedMe
);

export default userRouter;
