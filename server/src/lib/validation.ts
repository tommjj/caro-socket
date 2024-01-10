import { ValidationTargets } from 'hono';
import { validator } from 'hono/validator';
import { CreateUserSchema } from './zod.schema';

export const createUserValidator = (target: keyof ValidationTargets) => {
    return validator(target, (value, c) => {
        const parsed = CreateUserSchema.safeParse(value);

        if (!parsed.success) {
            return c.text('Invalid!', 401);
        }
        return parsed.data;
    });
};
