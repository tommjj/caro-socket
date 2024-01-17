'use client';

import { http } from '@/lib/http';
import useGameStore from '@/lib/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GameMenu from './game-menu';

const Loading = () => {
    return (
        <div className="flex justify-center items-center w-full h-full relative bg-dark">
            {/* <div className="w-[553px] h-[553px] absolute z-0">
                <span className="block w-[18px] h-full -translate-x-1/2 origin-center rotate-12 rounded-full absolute left-1/3 bg-gray"></span>
                <span className="block w-[18px] h-full -translate-x-1/2 origin-center rotate-12 rounded-full absolute left-2/3 bg-gray"></span>

                <span className="block w-full h-[18px] -translate-y-1/2 translate-x-4 rounded-full absolute top-1/3 bg-gray"></span>
                <span className="block w-full h-[18px] -translate-y-1/2 -translate-x-4 rounded-full absolute top-2/3 bg-gray"></span>
            </div> */}

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
    const user = useGameStore((s) => s.user);
    const setUser = useGameStore((s) => s.setUser);
    const { push } = useRouter();

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
