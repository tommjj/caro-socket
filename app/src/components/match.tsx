import { FaRegCircle } from 'react-icons/fa';

import useGameStore, { Point, Timeout } from '@/lib/store/store';
import { checkWinner, cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
import socket from '@/lib/socket';
import MatchResult from './match-result';

const Timer = ({ timeout }: { timeout: Timeout }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!timeout.isCount) {
            setCount(Math.round(timeout.TimeRemaining / 1000 + 0.489));
        } else {
            setCount(
                Math.round(
                    (timeout.TimeRemaining - (Date.now() - timeout.lastTime)) /
                        1000 +
                        0.5
                )
            );
        }
    }, [timeout]);

    useEffect(() => {
        if (!timeout.isCount) return;

        const id = setInterval(() => {
            setCount((p) => (p > 0 ? p - 1 : p));
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, [timeout.isCount]);

    return (
        <span
            className={cn({
                'transition-all': true,
                'text-7xl': timeout.isCount,
                'animate-pulse-fast': count <= 10,
            })}
        >
            {count >= 10 ? (count >= 100 ? count : `0${count}`) : `00${count}`}
        </span>
    );
};

const PofBoard = ({
    x,
    y,
    type,
    isWinLine,
}: {
    x: number;
    y: number;
    type: undefined | Point;
    isWinLine: boolean;
}) => {
    const handleClick = useCallback(() => {
        socket.emit('move', x, y);
    }, [x, y]);

    return (
        <div
            className="bg-dark flex p-1 text-gray text-lg leading-[0.8] relative"
            onClick={handleClick}
        >
            <div className="flex justify-center items-center absolute top-1 left-1">{`${x},${y}`}</div>
            {type ? (
                <div className="flex justify-center items-center relative w-full h-full text-light">
                    {type === Point.O ? (
                        <FaRegCircle
                            className={cn(
                                'relative w-[80%] h-[80%] transition-all',
                                { 'scale-125': isWinLine }
                            )}
                            strokeWidth={0.5}
                        ></FaRegCircle>
                    ) : (
                        <XMarkIcon
                            className={cn(
                                'relative w-[110%] h-[110%] transition-all scale-110',
                                { 'scale-[1.4]': isWinLine }
                            )}
                            strokeWidth={3}
                        ></XMarkIcon>
                    )}
                </div>
            ) : undefined}
        </div>
    );
};

const Board = () => {
    const board = useGameStore((s) => s.match?.board)!;
    const mode = useGameStore((s) => s.match?.mode)!;

    return (
        <div
            className={cn('h-[600px] w-[600px] bg-light animate-grow', {
                'grid grid-cols-3 grid-rows-3 gap-0.5': mode === 3,
                'grid grid-cols-5 grid-rows-5 gap-0.5': mode === 5,
                'grid grid-cols-7 grid-rows-7 gap-0.5': mode === 7,
            })}
        >
            {board.map((x, ix) =>
                x.map((t, iy) => (
                    <PofBoard
                        key={`${ix},${iy}`}
                        x={ix}
                        y={iy}
                        type={t}
                        isWinLine={checkWinner(ix, iy, mode, board)}
                    ></PofBoard>
                ))
            )}
        </div>
    );
};

const LeftSide = () => {
    const opponents = useGameStore((s) => s.match?.opponents)!;
    const currentTurn = useGameStore((s) => s.match?.currentPlayer)!;

    return (
        <aside className="relative animate-down-up flex flex-col w-72 h-full overflow-hidden select-none">
            <div
                className={cn(
                    'h-32 relative w-full bg-light text-4xl font-semibold pt-4 pl-4 border-b border-dark border-dashed',
                    'before:z-10 before:absolute before:bottom-0 before:left-0 before:w-3 before:h-3 before:rounded-full before:-translate-x-1/2 before:translate-y-1/2 before:bg-dark before:border before:border-light',
                    'after:z-10 after:absolute after:bottom-0 after:right-0 after:w-3 after:h-3 after:rounded-full after:translate-x-1/2 after:translate-y-1/2 after:bg-dark after:border after:border-light'
                )}
            >
                <h2>{opponents.name}</h2>
                <p className="text-xl font-medium mt-2">
                    Team: {opponents.type}
                </p>
            </div>
            <div className="relative flex flex-col justify-end flex-grow border-x border-light overflow-hidden">
                <div
                    className={cn(
                        'w-96 h-96 border ring ring-light ring-offset-8 ring-offset-dark border-light rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-all',
                        { 'w-0 h-0 opacity-0': currentTurn !== opponents.type }
                    )}
                ></div>

                <div className="relative w-full pt-3">
                    <div className="relative text-[12rem] leading-[0.8] mb-3 drop-shadow-sm text-end z-10">
                        <div className="absolute bottom-0 left-0 text-[6rem] px-1 text-dark font-medium">
                            WINS
                        </div>
                        <div className="relative z-10 pb-4">
                            {' '}
                            0{opponents.score}
                        </div>
                    </div>

                    <div className="h-[6.5rem] w-full absolute left-0 bottom-0 bg-light"></div>
                </div>

                <div className="absolute top-2 left-4 text-gray text-5xl font-semibold">
                    {Array.from({ length: opponents.score }, (x, i) => (
                        <span key={i}>X</span>
                    ))}
                </div>

                <div className="absolute top-0 left-0 text-white text-3xl px-1">
                    <Timer timeout={opponents.timeout}></Timer>
                </div>
            </div>
        </aside>
    );
};

const RightSide = () => {
    const player = useGameStore((s) => s.match?.player)!;
    const currentTurn = useGameStore((s) => s.match?.currentPlayer)!;

    return (
        <aside className="relative animate-up-down flex flex-col w-72 h-full overflow-hidden select-none">
            <div className="relative flex-grow border-x border-light">
                <div className="relative w-full pt-3">
                    <div className="relative text-[12rem] leading-[0.8] drop-shadow-sm text-end z-10">
                        <div className="absolute top-0 left-0 text-[6rem] px-1 text-dark font-medium">
                            WINS
                        </div>
                        <div className="relative z-10 pt-4">
                            0{player.score}
                        </div>
                    </div>
                    <div className="h-[6.5rem] w-full absolute left-0 top-0 bg-light"></div>
                </div>

                <div className="absolute bottom-2 right-4 text-gray text-5xl font-semibold">
                    {Array.from({ length: player.score }, (x, i) => (
                        <span key={i}>O</span>
                    ))}
                </div>

                <div
                    className={cn(
                        'w-96 h-96 border ring ring-light ring-offset-8 ring-offset-dark border-light rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 opacity-100 transition-all',
                        { 'w-0 h-0 opacity-0': currentTurn !== player.type }
                    )}
                ></div>
                <div className="absolute bottom-0 right-0 text-white text-3xl px-1">
                    <Timer timeout={player.timeout}></Timer>
                </div>
            </div>

            <div
                className={cn(
                    'flex flex-col justify-end h-32 relative w-full pb-4 pl-4 bg-light text-4xl font-semibold border-t border-dark border-dashed ',
                    'before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 before:bg-dark before:border before:border-light',
                    'after:absolute after:top-0 after:right-0 after:w-3 after:h-3 after:rounded-full after:translate-x-1/2 after:-translate-y-1/2 after:bg-dark after:border after:border-light'
                )}
            >
                <p className="text-xl font-medium mb-2">Team: {player.type}</p>
                <h2>{player.name}</h2>
            </div>
        </aside>
    );
};

const Match = ({ roomId }: { roomId: string }) => {
    const isEnd = useGameStore((s) => s.match?.isEnd)!;

    return (
        <>
            {isEnd ? <MatchResult /> : null}
            <div className="flex w-full h-full bg-dark text-white">
                <LeftSide />

                <div className="flex justify-center items-center h-full flex-grow min-w-96 px-9">
                    <Board></Board>
                </div>

                <RightSide />
            </div>
        </>
    );
};

export default Match;
