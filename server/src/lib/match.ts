import { Server } from 'socket.io';
import Caro, { PointState } from './caro';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '@/socket/types';
import { GameMode, getGameMode as gm } from './game-mode';
import appEmitter from './event';

export type Timeout = {
    timeoutId: NodeJS.Timeout | undefined;
    TimeRemaining: number;
    lastTime: number;
    isCount: boolean;
};

export type Player = {
    id: string;
    name: string;
    score: number;
    type: PointState;
    timeout: Timeout;
};

export type Players = {
    player1: Player;
    player2: Player;
};

function playersBuilder(
    player1: { id: string; name: string },
    player2: { id: string; name: string },
    GameMode: GameMode
): Players {
    const randBool = Math.random() < 0.5;

    return {
        player1: {
            ...player1,
            score: 0,
            type: randBool ? PointState.X : PointState.O,
            timeout: {
                timeoutId: undefined,
                isCount: false,
                lastTime: Date.now(),
                TimeRemaining: gm(GameMode).timeout,
            },
        },
        player2: {
            ...player2,
            score: 0,
            type: !randBool ? PointState.X : PointState.O,
            timeout: {
                timeoutId: undefined,
                isCount: false,
                lastTime: Date.now(),
                TimeRemaining: gm(GameMode).timeout,
            },
        },
    };
}

// class sư lý một trận đấu
export default class Match {
    private isStart: boolean = false;
    private id: string;
    private players: Players;
    private caro: Caro;
    private numberOfMatch: number;
    private io;
    private mode;
    private matchResult: string | null | undefined;
    private drawRequest: string | undefined;

    constructor(
        io: Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >,
        id: string,
        player1: { id: string; name: string },
        player2: { id: string; name: string },
        mode: GameMode
    ) {
        this.id = id;
        this.io = io;

        this.mode = mode;

        this.players = playersBuilder(player1, player2, mode);

        this.caro = new Caro(
            gm(mode).width,
            gm(mode).height,
            gm(mode).lengthToWin
        );
        this.numberOfMatch = gm(mode).numberOfMatch;
    }

    get Id() {
        return this.id;
    }

    get Caro() {
        return this.caro;
    }

    get Players() {
        return this.players;
    }

    get Mode() {
        return this.mode;
    }

    get CurrentPLayer() {
        return this.caro.CurrentPlayer;
    }

    get MatchResult() {
        return this.matchResult;
    }

    start() {
        if (this.isStart) return;

        this.handleSetTimeout();
    }

    setTimeoutById(id: string) {
        const playerSetTimeout =
            this.players.player1.id === id
                ? this.players.player1.timeout
                : this.players.player2.timeout;

        this.clearTimeoutById(id);

        playerSetTimeout.isCount = true;
        playerSetTimeout.lastTime = Date.now();

        playerSetTimeout.timeoutId = setTimeout(() => {
            if (this.MatchResult !== undefined) return;
            this.caro.timeOut();

            const winner = this.caro.Winner;

            if (winner) {
                const playerId =
                    this.players.player1.type === winner
                        ? this.players.player1.id
                        : this.players.player2.id;

                this.handleWin(playerId, winner);
            }
        }, playerSetTimeout.TimeRemaining);
    }

    clearTimeoutById(id: string) {
        const playerClearTimeout =
            this.players.player1.id === id
                ? this.players.player1.timeout
                : this.players.player2.timeout;

        if (!playerClearTimeout.isCount) return;

        clearTimeout(playerClearTimeout.timeoutId);

        playerClearTimeout.TimeRemaining =
            playerClearTimeout.TimeRemaining -
            (Date.now() - playerClearTimeout.lastTime);
        playerClearTimeout.isCount = false;
    }

    toggleTimeout() {}

    private handleSetTimeout() {
        if (this.matchResult !== undefined) {
            this.clearTimeoutById(this.players.player1.id);
            this.clearTimeoutById(this.players.player2.id);
            return;
        }

        const playerClearTimeoutId =
            this.Players.player1.type === this.caro.CurrentPlayer
                ? this.Players.player2.id
                : this.Players.player1.id;
        const playerSetTimeoutId =
            this.Players.player1.type !== this.caro.CurrentPlayer
                ? this.Players.player2.id
                : this.Players.player1.id;

        // clear timeout
        this.clearTimeoutById(playerClearTimeoutId);

        //set timeout
        this.setTimeoutById(playerSetTimeoutId);
    }

    canMovingHere(x: number, y: number, playerId: string) {
        const player =
            this.players.player1.id === playerId
                ? this.players.player1
                : this.players.player2;

        if (player.type !== this.caro.CurrentPlayer) return false;

        if (this.caro.Winner) return false;
        if (this.matchResult) return false;
        return true;
    }

    move(x: number, y: number, playerId: string) {
        if (!this.canMovingHere(x, y, playerId)) return;

        this.caro.place(x, y);
        this.handleSetTimeout();
        this.sync();

        this.caro.checkWinner(x, y);

        const winner = this.caro.Winner;

        if (winner) {
            this.handleWin(playerId, winner);
        } else {
            const isBoardFull = this.caro.isBoardFull();

            if (isBoardFull) {
                this.handleDraw();
            }
        }
    }

    handleDrawRequest(playerId: string) {
        if (!this.drawRequest) {
            this.io.to(this.id).emit('draw request');
            this.drawRequest = playerId;
            return;
        }

        if (playerId !== this.drawRequest) {
            this.handleDraw();
        }
    }

    handleCancelDrawRequest() {
        this.io.to(this.id).emit('cancel draw request');
        this.drawRequest = undefined;
    }

    newRound() {
        this.drawRequest = undefined;
        this.caro.reset();

        this.clearTimeoutById(this.players.player1.id);
        this.clearTimeoutById(this.players.player2.id);
        this.players.player1.timeout.TimeRemaining = gm(this.mode).timeout;
        this.players.player2.timeout.TimeRemaining = gm(this.mode).timeout;

        setTimeout(() => {
            this.io.to(this.id).emit('new round');
            this.handleSetTimeout();
            this.sync();
        }, 700);
    }

    getSyncData() {
        return {
            id: this.Id,
            players: {
                player1: {
                    ...this.Players.player1,
                    timeout: {
                        ...this.Players.player1.timeout,
                        timeoutId: undefined,
                    },
                },
                player2: {
                    ...this.Players.player2,
                    timeout: {
                        ...this.Players.player2.timeout,
                        timeoutId: undefined,
                    },
                },
            },
            mode: this.Mode,
            currentPlayer: this.CurrentPLayer,
            board: this.Caro.Board,
            matchResult: this.MatchResult,
        };
    }

    handleLeave(id: string) {
        this.matchResult =
            this.players.player1.id === id
                ? this.players.player2.id
                : this.players.player1.id;

        this.sync();

        this.clearTimeoutById(this.players.player1.id);
        this.clearTimeoutById(this.players.player2.id);
        appEmitter.emit('end match', this.id);
    }

    sync() {
        this.io.to(this.Id).emit('sync match', this.getSyncData());
    }

    private handleWin(playerId: string, winner: PointState) {
        this.upScore(winner);

        const userWon = this.getWinner();

        if (userWon) {
            this.matchResult = userWon;
            this.io.to(this.id).emit('win match', userWon);

            appEmitter.emit('end match', this.id);
        } else {
            this.io.to(this.id).emit('win round', playerId);
        }

        this.newRound();
    }

    private handleDraw() {
        this.draw();

        const userWon = this.getWinner();
        const isDraw = this.isDraw();

        if (isDraw) {
            this.matchResult = null;
            this.io.to(this.id).emit('draw match');

            appEmitter.emit('end match', this.id);
        } else if (userWon) {
            this.matchResult = userWon;

            this.io.to(this.id).emit('win match', userWon);

            appEmitter.emit('end match', this.id);
        } else {
            this.io.to(this.id).emit('draw round');
        }

        this.newRound();
    }

    draw() {
        this.players.player1.score += 1;
        this.players.player2.score += 1;
    }

    upScore(p: PointState) {
        const player =
            this.players.player1.type === p
                ? this.players.player1
                : this.players.player2;

        player.score = player.score + 1;
    }

    isUserInMatch(id: string) {
        return this.players.player1.id === id || this.players.player2.id === id;
    }

    isDraw() {
        return (
            this.players.player1.score === this.players.player2.score &&
            this.players.player1.score > this.numberOfMatch / 2
        );
    }

    getWinner() {
        return this.players.player1.score > this.numberOfMatch / 2
            ? this.players.player1.id
            : this.players.player2.score > this.numberOfMatch / 2
            ? this.players.player2.id
            : undefined;
    }
}
