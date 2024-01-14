'use client';

import { create } from 'zustand';
import { User } from '../zod.schema';

type data = {
    ping: number;
    mode: 3 | 5 | 7;
    findMatch: boolean;
    user?: User;
};

type action = {
    setPing: (p: number) => void;
    setUser: (user: User) => void;
    setMode: (dir: number) => void;
};

const useGameStore = create<data & action>()((set) => ({
    ping: 0,
    mode: 3,
    findMatch: false,
    user: undefined,
    setPing: (p) => set(() => ({ ping: p })),
    setUser: (user) => set(() => ({ user: user })),
    setMode: (dir) =>
        set((priv) => ({
            mode:
                priv.mode === 5
                    ? dir > 0
                        ? 7
                        : 3
                    : priv.mode === 7
                    ? dir > 0
                        ? 7
                        : 5
                    : dir > 0
                    ? 5
                    : 3,
        })),
}));

export const setGameStore = useGameStore.setState.bind(useGameStore);
export default useGameStore;
