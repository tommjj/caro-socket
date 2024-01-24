import { PointState } from '@/lib/caro';
import { GameMode } from '@/lib/game-mode';
import { Players } from '@/lib/match';

// khai báo các sự kiện socket

export interface ServerToClientEvents {
    'chat message': (msg: string) => void;
    matched: (roomId: string) => void;
    ping: (p: number) => void;
    'sync match': (data: {
        id: string;
        players: Players;
        mode: GameMode;
        currentPlayer: PointState;
        board: (PointState | undefined)[][];
        matchResult: string | null | undefined;
    }) => void;
    place: (x: number, y: number, type: PointState, next: string) => void;
    'win round': (id: string) => void;
    'win match': (id: string) => void;
    'draw round': () => void;
    'draw match': () => void;
}

export interface ClientToServerEvents {
    'chat message': (msg: string) => void;
    'find match': (mode: GameMode) => void;
    'cancel find match': () => void;
    move: (x: number, y: number) => void;
    'join room': (roomId: string) => void;
    'leave room': (roomId: string) => void;
    'draw request': () => void;
}

export interface InterServerEvents {
    ping: (p: number) => void;
}

export interface SocketData {
    id: string;
    name: string;
    room: string;
}
