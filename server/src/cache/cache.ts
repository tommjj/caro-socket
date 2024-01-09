import NodeCache = require('node-cache');

const gameCache = new NodeCache({ useClones: false });

export default gameCache;
