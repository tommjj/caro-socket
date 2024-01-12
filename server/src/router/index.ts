import { Hono } from 'hono';
import { cors } from 'hono/cors';

import api from '@/router/api';

const router = new Hono();

router.use(
    '/*',
    cors({ origin: ['http://localhost:3000', 'http://localhost:8080'] })
);
router.route('/', api);

export default router;
