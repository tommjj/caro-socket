import useGameStore, { setGameStore } from '@/lib/store/store';
import { cn } from '@/lib/utils';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {} from '@heroicons/react/24/solid';
import { useCallback } from 'react';
import { GameMode, getGameMode as gm, keyGameModes } from '@/lib/game-mode';

const ModeSelector = () => {
    const selectedMode = useGameStore((s) => s.mode);

    return (
        <div className="flex items-center relative bottom-0 left-0 w-full h-[45px] pr-[300px]">
            {keyGameModes.map((m) => {
                return (
                    <button
                        onClick={() => {
                            setGameStore((p) => ({ mode: m }));
                        }}
                        key={m}
                        className={cn(
                            'flex justify-center items-center border border-light bg-dark hover:text-dark hover:bg-light transition-all text-xl text-light py-2 px-4 rounded-full w-24 mr-2',
                            { 'w-36 text-dark bg-light': m === selectedMode }
                        )}
                    >
                        {`${gm(m).width}x${gm(m).width}`}
                    </button>
                );
            })}
        </div>
    );
};

export const Board = ({
    className = '',
    mode,
}: {
    className?: string;
    mode: GameMode;
}) => {
    return (
        <div
            className={cn(
                'absolute left-3 bottom-0 z-0 aspect-square h-[520px]',
                className
            )}
        >
            <div className="flex justify-evenly absolute top-0 left-0 aspect-square h-full">
                {Array.from({ length: gm(mode).width - 1 }, (x, i) => (
                    <span
                        key={i}
                        className="block w-[10px] h-full rounded-full bg-gray "
                    ></span>
                ))}
            </div>
            <div className="flex flex-col justify-evenly absolute top-0 left-0 aspect-square h-full">
                {Array.from({ length: gm(mode).height - 1 }, (x, i) => (
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
        <div className="flex flex-col justify-end absolute left-24 bottom-6 h-full z-10">
            <div className="flex items-end absolute top-6 text-white font-normal text-[14.5rem] z-20 leading-[0.8] select-none drop-shadow-sm">
                <h1>CARO</h1>
            </div>

            <Board mode={mode} />
            <div className="relative text-[12rem] leading-none select-none font-medium text-white pl-5 mb-2 ">
                <p className="text-base leading-[0.8] px-1">m:</p>
                <p className="leading-[0.8] font-normal drop-shadow-sm">
                    {`${gm(mode).width}`}
                    <span className="text-7xl">
                        <XMarkIcon
                            className="text-7xl h-24 inline"
                            strokeWidth={2}
                        />
                    </span>
                    {`${gm(mode).height}`}
                    <span className="text-6xl">r{gm(mode).numberOfMatch}</span>
                </p>
            </div>
            <div className="flex justify-between px-6 relative h-[45px] w-[800px] text-6xl text-dark">
                <ModeSelector></ModeSelector>
                {/* <button
                    onClick={handleClickLeft}
                    className={cn(
                        'flex items-center justify-center pl-1 bg-light w-28 h-28 rounded-full hover:scale-105 transition-all group'
                    )}
                >
                    <ArrowLeftIcon
                        className="h-[70%] group-hover:-rotate-45 transition-all"
                        strokeWidth={3}
                    />
                </button>
                <div></div>
                <button
                    onClick={handleClickRight}
                    className={cn(
                        'flex items-center justify-center bg-light pr-1 w-28 h-28 rounded-full hover:scale-105 transition-all group'
                    )}
                >
                    <ArrowRightIcon
                        className="h-[70%] group-hover:-rotate-45 transition-all"
                        strokeWidth={3}
                    />
                </button> */}
            </div>
        </div>
    );
};
