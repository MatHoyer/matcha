import { advancedSearchSchema } from '@matcha/common';
import { Router } from 'express';
import {
  advancedSearch,
  suggestedUsers,
} from '../controllers/search.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';
import { z } from '@matcha/common';

const searchRouter = Router();

searchRouter.post(
  '/advancedSearch',
  isLogged,
  bodyParser(advancedSearchSchema.requirements),
  advancedSearch
);

searchRouter.get(
  '/forYou/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  suggestedUsers
);

export default searchRouter;
