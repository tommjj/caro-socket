import { Hono } from 'hono';
import user from './user/user';

const api = new Hono().basePath('/api');

api.get('/', (c) => {
    return c.text('api');
});

api.route('/', user);

export default api;
