import { Hono } from 'hono';
import { signInHandlers, signOut } from '@/auth';

const authRoute = new Hono().basePath('/auth');

authRoute.post('/sign-in', ...signInHandlers);

authRoute.on(['GET', 'POST'], '/sign-out', signOut);

export default authRoute;
