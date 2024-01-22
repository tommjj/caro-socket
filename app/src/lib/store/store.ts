'use client';

import { create } from 'zustand';
import { User } from '../zod.schema';

// store nơi lưu các biến toàn cục của ứng dụng

export enum PointState {
    X = 'X',
    O = 'O',
}

export type GameMode = 3 | 5 | 7;

export type Timeout = {
    TimeRemaining: number;
    lastTime: number;
    isCount: boolean;
};

export type Player = {
    id: string;
    name: string;
    score: number;
    type: PointState;
    timeout: Timeout;
};

export type Players = {
    player1: Player;
    player2: Player;
};

export type Match = {
    id: string;
    player: Player;
    opponents: Player;
    mode: GameMode;
    currentPlayer: PointState;
    board: (undefined | PointState)[][];
    matchResult: string | null | undefined;
};

export type Data = {
    ping: number;
    mode: GameMode;
    findMatch: boolean;
    user?: User;
    match?: Match;
};

type Action = {
    setPing: (p: number) => void;
    setUser: (user: User) => void;
    setMode: (dir: number) => void;
};

const useGameStore = create<Data & Action>()((set) => ({
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
