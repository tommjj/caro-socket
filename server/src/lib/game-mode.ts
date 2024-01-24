export const Modes = {
    3: {
        width: 3,
        height: 3,
        lengthToWin: 3,
        numberOfMatch: 7,
        timeout: 1000 * 60 * 60,
    },
    5: {
        width: 5,
        height: 5,
        lengthToWin: 4,
        numberOfMatch: 5,
        timeout: 1000 * 60 * 2,
    },
    7: {
        width: 7,
        height: 7,
        lengthToWin: 5,
        numberOfMatch: 3,
        timeout: 1000 * 60 * 3,
    },
    12: {
        width: 12,
        height: 12,
        lengthToWin: 5,
        numberOfMatch: 3,
        timeout: 1000 * 60 * 10,
    },
};

export type GameMode = keyof typeof Modes;

export const getGameMode = (mode: GameMode) => {
    return Modes[mode];
};
