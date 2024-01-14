export interface ServerToClientEvents {
    'chat message': (msg: string) => void;
    ping: (p: number) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    'chat message': (msg: string) => void;
    'set name': (name: string) => void;
    'find match': (mode: number) => void;
    'cancel find match': () => void;
}

export interface InterServerEvents {
    ping: (p: number) => void;
}

export interface SocketData {
    id: string;
    name: string;
}
