import { Hono } from 'hono';
import userRoute from '@/router/api/user/user';
import authRoute from '@/router/api/auth/auth';

const api = new Hono().basePath('/api');

api.get('/', (c) => {
    return c.text('api');
});

api.route('/', userRoute);
api.route('/', authRoute);

export default api;
