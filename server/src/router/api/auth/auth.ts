import { Hono } from 'hono';
import {
    authHandlers,
    signInHandlers,
    getTokenHandlers,
    signOut,
} from '@/auth';

const authRoute = new Hono().basePath('/auth');

authRoute.get('/', ...authHandlers);

authRoute.get('/token', ...getTokenHandlers);

authRoute.post('/sign-in', ...signInHandlers);

authRoute.on(['GET', 'POST'], '/sign-out', signOut);

export default authRoute;
