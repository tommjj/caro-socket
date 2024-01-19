'use client';

import useGameStore from '@/lib/store/store';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Bars3Icon } from '@heroicons/react/24/outline';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/drop-down-menu';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';

export const UserTopBar = ({ className }: { className?: string }) => {
    const user = useGameStore((s) => s.user);

    return (
        <>
            <div
                className={cn(
                    'absolute z-20 bottom-[100%] left-0 pl-5 border-l-8 border-light w-[100svh] origin-bottom-left rotate-90',
                    className
                )}
            >
                <div className="flex items-end text-6xl leading-[1.05] h-24 font-bold text-dark bg-light select-none tracking-tight px-4 w-full">
                    <div>{user ? user.name : 'YOUR NAME'}</div>
                </div>
            </div>
        </>
    );
};

export const MoreOption = () => {
    const { push } = useRouter();

    return (
        <>
            <div className="absolute top-3 right-3 z-20">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="flex items-center justify-center rounded-full h-24 w-24 bg-light">
                            <Bars3Icon
                                className="h-[70%] text-dark"
                                strokeWidth={2}
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="shadow-[0_1px_5px] shadow-light/25">
                        <DropdownMenuItem>
                            <div
                                onClick={async () => {
                                    await http.get('/api/auth/sign-out');
                                    push('/sign-in');
                                }}
                                className="flex items-center px-2 text-white text-lg w-40 h-14 cursor-pointer hover:bg-gray"
                            >
                                <ArrowLeftStartOnRectangleIcon className="w-5 mx-3"></ArrowLeftStartOnRectangleIcon>
                                Sign out
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
};
