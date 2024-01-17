import { Metadata } from 'next';

import Game from '@/components/game';

export const metadata: Metadata = {
    title: 'caro',
};

export default function Home() {
    return (
        <main className="w-screen h-screen overflow-hidden">
            <Game />
        </main>
    );
}
