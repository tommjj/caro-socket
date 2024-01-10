import { Context } from 'hono';
import {
    setSignedCookie,
    deleteCookie,
    getSignedCookie,
    getCookie,
    setCookie,
} from 'hono/cookie';
import { Factory, createMiddleware } from 'hono/factory';

import { compareSync } from 'bcrypt';
import { z } from 'zod';
import prisma from './lib/data/db';
import { signCookie, unsignCookie } from './lib/utils/help-methods';
import { zValidator } from '@hono/zod-validator';

const SignInSchema = z.object({
    username: z.coerce.string(),
    password: z.coerce.string(),
});

const factory = new Factory();

export const signInHandlers = factory.createHandlers(
    zValidator('json', SignInSchema),
    async (c) => {
        const { username, password } = c.req.valid('json');

        const user = await prisma.user.findUnique({
            where: { name: username },
        });

        if (!user || !compareSync(password, user.password))
            return c.json({ message: 'CredentialSignin' }, 401);

        setCookie(
            c,
            'auth',
            signCookie({
                id: user.id,
                name: username,
                expires: Date.now() + 1000 * 60 * 24,
            }),
            { path: '/', maxAge: 1000 * 60 * 24, httpOnly: true }
        );

        return c.json({ message: 'OK' }, 200);
    }
);

export const signOut = (c: Context): Response | Promise<Response> => {
    deleteCookie(c, 'auth');
    return c.json(undefined, 204);
};

export const authMiddleware = createMiddleware(async (c, next) => {
    const cookie = unsignCookie(getCookie(c, 'auth'));

    if (cookie) {
        const cookieJson = JSON.parse(cookie);
        c.set('auth', {
            user: cookieJson,
            expired: Date.now() < cookieJson.expires,
        });
    }

    await next();
});

export const auth = (c: Context) => {
    const cookie = unsignCookie(getCookie(c, 'auth'));

    if (cookie) {
        const cookieJson = JSON.parse(cookie);
        return {
            ...cookieJson,
        } as {
            id: string;
            name: string;
        };
    }
    return undefined;
};
