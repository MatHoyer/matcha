import { blockUserSchemas, unblockUserSchemas } from '@matcha/common';
import { Router } from 'express';
import { blockUser, unblockUser } from '../controllers/block.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';

const blockRouter = Router();

blockRouter.post(
  '/',
  isLogged,
  bodyParser(blockUserSchemas.requirements),
  blockUser
);
blockRouter.delete(
  '/',
  isLogged,
  bodyParser(unblockUserSchemas.requirements),
  unblockUser
);

export default blockRouter;
