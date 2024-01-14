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
                'text-[200px] fixed right-0 top-1/2 -translate-y-1/2 font-semibold text-gray px-5 transition-all',
                { 'text-white text-[256px]': findMatch }
            )}
        >
            {count}
        </div>
    );
};
