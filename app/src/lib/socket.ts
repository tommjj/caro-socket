'use client';

import { Socket, io } from 'socket.io-client';
import { setGameStore } from './store/store';
import { API_HOST } from './http';

export interface ServerToClientEvents {
    'chat message': (msg: string) => void;
    ping: (p: number) => void;
    matched: (roomId: string) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    'chat message': (msg: string) => void;
    'find match': (mode: number) => void;
    'cancel find match': () => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    API_HOST,
    { autoConnect: false }
);

socket.on('ping', (p) => {
    const ping = Date.now() - p;
    setGameStore((e) => {
        e.setPing(ping);
        return {};
    });
});

export const connectSocket = (auth: { token: string }) => {
    socket.auth = auth;
    socket.connect();
};

export default socket;
