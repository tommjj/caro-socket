import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { html } from 'hono/html';

import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';
import router from '@/router';
import { Server } from 'socket.io';
import { auth, parseToken } from '@/auth';
import { CORS } from '@/lib/utils/constant';
import GameQueue from './lib/game-queue';
import GameCache from './lib/cache';
import Match from './lib/match';
import appEmitter from './lib/event';

const port = Number(process.env.PORT) || 8080;
const app = new Hono();

//----====STATIC====----\\
app.use(
    '/static/*',
    serveStatic({
        root: './',
        rewriteRequestPath: (path) =>
            path.replace(/^\/static/, '/public/static'),
    })
);
//----====MIDDLEWARE====----\\

app.use('*', logger());

//----====ROUTE====----\\

app.route('/', router);

//----====CREATE SERVER====-----\\
const server = serve({ ...app, port }, () => {
    console.log('   - Server running on port', port);
    console.log(`   - Local:    http://localhost:${port}`);
});

//----====CREATE SOCKET====----\\

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, {
    connectionStateRecovery: {},
    cors: { origin: CORS, credentials: true },
});

//----====SOCKET====----\\
// tạo game cache nơi lưu các màng chơi
const gameCache = new GameCache(io);

//khởi tạo hàng các đợi
const matchQueue3x3 = new GameQueue(gameCache, 3);
const matchQueue5x5 = new GameQueue(gameCache, 5);
const matchQueue7x7 = new GameQueue(gameCache, 7);

// xác thực người dùng
io.use((socket, next) => {
    const payload = parseToken(socket.handshake.auth.token); // kiểm tra token

    if (!payload) return socket._error('invalid credentials');

    socket.data.id = payload.id;
    socket.data.name = payload.name;
    next();
});

// sư lý kết nối
io.on('connect', (socket) => {
    console.log('connect', socket.id);
    socket.join(socket.data.id);

    socket.on('find match', (mode) => {
        switch (mode) {
            case 3:
                matchQueue3x3.offer({
                    id: socket.data.id,
                    name: socket.data.name,
                });
                break;
            case 5:
                matchQueue5x5.offer({
                    id: socket.data.id,
                    name: socket.data.name,
                });
                break;
            case 7:
                matchQueue7x7.offer({
                    id: socket.data.id,
                    name: socket.data.name,
                });
                break;
            default:
                break;
        }
        console.log(matchQueue3x3.data, matchQueue5x5.data, matchQueue7x7.data);
    });

    socket.on('cancel find match', () => {
        matchQueue3x3.remove((e) => e.id === socket.data.id);
        matchQueue5x5.remove((e) => e.id === socket.data.id);
        matchQueue7x7.remove((e) => e.id === socket.data.id);

        console.log(matchQueue3x3.data, matchQueue5x5.data, matchQueue7x7.data);
    });

    socket.on('disconnect', () => {
        matchQueue3x3.remove((e) => e.id === socket.data.id);
        matchQueue5x5.remove((e) => e.id === socket.data.id);
        matchQueue7x7.remove((e) => e.id === socket.data.id);
        console.log('disconnect:', socket.id);
    });

    socket.on('join room', (roomId) => {
        const match = gameCache.Cache.get(roomId) as Match | undefined;
        if (!match) return;

        const isInRoom = match.isUserInMatch(socket.data.id);
        if (!isInRoom) return;

        socket.data.room && socket.leave(socket.data.room);
        socket.data.room = roomId;
        socket.join(roomId);

        match.start();

        io.to(socket.data.id).emit('sync match', {
            id: roomId,
            players: {
                player1: {
                    ...match.Players.player1,
                    timeout: {
                        ...match.Players.player1.timeout,
                        timeoutId: undefined,
                    },
                },
                player2: {
                    ...match.Players.player2,
                    timeout: {
                        ...match.Players.player2.timeout,
                        timeoutId: undefined,
                    },
                },
            },
            mode: match.Mode,
            currentPlayer: match.CurrentPLayer,
            board: match.Caro.Board,
            matchResult: match.MatchResult,
        });

        socket.on('move', (x, y) => {
            try {
                match.move(x, y, socket.data.id);
            } catch (error) {}

            io.to(roomId).emit('sync match', {
                id: roomId,
                players: {
                    player1: {
                        ...match.Players.player1,
                        timeout: {
                            ...match.Players.player1.timeout,
                            timeoutId: undefined,
                        },
                    },
                    player2: {
                        ...match.Players.player2,
                        timeout: {
                            ...match.Players.player2.timeout,
                            timeoutId: undefined,
                        },
                    },
                },
                mode: match.Mode,
                currentPlayer: match.CurrentPLayer,
                board: match.Caro.Board,
                matchResult: match.MatchResult,
            });
        });
    });
});

appEmitter.on('end match', (id) => {
    console.log('end match:', id);
    gameCache.Cache.del(id);
});

setInterval(() => {
    io.emit('ping', Date.now());
}, 1000);
