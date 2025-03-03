import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller';
import { isLogged } from '../middlewares/isLogged.middleware';

const userRouter = Router();

userRouter.get('/', isLogged, getUsers);
userRouter.get('/:id', isLogged, getUser);

export default userRouter;
