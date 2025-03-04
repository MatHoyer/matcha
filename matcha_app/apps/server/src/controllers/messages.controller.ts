import type { Request, Response } from 'express';
import db from '../database/Database';
import { defaultResponse } from '../utils/defaultResponse';
import { Infer } from '@matcha/common/';
import { messagesSchemas } from '@matcha/common';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const messages = await db.message.findMany({
      where: {
        userId,
      },
    });
    res
      .status(200)
      .json({ messages } as Infer<typeof messagesSchemas.response>);
  } catch (error) {
    console.error('Error fetching messages:', error);
    defaultResponse({
      res,
      status: 500,
      json: { message: 'Internal Server Error' },
    });
  }
};
