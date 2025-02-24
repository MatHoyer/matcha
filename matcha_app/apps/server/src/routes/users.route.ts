import { Router } from 'express';
import {
    getUsers,
} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.get('/getUsers', getUsers);

export default authRouter;
