import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import FileController from './controllers/FileController';
import authMiddlewares from './middlewares/auth';
import MeetupController from './controllers/MeetupsController';
import SubscriptionController from './controllers/SubscriptionController';
import OrganizingController from './controllers/OrganizingController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/auth', AuthController.store);

routes.use(authMiddlewares);

routes.put('/users', UserController.update);
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:meetupId', MeetupController.update);
routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/meetups/:meetupId', MeetupController.delete);
routes.post('/subscriptions', SubscriptionController.store);
routes.get('/organizing', OrganizingController.index);

export default routes;
