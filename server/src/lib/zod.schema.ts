import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    password: z.optional(z.string()),
    avatar: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
    name: z.string(),
    password: z.coerce.string(),
    avatar: z.string().default('default_avatar.png'),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;
