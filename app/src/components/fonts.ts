import { Nunito, Roboto, Montserrat, Bebas_Neue } from 'next/font/google';

export const nunito = Nunito({
    weight: ['200', '300', '400', '500', '600', '700', '900'],
    subsets: ['latin'],
});

export const roboto = Roboto({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ['latin'],
});

export const montserratAlternates = Montserrat({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ['latin'],
});

export const bebasNeue = Bebas_Neue({
    weight: ['400'],
    subsets: ['latin'],
});
