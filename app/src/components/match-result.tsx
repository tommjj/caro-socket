'use client';

import useGameStore, { Player } from '@/lib/store/store';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const MatchResult = () => {
    const { push } = useRouter();
    const match = useGameStore((s) => s.match)!;

    let won: Player;
    let lost: Player;

    if (match.matchResult === null) {
        won = match.opponents;
        lost = match.player;
    } else {
        won =
            match.player.id === match.matchResult
                ? match.player
                : match.opponents;
        lost =
            match.opponents.id === match.matchResult
                ? match.player
                : match.opponents;
    }

    return (
        <div className="flex fixed w-screen bg-dark h-screen z-50 select-none">
            {match.matchResult === null ? (
                <>
                    <div
                        className={cn(
                            'relative h-full px-3 overflow-hidden w-10/12 bg-light text-dark border-r-1 border-dark mr-1 animate-left-right transition-all hover:pl-5'
                        )}
                    >
                        <div
                            className={cn(
                                'text-[8.5rem] leading-[0.8] mt-6 font-semibold'
                            )}
                        >
                            DRAW
                        </div>
                        <div
                            className={cn('w-full h-1', { 'bg-dark': true })}
                        ></div>
                        <div>
                            <div className="px-1">NAME 01:</div>
                            <div className="text-[4rem] leading-none">
                                {won.name}
                            </div>
                            <div className="px-1 pt-3">NAME 02:</div>
                            <div className="text-[4rem] leading-none">
                                {lost.name}
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-3 text-[15rem] leading-none">
                            0{won.score}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={cn(
                            'relative w-5/12 h-full px-3 animate-left-right transition-all hover:pl-5',
                            {
                                'bg-light text-dark': true,
                            }
                        )}
                    >
                        <div
                            className={cn(
                                'text-[8.5rem] leading-[0.8] mt-6 font-semibold'
                            )}
                        >
                            WON
                        </div>
                        <div
                            className={cn('w-full h-1', { 'bg-dark': true })}
                        ></div>
                        <div>
                            <div className="px-1">NAME:</div>
                            <div className="text-[4rem] leading-none">
                                {won.name}
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-3 text-[15rem] leading-none">
                            0{won.score}
                        </div>
                    </div>
                    <div
                        className={cn(
                            'relative w-5/12 h-full px-3 animate-down-up transition-all hover:pl-5',
                            {
                                'bg-light text-dark': false,
                                'bg-dark text-light': true,
                            }
                        )}
                    >
                        <div
                            className={cn(
                                'text-[8.5rem] leading-[0.8] mt-6 font-semibold'
                            )}
                        >
                            LOST
                        </div>
                        <div
                            className={cn('w-full h-1', {
                                'bg-dark': false,
                                'bg-light': true,
                            })}
                        ></div>
                        <div>
                            <div className="px-1">NAME:</div>
                            <div className="text-[4rem] leading-none">
                                {lost.name}
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-3 text-[15rem] leading-none">
                            0{lost.score}
                        </div>
                    </div>
                </>
            )}

            <button
                className="group w-2/12 bg-light relative text-white animate-up-down"
                onClick={() => {
                    push('/');
                }}
            >
                <div className="bottom-[100%] absolute left-0 text-8xl origin-bottom-left rotate-90 ">
                    NEXT
                </div>
                <div className="absolute bottom-0 left-0 w-full px-3 group-hover:translate-x-4 transition-all">
                    <ArrowRightIcon className="w-full"></ArrowRightIcon>
                </div>
            </button>
        </div>
    );
};

export default MatchResult;
