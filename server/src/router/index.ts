import { Hono } from 'hono';
import api from './api';

const router = new Hono();

router.route('/', api);

export default router;
