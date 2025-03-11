import {
  createLikeSchemas,
  deleteLikeSchemas,
  userSchema,
  z,
} from '@matcha/common';
import { Router } from 'express';
import {
  createLike,
  deleteLike,
  isLiked,
} from '../controllers/like.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const likeRouter = Router();

likeRouter.get(
  '/is-liked/:id',
  isLogged,
  paramsParser(z.object({ id: userSchema.pick(['id']).shape.id })),
  isLiked
);
likeRouter.post(
  '/new',
  isLogged,
  bodyParser(createLikeSchemas.requirements),
  createLike
);
likeRouter.delete(
  '/',
  isLogged,
  bodyParser(deleteLikeSchemas.requirements),
  deleteLike
);

export default likeRouter;
