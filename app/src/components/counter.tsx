import useGameStore from '@/lib/store/store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const Counter = () => {
    const [count, setCount] = useState(0);
    const findMatch = useGameStore((s) => s.findMatch);

    useEffect(() => {
        if (!findMatch) return;

        let count = 0;
        const iId = setInterval(() => {
            count = count + 1;
            setCount(count);
        }, 1000);

        return () => {
            clearInterval(iId);
            setCount(0);
        };
    }, [findMatch]);

    return (
        <div
            className={cn(
                'text-[200px] fixed right-0 top-1/2 -translate-y-1/2 font-medium text-gray px-5 transition-all ',
                { 'text-white text-[256px]': findMatch }
            )}
        >
            <div
                className={cn(
                    'flex justify-center items-center w-0 h-0 rounded-full absolute top-1/2 -translate-y-1/2 right-14 transition-all translate-x-1/2 z-0 opacity-0',
                    {
                        'w-[1000px] h-[1000px] shadow-[0_0_120px] shadow-light opacity-100':
                            findMatch,
                    }
                )}
            >
                {' '}
                <div
                    className={cn(
                        'absolute w-0 h-0 rounded-full transition-all z-0 opacity-0 ',
                        'before:absolute before:w-3 before:h-3 before:top-0 before:left-1/2 before:origin-center before:bg-light before:rounded-full before:-translate-y-1/2 before:opacity-0',
                        'after:absolute after:w-3 after:h-3 after:bottom-0 after:left-1/2 after:origin-center after:bg-light after:rounded-full after:translate-y-[25px] after:opacity-0',
                        {
                            'w-[1320px] h-[1320px] border border-light ring-[1px] ring-offset-dark ring-offset-[18px] ring-light opacity-100 animate-spin-slow before:opacity-100 after:opacity-100':
                                findMatch,
                        }
                    )}
                ></div>
            </div>

            <div className="z-10 relative select-none">
                {count}
                <span className="text-2xl">/s</span>
            </div>
        </div>
    );
};
