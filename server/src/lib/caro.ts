export type GameOptions = {
    lengthToWin: number;
};

export enum PointState {
    X = 'X',
    O = 'O',
}

// class caro sư lý các sự kiện của một round đấu
export default class Caro {
    private width;
    private height;
    private lengthToWin;
    private board;
    private currentPlayer = PointState.X;
    private winner: null | PointState = null;
    constructor(width: number, height: number, lengthToWin: number = 4) {
        this.width = width;
        this.height = height;
        this.lengthToWin = lengthToWin;

        this.board = new Array<Array<undefined | PointState>>(width);
        for (let i = 0; i < width; i++) {
            this.board[i] = new Array<undefined | PointState>(height).fill(
                undefined
            );
        }
    }

    get CurrentPlayer() {
        return this.currentPlayer;
    }

    get Board() {
        return this.board;
    }

    get Winner() {
        return this.winner;
    }

    getPoint(x: number, y: number) {
        if (!this.isInBoard(x, y)) return undefined;

        return this.Board[x][y];
    }

    isOccupied(x: number, y: number) {
        return this.board[x][y] !== undefined;
    }

    isInBoard(x: number, y: number) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    place(x: number, y: number) {
        if (this.isOccupied(x, y) || !this.isInBoard(x, y)) {
            return false;
        }

        this.Board[x][y] = this.currentPlayer;
        this.togglePlayer();
        return true;
    }

    timeOut() {
        this.winner =
            this.currentPlayer === PointState.X ? PointState.O : PointState.X;
    }

    checkWinner(x: number, y: number) {
        const p = this.getPoint(x, y);
        if (!p) return;
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

        for (let i = 1; i <= this.lengthToWin; i++) {
            if (this.getPoint(x + (i + xx.offset), y) === p) {
                xx.count = xx.count + 1;
            } else {
                xx.offset = -this.lengthToWin - 1;
            }

            if (this.getPoint(x, y + (i + yy.offset)) === p) {
                yy.count = yy.count + 1;
            } else {
                yy.offset = -this.lengthToWin - 1;
            }

            if (this.getPoint(x + (i + xy.offset), y + (i + xy.offset)) === p) {
                xy.count = xy.count + 1;
            } else {
                xy.offset = -this.lengthToWin - 1;
            }

            if (this.getPoint(x - (i + yx.offset), y + (i + yx.offset)) === p) {
                yx.count = yx.count + 1;
            } else {
                yx.offset = -this.lengthToWin - 1;
            }
        }

        if (
            xx.count === this.lengthToWin - 1 ||
            yy.count === this.lengthToWin - 1 ||
            xy.count === this.lengthToWin - 1 ||
            yx.count === this.lengthToWin - 1
        ) {
            this.winner = p;
        }
    }

    reset() {
        this.board = new Array<Array<undefined | PointState>>(this.width);
        for (let i = 0; i < this.width; i++) {
            this.board[i] = new Array<undefined | PointState>(this.width).fill(
                undefined
            );
        }
        this.winner = null;
    }

    isBoardFull() {
        return this.board.every((e) => e.every((ele) => ele !== undefined));
    }

    togglePlayer() {
        this.currentPlayer =
            this.CurrentPlayer === PointState.O ? PointState.X : PointState.O;
    }
}
