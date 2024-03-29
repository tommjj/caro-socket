import type { Metadata } from 'next';
import { montserratAlternates } from '@/components/fonts';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'CARO',
    description: 'game caro',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={montserratAlternates.className}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
