'use client';

import { useEffect, useState } from 'react';
import useGameStore, { setGameStore } from '@/lib/store/store';
import socket, { connectSocket } from '@/lib/socket';
import { http } from '@/lib/http';
import { UserTopBar } from './user-bar';
import { useRouter } from 'next/navigation';
import { ModeDisplay } from './set-mod-button';
import { Counter } from './counter';
import { cn } from '@/lib/utils';

const Ping = () => {
    const ping = useGameStore((s) => s.ping);

    return (
        <div className="absolute top-0 left-0 text-light select-none">
            ping: {ping}
        </div>
    );
};

const Game = () => {
    const setUser = useGameStore((s) => s.setUser);
    const findMatch = useGameStore((s) => s.findMatch);
    const mode = useGameStore((s) => s.mode);
    const { push } = useRouter();

    useEffect(() => {
        (async () => {
            if (!socket.connected) {
                const token = await http.getToken();
                if (token) connectSocket(token);
            }
        })();
        return () => {};
    }, []);

    useEffect(() => {
        const handleMess = () => {
            console.log('connected');
        };

        const handleConnect = (message: string) => {
            console.log(message);
        };

        socket.on('connect', handleMess);
        socket.on('chat message', handleConnect);

        return () => {
            socket.off('connect', handleMess);
            socket.off('chat message', handleConnect);
        };
    }, []);

    useEffect(() => {
        (async () => {
            const user = await http.getUser();
            if (user) {
                setUser(user);
            } else {
                push('/sign-in');
            }
        })();
    }, [setUser, push]);

    return (
        <div
            className={cn('w-full h-full relative bg-dark ', {
                'pointer-events-none': findMatch,
            })}
        >
            <Ping />
            <UserTopBar />
            <ModeDisplay />
            <Counter />
            <button
                onClick={async () => {
                    if (findMatch) {
                        socket.emit('cancel find match');
                        setGameStore((p) => ({ findMatch: false }));
                    } else {
                        socket.emit('find match', mode);
                        setGameStore((p) => ({ findMatch: true }));
                    }
                }}
                className="flex items-center absolute right-0 px-9  bottom-12 bg-light  text-dark text-6xl font-semibold h-28 w-96 shadow-md shadow-gray translate-x-2 hover:translate-x-0 transition-all pointer-events-auto"
            >
                {/* <div className="h-[100px] w-[100px] bg-white rounded-full ml-[6px] mr-8 p-2 shadow-md shadow-dark">
                    <div className="w-full h-full rounded-full bg-light"></div>
                </div>{' '} */}
                {findMatch ? 'CANCEL' : 'START'}
            </button>
        </div>
    );
};

export default Game;
