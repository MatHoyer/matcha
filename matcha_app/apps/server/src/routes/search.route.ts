import { advancedSearchSchema } from '@matcha/common';
import { Router } from 'express';
import { advancedSearch } from '../controllers/search.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';

const searchRouter = Router();

searchRouter.post(
  '/advancedSearch',
  isLogged,
  bodyParser(advancedSearchSchema.requirements),
  advancedSearch
);

export default searchRouter;
