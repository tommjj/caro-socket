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
import Queue from '@/lib/queue';
import { CORS } from '@/lib/utils/constant';
import GameQueue from './lib/game-queue';

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

app.get('/', (c) => {
    const user = auth(c);
    return c.html(html`<!DOCTYPE html>
        <html>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1.0"
                />
                <title>${user ? user.name : 'chat socket'}</title>
                <style>
                    .header {
                        margin: 0;
                        padding-left: 2rem;
                    }

                    body {
                        margin: 0;
                        padding-bottom: 3rem;
                        font-family: -apple-system, BlinkMacSystemFont,
                            'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }

                    .form__container {
                        background: rgba(0, 0, 0, 0.15);
                        padding: 0.25rem;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        display: flex;
                        height: 3rem;
                        box-sizing: border-box;
                        backdrop-filter: blur(10px);
                    }
                    #input {
                        border: none;
                        padding: 0 1rem;
                        flex-grow: 1;
                        border-radius: 2rem;
                        margin: 0.25rem;
                    }
                    #input:focus {
                        outline: none;
                    }
                    .button {
                        background: #333;
                        border: none;
                        padding: 0 1rem;
                        margin: 0.25rem;
                        border-radius: 3px;
                        outline: none;
                        color: #fff;
                    }

                    .form {
                        display: flex;
                        flex-grow: 1;
                        height: 100%;
                    }

                    #messages {
                        list-style-type: none;
                        margin: 0;
                        padding: 0;
                    }
                    #messages > li {
                        padding: 0.5rem 1rem;
                    }
                    #messages > li:nth-child(odd) {
                        background: #efefef;
                    }
                </style>
            </head>
            <body>
                <h1 class="header">${user ? user.name : ''}</h1>
                <ul id="messages"></ul>
                <div class="form__container">
                    <form class="form" id="form" action="">
                        <input id="input" autocomplete="off" />
                        <button class="button">Send</button>
                    </form>
                    <button class="button" id="conn">toggle conn</button>
                    <button class="button" id="post">post</button>
                </div>

                <script src="/socket.io/socket.io.js"></script>
                <script>
                    const socket = io({
                        auth: {
                            token: 'eyJpZCI6IjQzOGVhM2FjLWE5NTYtNDk0NC1hODQ0LTU5NjI4YzIxZDlmNiIsIm5hbWUiOiJGaWFtbWV0dGEiLCJhdmF0YXIiOiJkZWZhdWx0X2F2YXRhci5wbmciLCJleHBpcmVzIjoxNzA1Mjg5NDI0NTYwfQ==.LjoSRKIS7PO5BLYumEqQAWib/vGI6e7GPMJ0RTPJ8zQ',
                        },
                    });

                    const form = document.getElementById('form');
                    const input = document.getElementById('input');
                    const messages = document.getElementById('messages');
                    const toggleConnButton = document.getElementById('conn');
                    const postButton = document.getElementById('post');

                    postButton.addEventListener('click', async () => {
                        fetch('/api/auth/sign-in', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                username: 'Fiammetta',
                                password: 1234,
                            }),
                        })
                            .then((e) => e.json())
                            .then((e) => {
                                console.log(e);
                            });
                    });

                    toggleConnButton.addEventListener('click', (e) => {
                        if (!socket.connected) {
                            socket.connect();
                        } else {
                            socket.disconnect();
                        }
                    });

                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        if (input.value) {
                            socket.emit('chat message', input.value);
                            input.value = '';
                        }
                    });

                    socket.on('disconnect', () => {
                        const item = document.createElement('li');
                        item.textContent = 'disconnected';
                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    });

                    socket.on('connect', () => {
                        const item = document.createElement('li');
                        item.textContent = 'connected';
                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    });

                    socket.on('chat message', (msg) => {
                        const item = document.createElement('li');
                        item.textContent = msg;
                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    });
                </script>
            </body>
        </html>`);
});

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

const matchQueue3x3 = new GameQueue(io);
const matchQueue5x5 = new GameQueue(io);
const matchQueue7x7 = new GameQueue(io);

let ping = 0;

io.use((socket, next) => {
    const payload = parseToken(socket.handshake.auth.token);

    if (!payload) return socket._error('invalid credentials');

    socket.data.id = payload.id;
    socket.data.name = payload.name;
    next();
});

io.on('connect', (socket) => {
    console.log('connect', socket.id);
    socket.join(socket.data.id);

    socket.on('find match', (mode) => {
        switch (mode) {
            case 3:
                matchQueue3x3.offer(socket.data.id);
                break;
            case 5:
                matchQueue5x5.offer(socket.data.id);
                break;
            case 7:
                matchQueue7x7.offer(socket.data.id);
                break;
            default:
                break;
        }
        console.log(matchQueue3x3.data, matchQueue5x5.data, matchQueue7x7.data);
    });

    socket.on('cancel find match', () => {
        matchQueue3x3.remove((e) => e === socket.data.id);
        matchQueue5x5.remove((e) => e === socket.data.id);
        matchQueue7x7.remove((e) => e === socket.data.id);

        console.log(matchQueue3x3.data, matchQueue5x5.data, matchQueue7x7.data);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.data.name}: ${msg}`);
    });

    socket.on('disconnect', () => {
        matchQueue3x3.remove((e) => e === socket.data.id);
        matchQueue5x5.remove((e) => e === socket.data.id);
        matchQueue7x7.remove((e) => e === socket.data.id);
        console.log('disconnect:', socket.id);
    });
});

setInterval(() => {
    io.emit('ping', ping);
    ping++;
}, 1000);
