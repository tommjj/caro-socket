import { Context } from 'hono';
import { createFactory } from 'hono/factory';

import prisma from '../lib/data/db';
import { CreateUserSchema } from '../lib/zod.schema';
import { hashSync } from 'bcrypt';
import { auth } from '../auth';
import { zValidator } from '@hono/zod-validator';

const factory = createFactory();

export const getUserHandlers = factory.createHandlers(async (c: Context) => {
    console.log(auth(c));

    const users = await prisma.user.findMany();

    return c.json(users);
});

export const createUserHandlers = factory.createHandlers(
    zValidator('json', CreateUserSchema),
    async (c) => {
        const user = c.req.valid('json');

        try {
            await prisma.user.create({
                data: {
                    ...user,
                    password: hashSync(user.password, 10),
                },
            });
        } catch (error) {
            return c.json(
                {
                    message: 'user name is existed!',
                },
                409
            );
        }

        return c.json(
            {
                message: 'Created!',
            },
            201
        );
    }
);
