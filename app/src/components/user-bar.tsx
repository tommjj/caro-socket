'use client';

import useGameStore from '@/lib/store/store';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Bars3Icon } from '@heroicons/react/24/outline';

export const UserTopBar = ({ className }: { className?: string }) => {
    const user = useGameStore((s) => s.user);
    console.log(user);

    return (
        <>
            <div
                className={cn(
                    'absolute z-20 top-6 left-0 flex justify-between pl-3 border-l-8 border-light w-full',
                    className
                )}
            >
                <span className="text-8xl leading-[0.9] font-bold text-dark bg-light select-none tracking-tight px-4">
                    {user ? user.name : 'YOUR NAME'}
                </span>
                <button className="flex items-center justify-center h-[86px] w-[86px] relative right-6 bg-light">
                    <Bars3Icon className="h-[90%] text-dark" strokeWidth={2} />
                </button>
            </div>
        </>
    );
};
