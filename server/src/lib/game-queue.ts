import Queue from './queue';
import GameCache from './cache';
import { GameMode, Modes } from './game-mode';

export type User = {
    id: string;
    name: string;
};

// hàng đợi tiềm trận
export default class GameQueueMode extends Queue<User> {
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
    private gameQueueModes: {
        [key in GameMode]?: GameQueueMode;
    } = {};

    constructor(gameCache: GameCache) {
        Object.keys(Modes)
            .map((m) => Number(m))
            .map((m) => {
                const t = m as GameMode;
                this.gameQueueModes[t] = new GameQueueMode(
                    gameCache,
                    m as GameMode
                );
            });
    }

    offer(mode: GameMode, player: User) {
        this.gameQueueModes[mode]?.offer(player);
    }

    remove(player: User) {
        Object.keys(this.gameQueueModes).forEach((k) => {
            const t = Number(k) as GameMode;
            this.gameQueueModes[t]?.remove((e) => e.id === player.id);
        });
    }

    getGameQueueMode(mode: GameMode) {
        return this.gameQueueModes[mode];
    }
}
