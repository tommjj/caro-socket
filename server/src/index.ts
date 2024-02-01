import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { Server as ServerHttp, createServer } from 'node:https';

import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';
import router from '@/router';
import { Server } from 'socket.io';
import { parseToken } from '@/auth';
import { CORS } from '@/lib/utils/constant';
import { GameQueue } from '@/lib/game-queue';
import GameCache from '@/lib/cache';
import Match from '@/lib/match';
import appEmitter from '@/lib/event';

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
const gameQueue = new GameQueue(gameCache);

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
        gameQueue.offer(mode, { id: socket.data.id, name: socket.data.name });
    });

    socket.on('cancel find match', () => {
        gameQueue.remove({ id: socket.data.id, name: socket.data.name });
    });

    socket.on('join room', (roomId) => {
        //kiểm tra màng chơi có trong cache và người chơi đó có là một người chơi trong phòng không
        const match = gameCache.Cache.get(roomId) as Match | undefined;
        if (!match) return socket.emit('not found');

        const isInRoom = match.isUserInMatch(socket.data.id);
        if (!isInRoom) return socket.emit('not found');

        socket.data.room && socket.leave(socket.data.room);
        socket.data.room = roomId;
        socket.join(roomId);

        match.start(); // khơi động màng chơi khi có người chơi kết nối

        //gưi đồng bộ đến máy khách
        match.sync();
    });

    socket.on('move', (x, y) => {
        const match = gameCache.Cache.get(socket.data.room) as
            | Match
            | undefined;
        if (!match) return socket.emit('not found');

        match.move(x, y, socket.data.id);
    });

    socket.on('draw request', () => {
        const match = gameCache.Cache.get(socket.data.room) as
            | Match
            | undefined;
        if (!match) return socket.emit('not found');

        match.handleDrawRequest(socket.data.id);
    });

    socket.on('cancel draw request', () => {
        const match = gameCache.Cache.get(socket.data.room) as
            | Match
            | undefined;
        if (!match) return socket.emit('not found');

        match.handleCancelDrawRequest();
    });

    socket.on('leave room', () => {
        const match = gameCache.Cache.get(socket.data.room) as
            | Match
            | undefined;
        if (!match) return socket.emit('not found');

        match.handleLeave(socket.data.id);
    });

    socket.on('icon', (i) => {
        const match = gameCache.Cache.get(socket.data.room) as
            | Match
            | undefined;
        if (!match) return socket.emit('not found');

        io.to(
            socket.data.id === match.Players.player1.id
                ? match.Players.player2.id
                : match.Players.player1.id
        ).emit('icon', i);
    });

    socket.on('disconnect', () => {
        gameQueue.remove({ id: socket.data.id, name: socket.data.name });
    });
});

appEmitter.on('end match', (id) => {
    console.log('end match:', id);
    gameCache.Cache.del(id);
});

setInterval(() => {
    io.emit('ping', Date.now());
}, 1000);
