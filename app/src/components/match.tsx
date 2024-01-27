import useGameStore, { PointState, Timeout } from '@/lib/store/store';
import { checkWinner, cn } from '@/lib/utils';

import { useCallback, useEffect, useState } from 'react';
import socket from '@/lib/socket';
import MatchResult from './match-result';
import { ImExit } from 'react-icons/im';
import { FaRegHandshake, FaHandshakeSlash } from 'react-icons/fa';
import Icon, { IconType, IconList } from './icon';
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
import Board from './board';

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

const IconDisplay = () => {
    const [currentIcon, setCurrentIcon] = useState<IconType>('Meh');

    useEffect(() => {
        const handleSetIcon = (i: IconType) => {
            setCurrentIcon(i);
        };

        socket.on('icon', handleSetIcon);

        return () => {
            socket.off('icon', handleSetIcon);
        };
    }, []);

    return (
        <div className="text-[10rem] text-[#00000030]">
            <Icon iconType={currentIcon} />
        </div>
    );
};

const TopSide = ({ isHighlight = false }: { isHighlight?: boolean }) => {
    const opponents = useGameStore((s) => s.match?.opponents)!;

    return (
        <div
            className={cn(
                'flex flex-col relative h-1/2 aspect-square text-dark cursor-default select-none',
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
                <div className="absolute bottom-3 left-3">
                    <IconDisplay />
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

const IconSelector = ({ isHighlight = false }: { isHighlight?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [iconSelected, setIconSelected] = useState<IconType>('Meh');

    const handleToggle = useCallback(() => {
        setIsOpen((isOpen) => !isOpen);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className={cn(
                    'relative h-1/2  text-xl aspect-square text-dark px-3 py-2 pb-1',
                    { 'text-light': isHighlight }
                )}
            >
                <Icon iconType={iconSelected}></Icon>
            </button>
            {isOpen ? (
                <div className="flex flex-wrap absolute top-[100%] left-2 w-[200px]">
                    {Object.keys(IconList).map((key) => {
                        const i = key as IconType;

                        return (
                            <button
                                className="p-1 text-xl"
                                key={i}
                                onClick={() => {
                                    socket.emit('icon', i);
                                    setIconSelected(i);
                                    handleToggle();
                                }}
                            >
                                <Icon iconType={i}></Icon>
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

const BottomSide = ({ isHighlight = false }: { isHighlight?: boolean }) => {
    const player = useGameStore((s) => s.match?.player)!;

    return (
        <div
            className={cn(
                'flex flex-col relative h-1/2 aspect-square text-dark cursor-default select-none',
                { 'text-light': isHighlight }
            )}
        >
            <div className="relative flex-grow overflow-hidden">
                <IconSelector isHighlight={isHighlight}></IconSelector>
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
        }, 1000);
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
