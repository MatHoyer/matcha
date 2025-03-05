import { updateUserSchemas } from '@matcha/common';
import { Router } from 'express';
import { getUser, getUsers, updateUser } from '../controllers/user.controller';
import { bodyParser } from '../middlewares/bodyParser.middleware';
import { isLogged } from '../middlewares/isLogged.middleware';
const userRouter = Router();

userRouter.get('/', isLogged, getUsers);
userRouter.get('/:id', isLogged, getUser);
userRouter.put(
  '/:id',
  isLogged,
  bodyParser(updateUserSchemas.requirements),
  updateUser
);

export default userRouter;
