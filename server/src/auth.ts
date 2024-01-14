import { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { Factory, createMiddleware } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';

import { compareSync } from 'bcrypt';
import { z } from 'zod';
import prisma from '@/lib/data/db';
import {
    base64,
    signCookie,
    unBase64,
    unsignCookie,
} from '@/lib/utils/help-methods';

const SignInSchema = z.object({
    username: z.coerce.string(),
    password: z.coerce.string(),
});

const factory = new Factory();

export const authHandlers = factory.createHandlers((c) => {
    const user = auth(c);
    if (user) return c.json(user, 200);
    return c.json('CredentialSignin', 401);
});

export const getTokenHandlers = factory.createHandlers((c) => {
    const user = auth(c);
    if (user)
        return c.json({ token: createToken(user, 1000 * 60 * 60 * 24) }, 200);
    return c.json('CredentialSignin', 401);
});

export const signInHandlers = factory.createHandlers(
    zValidator('json', SignInSchema),
    async (c) => {
        const { username, password } = c.req.valid('json');

        const user = await prisma.user.findUnique({
            where: { name: username },
        });

        if (!user || !compareSync(password, user.password))
            return c.json({ message: 'CredentialSignin' }, 401);

        const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
        };

        setCookie(
            c,
            'auth',
            signCookie({
                ...payload,
                expires: Date.now() + 1000 * 60 * 60 * 24,
            }),
            {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            }
        );

        return c.json(
            {
                token: createToken(payload, 1000 * 60 * 60 * 24),
            },
            200
        );
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

export const createToken = (payload: object, expires: number) => {
    return signCookie(
        base64(
            JSON.stringify({
                ...payload,
                expires: Date.now() + expires,
            })
        )
    );
};

export const parseToken = (token: string) => {
    const t = unsignCookie(token);
    if (!t) return undefined;

    const payload = JSON.parse(unBase64(token));
    if (payload.expires < Date.now()) return false;

    return payload;
};
