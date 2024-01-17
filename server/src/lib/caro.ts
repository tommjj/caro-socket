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
    constructor(width: number, height: number, lengthToWin: number = 4) {
        this.width = width;
        this.height = height;
        this.lengthToWin = lengthToWin;
        this.board = Array<Array<undefined | Point>>(width).fill(
            Array<undefined | Point>(height).fill(undefined)
        );
    }

    get CurrentPlayer() {
        return this.currentPlayer;
    }

    get Board() {
        return this.board;
    }

    getPoint(x: number, y: number) {
        return this.Board[x][y];
    }

    isOccupied(x: number, y: number) {
        return this.board[x][y] !== undefined;
    }

    inInBoard(x: number, y: number) {
        return x > 0 && x < this.width && y > 0 && y < this.height;
    }

    place(x: number, y: number) {
        if (this.isOccupied(x, y) || !this.inInBoard(x, y)) {
            return false;
        }

        this.Board[x][y] = this.currentPlayer;
        this.togglePlayer();
        return true;
    }

    checkWinner(x: number, y: number) {}

    reset() {
        this.board = Array<Array<undefined | Point>>(this.width).fill(
            Array<undefined | Point>(this.height).fill(undefined)
        );
    }

    isBoardFull() {
        return this.board.every((e) => e.every((ele) => ele !== undefined));
    }

    togglePlayer() {
        this.currentPlayer = this.CurrentPlayer === Point.O ? Point.X : Point.O;
    }
}
