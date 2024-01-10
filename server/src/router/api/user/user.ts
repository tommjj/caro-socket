import { Hono } from 'hono';
import { userController } from '../../../controllers/userController';
import { auth } from '../../../auth';

const userRoute = new Hono().basePath('/users');

userRoute.get('/', auth, userController.getUser);
userRoute.post('/', userController.createUser);

export default userRoute;
