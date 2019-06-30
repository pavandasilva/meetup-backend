import { Router } from 'express';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import authMiddlewares from './middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/auth', AuthController.store);

routes.use(authMiddlewares);
routes.put('/users', UserController.update);

export default routes;
