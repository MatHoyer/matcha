import type { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';
import { batchPromises } from '../../../common/src/utils/utils';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
      },
    });
    const notificationsWithUser = await batchPromises(
      notifications.map(async (notification) => {
        let otherUser = null;
        if (notification.otherUserId) {
          otherUser = await db.user.findFirst({
            where: {
              id: notification.otherUserId,
            },
          });
        }
        return { ...notification, otherUser };
      })
    );
    // console.log('notif :', notificationsWithUser);
    res.status(200).json({ notificationsWithUser });
  } catch (error) {
    console.error('Error fetching messages:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  console.log('updateNotification');
  try {
    const { userId, otherUserId, type, read } = req.body;
    await db.notification.update({
      where: {
        userId,
        otherUserId,
        type,
      },
      data: {
        read,
      },
    });
    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
      },
    });
    const notificationsWithUser = await batchPromises(
      notifications.map(async (notification) => {
        let otherUser = null;
        if (notification.otherUserId) {
          otherUser = await db.user.findFirst({
            where: {
              id: notification.otherUserId,
            },
          });
        }
        return { ...notification, otherUser };
      })
    );
    console.log('notif (update) :', notificationsWithUser);
    res.status(200).json({ notificationsWithUser });
  } catch (error) {
    console.error('Error fetching messages:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};
