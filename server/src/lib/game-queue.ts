import { Server } from 'socket.io';

import Queue from './queue';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';

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

            this.io.to(item).emit('matched');
            this.io.to(user).emit('matched');
        } else {
            super.offer(item);
        }
    }
}
