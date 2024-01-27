'use client';

import { GoKebabHorizontal } from 'react-icons/go';
import socket from '@/lib/socket';
import useGameStore from '@/lib/store/store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const LeftBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setIsOpen((priv) => !priv);
    }, []);

    return (
        <div className="relative bg-light text-dark border-r border-dark">
            <div className="relative w-14 h-full">
                <div className="absolute origin-bottom-left rotate-90 left-0 text-4xl h-10 px-3 w-72 bottom-[100%] font-medium">
                    FIAMMETTA
                </div>
                <button
                    onClick={handleToggle}
                    className="flex justify-center items-center w-full aspect-square absolute bottom-0 left-0 text-3xl"
                >
                    <GoKebabHorizontal />
                </button>
            </div>
            <div
                className={cn('transition-all overflow-hidden w-0', {
                    'w-40': isOpen,
                })}
            ></div>
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
            className={cn(
                'flex w-full h-full relative bg-dark overflow-hidden',
                {
                    'pointer-events-none': findMatch,
                }
            )}
        >
            <div className="flex-grow flex flex-col">
                <div className="flex flex-grow">
                    <LeftBar />
                    <div className="flex-grow relative h-full">
                        <div className="w-96 h-full bg-light "></div>
                    </div>
                </div>
            </div>
            <div className="h-full border-l border-light">
                <div className="h-1/2 aspect-square"></div>
                <div className="h-1/2 aspect-square">
                    <button className="h-full w-full bg-light"></button>
                </div>
            </div>
        </div>
    );
};

export default GameMenuV2;
