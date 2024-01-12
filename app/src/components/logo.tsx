import TicTacToeSVG from '../../public/tic-tac-toe-game-svgrepo-com.svg';
import Image from 'next/image';

export const Logo = ({ className = '' }: { className?: string }) => {
    return (
        <Image
            className={className}
            priority
            src={TicTacToeSVG}
            height={32}
            width={32}
            alt="Logo"
        />
    );
};
