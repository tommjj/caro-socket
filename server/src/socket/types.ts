import { GameMode } from '@/lib/match';

export interface ServerToClientEvents {
    'chat message': (msg: string) => void;
    matched: () => void;
    ping: (p: number) => void;
}

export interface ClientToServerEvents {
    'chat message': (msg: string) => void;
    'set name': (name: string) => void;
    'find match': (mode: GameMode) => void;
    'cancel find match': () => void;
}

export interface InterServerEvents {
    ping: (p: number) => void;
}

export interface SocketData {
    id: string;
    name: string;
}
