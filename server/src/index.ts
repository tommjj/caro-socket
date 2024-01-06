import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from './socket';

const port = Number(process.env.PORT) || 8080;

const app = new Hono();
const server = serve({ ...app, port }, () => {
    console.log('server running on port', port);
});

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server);

app.use(
    '/static/*',
    serveStatic({
        root: './',
        rewriteRequestPath: (path) =>
            path.replace(/^\/static/, '/public/static'),
    })
);

app.get('/', (c) => {
    return c.render(`<!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>Socket.IO chat</title>
        <style>
          body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
          #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
          #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
          #input:focus { outline: none; }
          #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }
    
          #messages { list-style-type: none; margin: 0; padding: 0; }
          #messages > li { padding: 0.5rem 1rem; }
          #messages > li:nth-child(odd) { background: #efefef; }
        </style>
      </head>
      <body>
        <ul id="messages"></ul>
        <form id="form" action="">
          <input id="input" autocomplete="off" /><button>Send</button>
        </form>

        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();

          const form = document.getElementById('form');
          const input = document.getElementById('input');
          const messages = document.getElementById('messages');

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value) {
              socket.emit('chat message', input.value);
              input.value = '';
            }
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

app.get('/hello/:name', (c) => {
    return c.text(`HELLO ${c.req.param('name')}`);
});

io.on('connect', (socket) => {
    console.log('connect', socket.id);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});
