import useGameStore from '@/lib/store/store';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {} from '@heroicons/react/24/solid';
import { useCallback } from 'react';

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
        <div className="flex flex-col justify-end absolute left-0 bottom-12 h-5/6 z-10">
            <div className="absolute left-11 top-[10%] z-0">
                <div className="flex justify-evenly absolute top-0 left-0 w-[500px] h-[500px]">
                    {Array.from({ length: mode - 1 }, (x, i) => (
                        <span
                            key={i}
                            className="block w-[18px] h-full rounded-full bg-gray "
                        ></span>
                    ))}
                </div>
                <div className="flex flex-col justify-evenly absolute top-0 left-0 w-[500px] h-[500px]">
                    {Array.from({ length: mode - 1 }, (x, i) => (
                        <span
                            key={i}
                            className="block w-full h-[18px] rounded-full bg-gray"
                        ></span>
                    ))}
                </div>
            </div>
            <div className="relative text-[200px] leading-none select-none font-semibold text-white pl-5">
                {`${mode}`}
                <span className="text-6xl">X</span>
                {`${mode}`}
                <span className="text-6xl">r{10 - mode}</span>
            </div>
            <div className="flex justify-around relative h-28 w-[500px] text-6xl text-dark">
                <button
                    onClick={handleClickLeft}
                    className="flex items-center justify-center pr-2 bg-light w-28 h-28 rounded-full hover:scale-105 transition-all"
                >
                    <ChevronLeftIcon className="h-[70%]" strokeWidth={2} />
                </button>
                <div></div>
                <button
                    onClick={handleClickRight}
                    className="flex items-center justify-center bg-light pl-2 w-28 h-28 rounded-full hover:scale-105 transition-all"
                >
                    <ChevronRightIcon className="h-[70%]" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
};
