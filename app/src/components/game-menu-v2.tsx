'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/drop-down-menu';
import { LiaTimesSolid } from 'react-icons/lia';
import { FaArrowRight } from 'react-icons/fa';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoIosArrowRoundForward } from 'react-icons/io';
import socket from '@/lib/socket';
import useGameStore, { setGameStore } from '@/lib/store/store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/16/solid';
import { http } from '@/lib/http';
import { Counter } from './counter';
import { Board } from './set-mode-button';
import { keyGameModes, getGameMode as gm } from '@/lib/game-mode';

const Header = () => {
    const { push } = useRouter();

    return (
        <header className="flex items-center justify-between fixed top-0 left-0 w-full h-20 text-light px-3 text-6xl font-medium">
            <div className="">
                <span>XO/</span>
                <span>FIAMMETTA</span>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="pt-1">
                            <AiOutlineMenu />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="shadow-[0_1px_5px] shadow-light/25">
                        <DropdownMenuItem>
                            <div
                                onClick={async () => {
                                    await http.get('/api/auth/sign-out');
                                    push('/sign-in');
                                }}
                                className="flex items-center px-2 text-white text-lg w-40 h-14 cursor-pointer bg-dark hover:bg-gray"
                            >
                                <ArrowLeftStartOnRectangleIcon className="w-5 mx-3"></ArrowLeftStartOnRectangleIcon>
                                Sign out
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

const ModeSelector = () => {
    const selectedMode = useGameStore((s) => s.mode);

    return (
        <div className="flex items-center fixed bottom-0 left-0 w-full h-16 pr-[300px] px-3 pb-p">
            {keyGameModes.map((m) => {
                return (
                    <button
                        onClick={() => {
                            setGameStore((p) => ({ mode: m }));
                        }}
                        key={m}
                        className={cn(
                            'flex justify-center items-center border border-light bg-dark hover:text-dark hover:bg-light transition-all text-xl text-light py-2 px-4 rounded-full w-24 mr-2',
                            { 'w-36 text-dark bg-light': m === selectedMode }
                        )}
                    >
                        {`${gm(m).width}x${gm(m).width}`}
                    </button>
                );
            })}
        </div>
    );
};

const PlayButton = () => {
    const findMatch = useGameStore((s) => s.findMatch);
    const mode = useGameStore((s) => s.mode);

    const handleClick = useCallback(() => {
        if (findMatch) {
            socket.emit('cancel find match');
            setGameStore((p) => ({ findMatch: false }));
        } else {
            socket.emit('find match', mode);
            setGameStore((p) => ({ findMatch: true }));
        }
    }, [findMatch, mode]);

    return (
        <button
            onClick={handleClick}
            className={cn(
                'flex items-center justify-center absolute right-4 px-9 bottom-4 bg-light text-dark text-7xl font-medium h-28 w-[26rem] transition-all pointer-events-auto ring-0 ring-offset-4 ring-offset-dark border-dark',
                { 'bg-dark border border-light text-light': findMatch }
            )}
        >
            <div
                className={cn(
                    'flex items-center absolute transition-all opacity-100',
                    {
                        'translate-x-40 opacity-0': findMatch,
                    }
                )}
            >
                START
            </div>
            <div
                className={cn(
                    'flex items-center absolute transition-all opacity-100 ',
                    {
                        '-translate-x-40 opacity-0 pointer-events-none':
                            !findMatch,
                    }
                )}
            >
                CANCEL
            </div>
        </button>
    );
};

const ModeDisplay = () => {
    const currentMode = useGameStore((s) => s.mode);

    return (
        <div className="absolute bottom-0 left-0 px-3 pb-16 select-none text-light leading-[0.8] text-[26rem] drop-shadow ">
            <div className="flex items-end relative z-20">
                <div className="w-[500px] text-end">
                    {gm(currentMode).width < 10
                        ? `0${gm(currentMode).width}`
                        : gm(currentMode).width}
                </div>

                <span className="text-9xl">
                    r{gm(currentMode).numberOfMatch}
                </span>
            </div>
            <div className="absolute -bottom-1 left-0 opacity-50">
                <Board mode={currentMode}></Board>
            </div>
        </div>
    );
};

const GameMenuV2 = () => {
    const findMatch = useGameStore((s) => s.findMatch);
    const { push } = useRouter();

    useEffect(() => {
        const handleConnect = () => {
            console.log('connected');
        };

        const handleMatched = (roomId: string) => {
            push(`?room=${roomId}`, undefined);
        };

        socket.on('connect', handleConnect);
        socket.on('matched', handleMatched);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('matched', handleMatched);
        };
    }, [push]);

    return (
        <div
            className={cn('w-full h-full relative bg-dark overflow-hidden', {
                'pointer-events-none': findMatch,
            })}
        >
            <Header />
            <Counter />
            <ModeDisplay />
            <ModeSelector />
            <PlayButton />
        </div>
    );
};

export default GameMenuV2;
