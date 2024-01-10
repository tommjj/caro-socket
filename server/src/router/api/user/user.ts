import { Hono } from 'hono';
import {
    createUserHandlers,
    getUserHandlers,
} from '../../../controllers/user-controller';

const userRoute = new Hono().basePath('/users');

userRoute.get('/', ...getUserHandlers);
userRoute.post('/', ...createUserHandlers);

export default userRoute;
