'use client';

import { Socket, io } from 'socket.io-client';
import { setGameStore } from './store/store';

export interface ServerToClientEvents {
    'chat message': (msg: string) => void;
    ping: (p: number) => void;
    matched: () => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    'chat message': (msg: string) => void;
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

socket.on('matched', () => {
    console.log('matched');
});

export const connectSocket = (auth: { token: string }) => {
    socket.auth = auth;
    socket.connect();
};

export default socket;
