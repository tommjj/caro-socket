import { Hono } from 'hono';
import { cors } from 'hono/cors';

import api from '@/router/api';
import { CORS } from '@/lib/utils/constant';

const router = new Hono();

router.use('/*', cors({ origin: CORS, credentials: true }));
router.route('/', api);

export default router;
