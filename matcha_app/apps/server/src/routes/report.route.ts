import { reportUserSchemas, z } from '@matcha/common';
import { Router } from 'express';
import { reportUser } from '../controllers/report.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const reportRouter = Router();

reportRouter.post(
  '/:userId',
  isLogged,
  paramsParser(
    z.object({
      userId: z.number(),
    })
  ),
  bodyParser(reportUserSchemas.requirements),
  reportUser
);

export default reportRouter;
