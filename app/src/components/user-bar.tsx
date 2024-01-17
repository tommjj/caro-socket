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
    const { push } = useRouter();
    const user = useGameStore((s) => s.user);

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
                <div className="relative right-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="flex items-center justify-center h-[86px] w-[86px] bg-light">
                                <Bars3Icon
                                    className="h-[90%] text-dark"
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
            </div>
        </>
    );
};
