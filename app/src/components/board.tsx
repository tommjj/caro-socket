'use client';

import { checkWinner, cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { FaRegCircle } from 'react-icons/fa';
import socket from '@/lib/socket';
import useGameStore, { PointState } from '@/lib/store/store';
import { useCallback } from 'react';

const PofBoard = ({
    x,
    y,
    type,
    isWinLine,
    inTurn,
    playerType,
}: {
    x: number;
    y: number;
    type: undefined | PointState;
    isWinLine: boolean;
    inTurn: boolean;
    playerType: PointState;
}) => {
    const handleClick = useCallback(() => {
        if (type) return;
        socket.emit('move', x, y);
    }, [type, x, y]);

    return (
        <div
            className={cn(
                'bg-dark flex p-1 text-gray text-lg leading-[0.8] relative',
                { 'cursor-pointer': inTurn }
            )}
            onClick={handleClick}
        >
            <div className="flex justify-center items-center absolute top-1 left-1 select-none text-sm">{`${x},${y}`}</div>
            {type ? (
                <div className="flex justify-center items-center relative w-full h-full text-light">
                    {type === PointState.O ? (
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
            ) : inTurn ? (
                <div className="flex justify-center items-center relative w-full h-full text-[#00000000] hover:text-gray">
                    {playerType === PointState.O ? (
                        <FaRegCircle
                            className={cn(
                                'relative w-[80%] h-[80%] transition-all'
                            )}
                            strokeWidth={0.5}
                        ></FaRegCircle>
                    ) : (
                        <XMarkIcon
                            className={cn(
                                'relative w-[110%] h-[110%] transition-all scale-110'
                            )}
                            strokeWidth={3}
                        ></XMarkIcon>
                    )}
                </div>
            ) : null}
        </div>
    );
};

const Board = () => {
    const board = useGameStore((s) => s.match?.board)!;
    const mode = useGameStore((s) => s.match?.mode)!;
    const player = useGameStore((s) => s.match?.player)!;
    const currentTurn = useGameStore((s) => s.match?.currentPlayer)!;

    return (
        <div
            className={cn('h-full aspect-square bg-light animate-grow', {
                'grid grid-cols-3 grid-rows-3 gap-0.5': mode === 3,
                'grid grid-cols-5 grid-rows-5 gap-0.5': mode === 5,
                'grid grid-cols-7 grid-rows-7 gap-0.5': mode === 7,
                'grid grid-cols-12 grid-rows-12 gap-0.5': mode === 12,
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
                        playerType={player.type}
                        inTurn={currentTurn === player.type}
                    ></PofBoard>
                ))
            )}
        </div>
    );
};

export default Board;
