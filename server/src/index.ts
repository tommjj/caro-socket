import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from './socket';
import api from './router';

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

app.route('/', api);

app.get('/', (c) => {
    return c.render(`<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>Socket.IO chat</title>
      <style>
        body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  
        .form__container { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
        #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
        #input:focus { outline: none; }
        .button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }
        
        .form {
          display: flex;
          flex-grow: 1;
          height: 100%;
        }

        #messages { list-style-type: none; margin: 0; padding: 0; }
        #messages > li { padding: 0.5rem 1rem; }
        #messages > li:nth-child(odd) { background: #efefef; }
      </style>
    </head>
    <body>
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
        const socket = io({auth: {name: ''}});

        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');
        const toggleConnButton = document.getElementById('conn');
        const postButton = document.getElementById('post');
        var first = true;

        let formData = new FormData();
        formData.append('name', 'John');

        postButton.addEventListener('click', async () => {
           fetch('/api/users', {
            method: 'POST',

            body: JSON.stringify({name: 'teo', password: '1234'})
           }).then(e => e.json()).then(e => {console.log(e)})
        })

        toggleConnButton.addEventListener('click', (e) => {
          if(!socket.connected) {
            socket.connect();
          } else {
            socket.disconnect();

          }
        })

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (input.value) {
            if(first) {
              socket.emit('set name', input.value);
              socket.auth.name = input.value;
              input.value = '';
              first = false;
              return;
            }
            socket.emit('chat message', input.value);
            input.value = '';
          }
        });

        socket.on('disconnect', () => {
          const item = document.createElement('li');
          item.textContent = 'disconnected';
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        })

        socket.on('connect', () => {
          const item = document.createElement('li');
          item.textContent = 'connected';
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        })

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
    console.log('server running on port', port);
});

//----====CREATE SOCKET====----\\

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, { connectionStateRecovery: {} });

//----====SOCKET====----\\

io.use((socket, next) => {
    socket.data.age = Date.now();
    next();
});

io.on('connect', (socket) => {
    console.log('connect', socket.id);

    socket.on('set name', (name) => {
        socket.data.name = name;
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + socket.handshake.auth.name);
        console.table({
            name: socket.data.name,
            are: socket.data.age,
        });
        io.emit('chat message', `${socket.data.name}: ${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('disconnect:', socket.id);
    });
});
