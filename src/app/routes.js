import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import FileController from './controllers/FileController';
import authMiddlewares from './middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/auth', AuthController.store);

routes.use(authMiddlewares);

routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
