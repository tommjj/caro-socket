'use client';

import { Socket, io } from 'socket.io-client';
import { GameMode, Players, Point, setGameStore } from './store/store';
import { API_HOST } from './http';

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
    'draw round': (id: string) => void;
    'draw match': (id: string) => void;
}

export interface ClientToServerEvents {
    'chat message': (msg: string) => void;
    'find match': (mode: GameMode) => void;
    'cancel find match': () => void;
    move: (x: number, y: number) => void;
    'join room': (roomId: string) => void;
    'leave room': (roomId: string) => void;
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

socket.on('sync match', (data) => {
    console.log(data);

    setGameStore((priv) => {
        const playerId = priv.user?.id!;

        return {
            match: {
                id: data.id,
                board: data.board,
                currentPlayer: data.currentPlayer,
                mode: data.mode,
                player:
                    playerId === data.players.player1.id
                        ? data.players.player1
                        : data.players.player2,
                opponents:
                    playerId !== data.players.player1.id
                        ? data.players.player1
                        : data.players.player2,
                isEnd: data.isEnd,
            },
        };
    });
});

export const connectSocket = (auth: { token: string }) => {
    socket.auth = auth;
    socket.connect();
};

export default socket;
