import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket';
import router from '@/router';

import { getCookieString } from '@/lib/utils/help-methods';
import { html } from 'hono/html';
import { auth } from '@/auth';
import Queue from '@/lib/queue';

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
                    const socket = io({ auth: { name: '' } });

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
    cors: { origin: ['http://localhost:3000', 'http://localhost:8080'] },
});

//----====SOCKET====----\\

const matchQueue = new Queue<{ userId: string; socketId: string }>();

io.use((socket, next) => {
    const cookie = getCookieString(socket.request.headers.cookie, 'auth', true);

    if (!cookie) return socket._error('invalid credentials');

    const cookieJson = JSON.parse(cookie);
    socket.data.id = cookieJson.id;
    socket.data.name = cookieJson.name;
    next();
});

io.on('connect', (socket) => {
    console.log('connect', socket.id);
    socket.join(socket.data.id);

    socket.on('find match', () => {
        matchQueue.offer({ userId: socket.data.id, socketId: socket.id });
    });
    socket.on('cancel find match', () => {
        matchQueue.remove((e) => e.userId === socket.data.id);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.data.name}: ${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('disconnect:', socket.id);
    });
});
