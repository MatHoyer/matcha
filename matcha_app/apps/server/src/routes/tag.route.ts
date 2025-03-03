import { createTagSchemas } from '@matcha/common';
import { Router } from 'express';
import { createTag, getTags } from '../controllers/tag.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';

const tagRouter = Router();

tagRouter.get('/', isLogged, getTags);
tagRouter.post(
  '/',
  isLogged,
  bodyParser(createTagSchemas.requirements),
  createTag
);

export default tagRouter;
