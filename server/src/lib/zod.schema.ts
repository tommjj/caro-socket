import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    password: z.optional(z.string()),
    avatar: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
    name: z.string().min(2).max(15),
    password: z.coerce.string().min(8).max(30),
    avatar: z.string().default('default_avatar.png'),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;
