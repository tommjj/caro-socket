export type GameOptions = {
    lengthToWin: number;
};

export enum Point {
    X = 'X',
    O = 'O',
}

export default class Caro {
    private width;
    private height;
    private lengthToWin;
    private board;
    private currentPlayer = Point.X;
    private winner: null | Point = null;
    constructor(width: number, height: number, lengthToWin: number = 4) {
        this.width = width;
        this.height = height;
        this.lengthToWin = lengthToWin;

        this.board = new Array<Array<undefined | Point>>(width);
        for (let i = 0; i < width; i++) {
            this.board[i] = new Array<undefined | Point>(height).fill(
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
        this.winner = this.currentPlayer === Point.X ? Point.O : Point.X;
    }

    checkWinner(x: number, y: number) {
        const p = this.getPoint(x, y);
        if (!p) return;
        console.log('p:', p);
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

        console.log('board:', this.Board);

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

            console.log(`x: ${x - (i + yx.offset)}, y: ${y + (i + yx.offset)}`);
            if (this.getPoint(x - (i + yx.offset), y + (i + yx.offset)) === p) {
                yx.count = yx.count + 1;
            } else {
                yx.offset = -this.lengthToWin - 1;
            }
        }

        console.log(xx.count, yy.count, xy.count, yx.count);

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
        this.board = new Array<Array<undefined | Point>>(this.width);
        for (let i = 0; i < this.width; i++) {
            this.board[i] = new Array<undefined | Point>(this.width).fill(
                undefined
            );
        }
        this.winner = null;
    }

    isBoardFull() {
        return this.board.every((e) => e.every((ele) => ele !== undefined));
    }

    togglePlayer() {
        this.currentPlayer = this.CurrentPlayer === Point.O ? Point.X : Point.O;
    }
}
