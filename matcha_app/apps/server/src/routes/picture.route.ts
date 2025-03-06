import {
  createPictureSchemas,
  getPicturesSchemas,
  updatePictureSchemas,
  z,
} from '@matcha/common';
import { Router } from 'express';
import {
  createPicture,
  deletePicture,
  getPicture,
  getPictures,
  updatePicture,
} from '../controllers/picture.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const pictureRouter = Router();

pictureRouter.post(
  '/',
  isLogged,
  bodyParser(getPicturesSchemas.requirements),
  getPictures
);
pictureRouter.get(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  getPicture
);
pictureRouter.delete(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  deletePicture
);
pictureRouter.patch(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: z.number() })),
  bodyParser(updatePictureSchemas.requirements),
  updatePicture
);
pictureRouter.post(
  '/new',
  isLogged,
  bodyParser(createPictureSchemas.requirements),
  createPicture
);

export default pictureRouter;
