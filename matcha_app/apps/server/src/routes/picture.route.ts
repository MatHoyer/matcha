import { createPictureSchemas, getPicturesSchemas, z } from '@matcha/common';
import { Router } from 'express';
import {
  createPicture,
  getPicture,
  getPictures,
} from '../controllers/picture.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const pictureRouter = Router();

pictureRouter.get(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  getPicture
);
pictureRouter.post(
  '/',
  isLogged,
  bodyParser(getPicturesSchemas.requirements),
  getPictures
);
pictureRouter.post(
  '/new',
  isLogged,
  bodyParser(createPictureSchemas.requirements),
  createPicture
);

export default pictureRouter;
