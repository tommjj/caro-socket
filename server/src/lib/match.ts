import { Server } from 'socket.io';
import Caro, { Point } from './caro';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';

export type GameMode = 3 | 5 | 7;
export type Player = {
    id: string;
    score: number;
    type: Point;
};

export type Players = {
    player1: Player;
    player2: Player;
};

export default class Match {
    private player: Players;
    private caro: Caro;
    private numberOfMatch: number;

    constructor(
        io: Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >,
        idPlayer1: string,
        idPlayer2: string,
        mode: GameMode
    ) {
        const randBool = Math.random() < 0.5;

        this.player = {
            player1: {
                id: idPlayer1,
                score: 0,
                type: randBool ? Point.X : Point.O,
            },
            player2: {
                id: idPlayer2,
                score: 0,
                type: !randBool ? Point.X : Point.O,
            },
        };

        switch (mode) {
            case 3:
                this.caro = new Caro(3, 3, 3);
                this.numberOfMatch = 7;
                break;
            case 5:
                this.caro = new Caro(5, 5, 4);
                this.numberOfMatch = 5;
                break;
            case 7:
                this.caro = new Caro(7, 7, 4);
                this.numberOfMatch = 3;
                break;
        }
    }
}
