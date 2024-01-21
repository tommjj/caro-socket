import Queue from './queue';
import GameCache from './cache';
import { GameMode } from './game-mode';

export type User = {
    id: string;
    name: string;
};

export default class GameQueue extends Queue<User> {
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
