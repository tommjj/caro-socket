export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    'chat message': (msg: string) => void;
    ping: (p: number) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    'chat message': (msg: string) => void;
    'set name': (name: string) => void;
    'find match': () => void;
    'cancel find match': () => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    id: string;
    name: string;
}
