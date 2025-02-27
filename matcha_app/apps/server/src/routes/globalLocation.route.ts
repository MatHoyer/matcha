import { Router } from 'express';
import { getGlobalLocations } from '../controllers/globalLocation.controller.js';
import { isLogged } from '../middlewares/isLogged.middleware.js';

const globalLocationRouter = Router();

globalLocationRouter.get('/', isLogged, getGlobalLocations);

export default globalLocationRouter;
