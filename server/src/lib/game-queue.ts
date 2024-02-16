import Queue from './queue';
import GameCache from './cache';
import { GameMode, Modes } from './game-mode';

export type User = {
    id: string;
    name: string;
};

// hàng đợi tiềm trận
export default class GameModeQueue extends Queue<User> {
    private gameCache;
    private mode;
    constructor(gameCache: GameCache, mode: GameMode) {
        super();
        this.mode = mode;
        this.gameCache = gameCache;
    }

    offer(player: User): void {
        if (this.size() > 0) {
            const player1 = this.poll()!;

            this.gameCache.createGame(player, player1, this.mode);
        } else {
            super.offer(player);
        }
    }
}

export class GameQueue {
    private queueMap = new Map<GameMode, GameModeQueue>();

    constructor(private gameCache: GameCache) {}

    offer(mode: GameMode, player: User) {
        this.getGameModeQueue(mode).offer(player);
    }

    remove(player: User) {
        this.queueMap.forEach((queue) =>
            queue.remove((e) => e.id === player.id)
        );
    }

    private getGameModeQueue(mode: GameMode) {
        if (!this.queueMap.has(mode)) {
            this.queueMap.set(mode, new GameModeQueue(this.gameCache, mode));
        }

        return this.queueMap.get(mode)!;
    }
}
