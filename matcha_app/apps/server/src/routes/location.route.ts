import { updateLocationSchemas, z } from '@matcha/common';
import { Router } from 'express';
import {
  getUserNearLocation,
  isNeedUpdateLocation,
  updateLocation,
} from '../controllers/location.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const locationRouter = Router();

locationRouter.put(
  '/',
  isLogged,
  bodyParser(updateLocationSchemas.requirements),
  updateLocation
);
locationRouter.get('/is-need-update', isLogged, isNeedUpdateLocation);
locationRouter.get(
  '/near/user/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  getUserNearLocation
);

export default locationRouter;
