import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
});

export type User = z.infer<typeof UserSchema>;
