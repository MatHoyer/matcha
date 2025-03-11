import { Router } from 'express';
import {
  getNotifications,
  updateNotification,
} from '../controllers/notifications.controller';
import { bodyParser } from '../middlewares/bodyParser.middleware';
import {
  notificationsSchemas,
  updateNotificationSchemas,
} from '@matcha/common';

const notificationsRouter = Router();

notificationsRouter.post(
  '/get',
  bodyParser(notificationsSchemas.requirements),
  getNotifications
);
notificationsRouter.post(
  '/update',
  bodyParser(updateNotificationSchemas.requirements),
  updateNotification
);

export default notificationsRouter;
