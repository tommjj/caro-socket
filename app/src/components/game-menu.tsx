'use client';

import { useCallback, useEffect } from 'react';

import socket, { connectSocket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import useGameStore, { setGameStore } from '@/lib/store/store';

import { MoreOption, UserTopBar } from './user-bar';
import { ModeDisplay } from './set-mod-button';
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
                'flex items-center absolute right-0 px-9 bottom-6 bg-light text-dark text-6xl font-semibold h-28 w-[26rem] shadow-md shadow-gray translate-x-2 hover:translate-x-0 transition-all pointer-events-auto',
                {
                    'before:w-2 before:h-full before:left-2 before:top-0 before:bg-dark before:absolute before:transition-all':
                        true,
                    'before:w-0': !findMatch,
                }
            )}
        >
            <div
                className={cn('absolute transition-all opacity-100', {
                    'translate-x-40 opacity-0': findMatch,
                })}
            >
                START
            </div>
            <div
                className={cn('absolute transition-all opacity-100 ', {
                    '-translate-x-40 opacity-0 pointer-events-none': !findMatch,
                })}
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
