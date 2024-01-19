'use client';

import { http } from '@/lib/http';
import useGameStore from '@/lib/store/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import GameMenu from './game-menu';
import socket, { connectSocket } from '@/lib/socket';

const Loading = () => {
    return (
        <div className="flex justify-center items-center w-full h-full relative bg-dark">
            <div className="absolute w-[600px] h-[600px] shadow-[0_0_120px] shadow-light rounded-full animate-ping z-0"></div>
            <div className="text-[300px] text-light font-bold relative z-10">
                X-O
            </div>
            <span className="absolute right-6 bottom-4 select-none text-end text-3xl font-bold text-gray z-10 animate-pulse">
                Loading...
            </span>
        </div>
    );
};

const Game = () => {
    const searchParams = useSearchParams();

    console.log(searchParams.toString());
    const user = useGameStore((s) => s.user);
    const setUser = useGameStore((s) => s.setUser);
    const { push } = useRouter();

    // create connection
    useEffect(() => {
        (async () => {
            if (!user) return;
            if (!socket.connected) {
                const token = await http.getToken();
                if (token) connectSocket(token);
            }
        })();
        return () => {};
    }, [user]);

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

    return <>{user ? <GameMenu /> : <Loading />}</>;
};

export default Game;
