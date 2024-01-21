import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GameMode, Point } from './store/store';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function createBoard(width: number, height: number) {
    const board = new Array<Array<undefined | Point>>(width);
    for (let i = 0; i < width; i++) {
        board[i] = new Array<undefined | Point>(height).fill(undefined);
    }
    return board;
}

const getPoint = (
    x: number,
    y: number,
    mode: GameMode,
    board: (undefined | Point)[][]
) => {
    if (!isInBoard(x, y, mode)) return undefined;

    return board[x][y];
};

const isInBoard = (x: number, y: number, mode: GameMode) => {
    return x >= 0 && x < mode && y >= 0 && y < mode;
};

export const checkWinner = (
    x: number,
    y: number,
    mode: GameMode,
    board: (undefined | Point)[][]
) => {
    const p = getPoint(x, y, mode, board);

    if (!p) return false;

    const lengthToWin = mode === 3 ? 3 : 4;

    let xx = {
        count: 0,
        offset: 0,
    };
    let yy = {
        count: 0,
        offset: 0,
    };
    let xy = {
        count: 0,
        offset: 0,
    };
    let yx = {
        count: 0,
        offset: 0,
    };

    for (let i = 1; i <= lengthToWin; i++) {
        if (getPoint(x + (i + xx.offset), y, mode, board) === p) {
            xx.count = xx.count + 1;
        } else {
            xx.offset = -lengthToWin - 1;
        }

        if (getPoint(x, y + (i + yy.offset), mode, board) === p) {
            yy.count = yy.count + 1;
        } else {
            yy.offset = -lengthToWin - 1;
        }

        if (
            getPoint(x + (i + xy.offset), y + (i + xy.offset), mode, board) ===
            p
        ) {
            xy.count = xy.count + 1;
        } else {
            xy.offset = -lengthToWin - 1;
        }

        if (
            getPoint(x - (i + yx.offset), y + (i + yx.offset), mode, board) ===
            p
        ) {
            yx.count = yx.count + 1;
        } else {
            yx.offset = -lengthToWin - 1;
        }
    }

    if (
        xx.count === lengthToWin - 1 ||
        yy.count === lengthToWin - 1 ||
        xy.count === lengthToWin - 1 ||
        yx.count === lengthToWin - 1
    ) {
        console.log(lengthToWin);
        return true;
    }
    return false;
};
