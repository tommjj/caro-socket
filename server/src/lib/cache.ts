import { Server } from 'socket.io';
import NodeCache = require('node-cache');
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';
import { User } from './game-queue';
import { randomUUID } from 'crypto';
import Match from './match';
import { GameMode } from './game-mode';

class GameCache {
    private cache;
    private io;
    constructor(
        io: Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >,
        cache?: NodeCache
    ) {
        this.cache = cache || new NodeCache({ useClones: false, stdTTL: 3600 });

        this.io = io;
    }

    get Cache() {
        return this.cache;
    }

    createGame(player1: User, player2: User, mode: GameMode) {
        const roomId = randomUUID();

        const match = new Match(this.io, roomId, player1, player2, mode);

        this.cache.set(roomId, match);

        this.io.to(player1.id).emit('matched', roomId);
        this.io.to(player2.id).emit('matched', roomId);
    }
}

export default GameCache;
