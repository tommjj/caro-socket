import { Point } from '@/lib/caro';
import { GameMode } from '@/lib/game-mode';
import { Player, Players } from '@/lib/match';

export interface ServerToClientEvents {
    'chat message': (msg: string) => void;
    matched: (roomId: string) => void;
    ping: (p: number) => void;
    'sync match': (data: {
        id: string;
        players: Players;
        mode: GameMode;
        currentPlayer: Point;
        board: (Point | undefined)[][];
        isEnd: boolean;
    }) => void;
    place: (x: number, y: number, type: Point, next: string) => void;
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
}

export interface InterServerEvents {
    ping: (p: number) => void;
}

export interface SocketData {
    id: string;
    name: string;
    room: string;
}
