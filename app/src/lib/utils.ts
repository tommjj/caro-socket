import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PointState } from './store/store';
import { GameMode, getGameMode as gm } from './game-mode';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// tạo một bàn cờ rổng !không được sử dụng
export function createBoard(width: number, height: number) {
    const board = new Array<Array<undefined | PointState>>(width);
    for (let i = 0; i < width; i++) {
        board[i] = new Array<undefined | PointState>(height).fill(undefined);
    }
    return board;
}

//lấy một điểm trên bàn cờ với x, y
const getPoint = (
    x: number,
    y: number,
    mode: GameMode,
    board: (undefined | PointState)[][]
) => {
    if (!isInBoard(x, y, mode)) return undefined;

    return board[x][y];
};

// kiểm tra điểm có nằm trong bàn cờ không
const isInBoard = (x: number, y: number, mode: GameMode) => {
    return x >= 0 && x < gm(mode).width && y >= 0 && y < gm(mode).height;
};

// kiểm tra điểm x, y có nằm trên đường tạo chiến thắng không
export const checkWinner = (
    x: number,
    y: number,
    mode: GameMode,
    board: (undefined | PointState)[][]
) => {
    const p = getPoint(x, y, mode, board);

    if (!p) return false;

    const lengthToWin = gm(mode).lengthToWin;

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
        return true;
    }
    return false;
};
