import { updateLocationSchemas } from '@matcha/common';
import { Router } from 'express';
import {
  isNeedUpdateLocation,
  updateLocation,
} from '../controllers/location.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';

const locationRouter = Router();

locationRouter.put(
  '/',
  isLogged,
  bodyParser(updateLocationSchemas.requirements),
  updateLocation
);
locationRouter.get('/is-need-update', isLogged, isNeedUpdateLocation);

export default locationRouter;
