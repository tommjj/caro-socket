'use client';

import { Socket, io } from 'socket.io-client';
import useGameStore, { setGameStore } from './store/store';

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
    'find match': (mode: number) => void;
    'cancel find match': () => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    'http://localhost:8080',
    { autoConnect: false }
);

socket.on('ping', (p) => {
    setGameStore((e) => {
        e.setPing(p);
        return {};
    });
});

export const connectSocket = (auth: { token: string }) => {
    socket.auth = auth;
    socket.connect();
};

export default socket;
