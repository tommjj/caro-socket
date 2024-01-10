import { Context } from 'hono';
import { setSignedCookie, deleteCookie, getSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { compareSync } from 'bcrypt';
import { z } from 'zod';
import prisma from './lib/data/db';

const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

const SignInSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const signIn = async (c: Context): Promise<Response> => {
    const body = await c.req.json();

    const bodyParse = SignInSchema.safeParse(body);

    if (!bodyParse.success) return c.json(undefined, 400);
    const { username, password } = bodyParse.data;

    const user = await prisma.user.findUnique({ where: { name: username } });
    if (!user) return c.json(undefined, 400);

    if (compareSync(password, user.password)) {
        await setSignedCookie(
            c,
            'auth',
            JSON.stringify({ id: user.id, user: username }),
            SECRET_KEY,
            { path: '/', maxAge: 1000 * 60 * 24, httpOnly: true }
        );

        return c.text('ok', 200);
    }

    return c.text('', 400);
};

export const signOut = (c: Context): Response | Promise<Response> => {
    deleteCookie(c, 'auth');
    return c.json(undefined, 204);
};

export const auth = createMiddleware(async (c, next) => {
    const cookie = await getSignedCookie(c, SECRET_KEY, 'auth');

    if (cookie) {
        c.set('user', JSON.parse(cookie));
    }

    await next();
});
