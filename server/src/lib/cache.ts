import NodeCache = require('node-cache');

class GameCache {
    private cache;

    constructor(cache?: NodeCache) {
        this.cache = cache || new NodeCache({ useClones: false });
    }

    get getCache() {
        return this.cache;
    }
}

export const gameCache = new GameCache();
export default GameCache;
