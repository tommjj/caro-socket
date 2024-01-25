'use client';

import { Socket, io } from 'socket.io-client';
import { Players, PointState, setGameStore } from './store/store';
import { API_HOST } from './http';
import { GameMode } from './game-mode';

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
    'draw round': (id: string) => void;
    'draw match': (id: string) => void;
    'not found': () => void;
    'new round': () => void;
    'draw request': () => void;
    'cancel draw request': () => void;
}

export interface ClientToServerEvents {
    'chat message': (msg: string) => void;
    'find match': (mode: GameMode) => void;
    'cancel find match': () => void;
    move: (x: number, y: number) => void;
    'join room': (roomId: string) => void;
    'leave room': (roomId: string) => void;
    'draw request': () => void;
    'cancel draw request': () => void;
    'set icon': (icon: string) => void;
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

// sư lý sự kiện khi đồng bộ màng chơi
socket.on('sync match', (data) => {
    //lưu dư liệu được gửi vào store
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
                matchResult: data.matchResult,
            },
        };
    });
});

// func tạo kết nối với máy chủ với auth là token xác thực
export const connectSocket = (auth: { token: string }) => {
    socket.auth = auth;
    socket.connect();
};

export default socket;
