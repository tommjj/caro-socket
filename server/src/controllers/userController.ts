import { Context } from 'hono';

import prisma from '../lib/data/db';
import { CreateUserSchema } from '../lib/zod.schema';
import { hash, hashSync } from 'bcrypt';

interface UserControllerInterface {
    createUser(c: Context): Response | Promise<Response>;
    getUser(c: Context): Response | Promise<Response>;
}

class UserController implements UserControllerInterface {
    async getUser(c: Context) {
        const users = await prisma.user.findMany();

        return c.json(users);
    }

    async createUser(c: Context) {
        const userParse = CreateUserSchema.safeParse(await c.req.json());

        if (!userParse.success) return c.text('Invalid', 400);

        await prisma.user.create({
            data: {
                ...userParse.data,
                password: hashSync(userParse.data.password, 10),
            },
        });

        return c.json({ message: 'create success', ...userParse.data }, 203);
    }
}

export const userController = new UserController();
