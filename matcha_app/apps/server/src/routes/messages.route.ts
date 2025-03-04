import { Router } from 'express';
import { getMessages } from '../controllers/messages.controller';
import { bodyParser } from '../middlewares/bodyParser.middleware';
import { messagesSchemas } from '@matcha/common';

const messagesRouter = Router();

messagesRouter.post('/', bodyParser(messagesSchemas.requirements), getMessages);

export default messagesRouter;
