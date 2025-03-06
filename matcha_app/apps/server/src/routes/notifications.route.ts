import { Router } from 'express';
import { getNotifications } from '../controllers/notifications.controller';
import { bodyParser } from '../middlewares/bodyParser.middleware';
import { notificationsSchemas } from '@matcha/common';

const notificationsRouter = Router();

notificationsRouter.post(
  '/',
  bodyParser(notificationsSchemas.requirements),
  getNotifications
);

export default notificationsRouter;
