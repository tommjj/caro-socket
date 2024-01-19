import { Server } from 'socket.io';

import Queue from './queue';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';
import { randomUUID } from 'crypto';

export default class GameQueue extends Queue<string> {
    private io;
    constructor(
        io: Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >
    ) {
        super();
        this.io = io;
    }

    offer(item: string): void {
        if (this.size() > 0) {
            const user = this.poll()!;

            const roomId = randomUUID();

            this.io.to(item).emit('matched', roomId);
            this.io.to(user).emit('matched', roomId);
        } else {
            super.offer(item);
        }
    }
}
