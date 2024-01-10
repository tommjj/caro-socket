import { Hono } from 'hono';
import { signIn, signOut } from '../../../auth';

const authRoute = new Hono().basePath('/auth');

authRoute.post('/sign-in', signIn);

authRoute.get('/sign-out', signOut);
authRoute.post('/sign-out', signOut);

export default authRoute;
