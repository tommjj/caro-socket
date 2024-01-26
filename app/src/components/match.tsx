import { FaRegCircle } from 'react-icons/fa';
import { LiaTimesSolid } from 'react-icons/lia';

import useGameStore, { PointState, Timeout } from '@/lib/store/store';
import { checkWinner, cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
import socket from '@/lib/socket';
import MatchResult from './match-result';
import { ImExit } from 'react-icons/im';
import { FaRegHandshake, FaHandshakeSlash } from 'react-icons/fa';
import Icon from './icon';
import { useRouter } from 'next/navigation';
import AlertDialog, {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog/alert-dialog';

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
            setCount(
                Math.round(
                    (timeout.TimeRemaining - (Date.now() - timeout.lastTime)) /
                        1000 +
                        0.5
                )
            );
        }, 500);

        return () => {
            clearInterval(id);
        };
    }, [timeout]);

    return (
        <span
            className={cn('transition-all', {
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

const TopSide = ({ isHighlight = false }: { isHighlight?: boolean }) => {
    const opponents = useGameStore((s) => s.match?.opponents)!;

    return (
        <div
            className={cn(
                'flex flex-col relative h-1/2 aspect-square text-dark cursor-default',
                { 'text-light': isHighlight }
            )}
        >
            <div className="flex px-3 py-2 transition-all">
                <div className="flex-grow">
                    <h2 className="text-2xl font-medium">{opponents.name}</h2>
                    <p className="text-base">Team: {opponents.type}</p>
                </div>
                <div className="flex text-6xl">
                    <div className="text-base">w:</div>
                    <div
                        key={opponents.score}
                        className="relative animate-down-up"
                    >
                        0{opponents.score}
                    </div>
                </div>
            </div>

            <div className="relative flex-grow overflow-hidden">
                <div className="absolute top-0 right-3 text-3xl px-1">
                    <Timer timeout={opponents.timeout}></Timer>
                </div>
            </div>
        </div>
    );
};

const DrawRequestButton = ({
    isHighlight = false,
}: {
    isHighlight?: boolean;
}) => {
    const [isClick, setIsClick] = useState(false);
    const [isClickToDraw, setIsClickToDraw] = useState(false);

    const handleDrawRequest = useCallback(() => {
        setIsClick(true);
        socket.emit('draw request');
    }, []);

    const handleCancelDrawRequest = useCallback(() => {
        setIsClick(false);
        setIsClickToDraw(false);
        socket.emit('cancel draw request');
    }, []);

    useEffect(() => {
        const handleNewRound = () => {
            setIsClick(false);
            setIsClickToDraw(false);
        };

        const handleHasDrawRequest = () => {
            setIsClickToDraw(true);
        };

        socket.on('new round', handleNewRound);
        socket.on('draw request', handleHasDrawRequest);
        socket.on('cancel draw request', handleNewRound);

        return () => {
            socket.off('new round', handleNewRound);
            socket.off('draw request', handleHasDrawRequest);
            socket.off('cancel draw request', handleNewRound);
        };
    }, []);

    return (
        <div className="flex absolute top-3 right-3">
            {isClick ? (
                <button
                    onClick={handleCancelDrawRequest}
                    className={cn(
                        'flex items-center  px-3 py-1 rounded-full border border-dark',
                        { 'border-light': isHighlight }
                    )}
                >
                    <FaHandshakeSlash /> <span className="ml-1">Cancel</span>
                </button>
            ) : (
                <>
                    {isClickToDraw ? (
                        <button
                            onClick={handleCancelDrawRequest}
                            className={cn(
                                'flex items-center  px-3 py-1 rounded-full border border-dark mr-1',
                                { 'border-light': isHighlight }
                            )}
                        >
                            <FaHandshakeSlash />{' '}
                        </button>
                    ) : null}
                    <button
                        onClick={handleDrawRequest}
                        className={cn(
                            'flex items-center px-3 py-1 rounded-full border border-dark',
                            { 'border-light': isHighlight }
                        )}
                    >
                        <FaRegHandshake /> <span className="ml-1">Draw</span>
                    </button>
                </>
            )}
        </div>
    );
};

const BottomSide = ({ isHighlight = false }: { isHighlight?: boolean }) => {
    const player = useGameStore((s) => s.match?.player)!;

    return (
        <div
            className={cn(
                'flex flex-col relative h-1/2 aspect-square text-dark cursor-default',
                { 'text-light': isHighlight }
            )}
        >
            <div className="relative flex-grow overflow-hidden">
                <DrawRequestButton isHighlight={isHighlight} />

                <div className="absolute bottom-0 right-3 text-3xl px-1">
                    <Timer timeout={player.timeout}></Timer>
                </div>
            </div>

            <div className="flex px-3 py-2 transition-all">
                <div className="flex-grow ">
                    <h2 className="text-2xl font-medium">{player.name}</h2>
                    <p className="text-base ">Team: {player.type}</p>
                </div>
                <div className="flex text-6xl">
                    <div className="text-base">w:</div>
                    <div
                        key={player.score}
                        className="relative animate-down-up"
                    >
                        0{player.score}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlayersBar = () => {
    const player = useGameStore((s) => s.match?.player)!;
    const currentTurn = useGameStore((s) => s.match?.currentPlayer)!;
    const [isEndRound, setIsEndRound] = useState(false);

    useEffect(() => {
        const handleEndRound = () => {
            setIsEndRound(true);
        };

        const handleNewRound = () => {
            setIsEndRound(false);
        };

        socket.on('new round', handleNewRound);
        socket.on('win round', handleEndRound);
        socket.on('draw round', handleEndRound);

        return () => {
            socket.off('new round', handleNewRound);
            socket.off('win round', handleEndRound);
            socket.off('draw round', handleEndRound);
        };
    }, []);

    return (
        <aside className="relative h-full text-dark bg-dark border-l border-light animate-down-up">
            <div
                className={cn(
                    'absolute left-0 top-0 h-1/2 bg-light aspect-square transition-all',
                    {
                        'translate-y-[100%]': player.type === currentTurn,
                        'translate-y-[50%] translate-x-[300%] rounded-full scale-50':
                            isEndRound,
                    }
                )}
            ></div>
            <TopSide isHighlight={player.type === currentTurn || isEndRound} />
            {/* ------------------- */}
            <BottomSide
                isHighlight={player.type !== currentTurn || isEndRound}
            />
        </aside>
    );
};

const OutGameSide = () => {
    const { push } = useRouter();
    const handLeave = useCallback(() => {
        push('/');

        setTimeout(() => {
            socket.emit('leave room');
        }, 20);
    }, [push]);

    return (
        <aside className="flex h-full w-14 ml-2 pt-3">
            <div className="flex justify-end text-gray w-full text-5xl transform scale-x-[-1]">
                <AlertDialog>
                    <AlertDialogTrigger>
                        <button className="h-14">
                            <ImExit></ImExit>
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <button
                                    className="w-[100%] py-2 text-xl hover:bg-gray"
                                    onClick={handLeave}
                                >
                                    Leave
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </aside>
    );
};

const Match = ({ roomId }: { roomId: string }) => {
    const matchResult = useGameStore((s) => s.match?.matchResult)!;

    return (
        <>
            {matchResult === undefined ? null : <MatchResult />}
            <div className="flex w-full h-full bg-dark text-white">
                <OutGameSide />

                <div className="flex justify-center items-center h-full flex-grow min-w-96 p-5">
                    <Board />
                </div>

                <PlayersBar />
            </div>
        </>
    );
};

export default Match;
