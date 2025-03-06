import type { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';
import { Infer } from '@matcha/common/';
import { notificationsSchemas } from '@matcha/common';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
      },
    });
    console.log('notif :', notifications);
    res
      .status(200)
      .json({ notifications } as Infer<typeof notificationsSchemas.response>);
  } catch (error) {
    console.error('Error fetching messages:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};
