import { Router } from 'express';
import { bodyParser } from '../middlewares/bodyParser.middleware';
import { lastOnlineSchema } from '@matcha/common';
import { updateLastOnline } from '../controllers/lastOnline.controller';

const lastOnlineRouter = Router();

lastOnlineRouter.post(
  '/',
  bodyParser(lastOnlineSchema.requirements),
  updateLastOnline
);

export default lastOnlineRouter;
