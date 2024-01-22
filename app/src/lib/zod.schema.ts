import { z } from 'zod';
import { PointState } from './store/store';

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
});

export type User = z.infer<typeof UserSchema>;
