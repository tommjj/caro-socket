'use client';

import { useCallback, useEffect } from 'react';

import socket from '@/lib/socket';
import { cn } from '@/lib/utils';
import useGameStore, { setGameStore } from '@/lib/store/store';

import { MoreOption, UserTopBar } from './user-bar';
import { ModeDisplay } from './set-mode-button';
import { Counter } from './counter';
import { useRouter } from 'next/navigation';

const Ping = () => {
    const ping = useGameStore((s) => s.ping);

    return (
        <div className="absolute top-[6px] left-0 text-light select-none">
            ping: {ping}ms
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

const GameMenu = () => {
    const findMatch = useGameStore((s) => s.findMatch);
    const { push } = useRouter();

    useEffect(() => {
        const handleMess = () => {
            console.log('connected');
        };

        const handleConnect = (message: string) => {
            console.log(message);
        };

        const handleMatched = (roomId: string) => {
            push(`?room=${roomId}`, undefined);
        };

        socket.on('connect', handleMess);
        socket.on('chat message', handleConnect);
        socket.on('matched', handleMatched);

        return () => {
            socket.off('connect', handleMess);
            socket.off('chat message', handleConnect);
            socket.off('matched', handleMatched);
        };
    }, [push]);

    return (
        <div
            className={cn('w-full h-full relative bg-dark overflow-hidden', {
                'pointer-events-none': findMatch,
            })}
        >
            <MoreOption />
            <Ping />
            <UserTopBar />
            <ModeDisplay />
            <Counter />
            <PlayButton />
        </div>
    );
};

export default GameMenu;
