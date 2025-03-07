import { createTagSchemas, userSchema, z } from '@matcha/common';
import { Router } from 'express';
import {
  createTag,
  getTags,
  getUserTags,
} from '../controllers/tag.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const tagRouter = Router();

tagRouter.get('/', isLogged, getTags);
tagRouter.post(
  '/new',
  isLogged,
  bodyParser(createTagSchemas.requirements),
  createTag
);
tagRouter.get(
  '/user/:id',
  isLogged,
  paramsParser(z.object({ id: userSchema.pick(['id']).shape.id })),
  getUserTags
);

export default tagRouter;
