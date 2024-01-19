import useGameStore from '@/lib/store/store';
import { cn } from '@/lib/utils';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {} from '@heroicons/react/24/solid';
import { useCallback } from 'react';

export const Board = ({
    className = '',
    size,
}: {
    className?: string;
    size: number;
}) => {
    return (
        <div
            className={cn(
                'absolute left-3 bottom-0 z-0 w-[500px] h-[500px]',
                className
            )}
        >
            <div className="flex justify-evenly absolute top-0 left-0 w-[500px] h-[500px]">
                {Array.from({ length: size - 1 }, (x, i) => (
                    <span
                        key={i}
                        className="block w-[10px] h-full rounded-full bg-gray "
                    ></span>
                ))}
            </div>
            <div className="flex flex-col justify-evenly absolute top-0 left-0 w-[500px] h-[500px]">
                {Array.from({ length: size - 1 }, (x, i) => (
                    <span
                        key={i}
                        className="block w-full h-[10px] rounded-full bg-gray"
                    ></span>
                ))}
            </div>
        </div>
    );
};

export const ModeDisplay = () => {
    const mode = useGameStore((s) => s.mode);
    const setMode = useGameStore((s) => s.setMode);

    const handleClickLeft = useCallback(() => {
        setMode(-1);
    }, [setMode]);
    const handleClickRight = useCallback(() => {
        setMode(1);
    }, [setMode]);

    return (
        <div className="flex flex-col justify-end absolute left-28 bottom-6 h-full z-10">
            <div className="absolute top-6 text-white text-[14.5rem]  z-20 leading-[0.8] select-none drop-shadow-sm">
                CARO
            </div>

            <Board size={mode} />
            <div className="relative text-[12rem] leading-none select-none font-medium text-white pl-5 mb-2 ">
                <p className="text-base leading-[0.8] font-medium px-1">m</p>
                <p className="leading-[0.8] drop-shadow-sm">
                    {`${mode}`}
                    <span className="text-6xl">
                        <XMarkIcon
                            className="text-6xl h-16 inline"
                            strokeWidth={2}
                        />
                    </span>
                    {`${mode}`}
                    <span className="text-6xl">r{10 - mode}</span>
                </p>
            </div>
            <div className="flex justify-between px-6 relative h-28 w-[500px] text-6xl text-dark">
                <button
                    onClick={handleClickLeft}
                    className={cn(
                        'flex items-center justify-center pr-2 bg-light w-28 h-28 rounded-full hover:scale-105 transition-all'
                    )}
                >
                    <ChevronLeftIcon className="h-[70%]" strokeWidth={3} />
                </button>
                <div></div>
                <button
                    onClick={handleClickRight}
                    className={cn(
                        'flex items-center justify-center bg-light pl-2 w-28 h-28 rounded-full hover:scale-105 transition-all'
                    )}
                >
                    <ChevronRightIcon className="h-[70%]" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};
