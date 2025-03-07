import {
  createPictureSchemas,
  imageSchema,
  updatePictureSchemas,
  userSchema,
  z,
} from '@matcha/common';
import { Router } from 'express';
import {
  createPicture,
  deletePicture,
  getPicture,
  getPictures,
  getProfilePicture,
  updatePicture,
} from '../controllers/picture.controller.js';
import { bodyParser } from '../middlewares/bodyParser.middleware.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';
import { paramsParser } from '../middlewares/paramsParser.middleware.js';

const pictureRouter = Router();

pictureRouter.get(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: imageSchema.pick(['id']).shape.id })),
  getPicture
);
pictureRouter.delete(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: imageSchema.pick(['id']).shape.id })),
  deletePicture
);
pictureRouter.patch(
  '/:id',
  isLogged,
  paramsParser(z.object({ id: imageSchema.pick(['id']).shape.id })),
  bodyParser(updatePictureSchemas.requirements),
  updatePicture
);
pictureRouter.post(
  '/new',
  isLogged,
  bodyParser(createPictureSchemas.requirements),
  createPicture
);
pictureRouter.get(
  '/user/:id',
  isLogged,
  paramsParser(z.object({ id: userSchema.pick(['id']).shape.id })),
  getPictures
);
pictureRouter.get(
  '/user-pp/:id',
  isLogged,
  paramsParser(z.object({ id: userSchema.pick(['id']).shape.id })),
  getProfilePicture
);

export default pictureRouter;
