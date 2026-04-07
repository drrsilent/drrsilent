import type { Metadata } from 'next';
import { IBM_Plex_Mono, Manrope } from 'next/font/google';
import './globals.css';
import Header from '../components/Global/Header';
import CartDrawer from '../components/Global/CartDrawer';

const manrope = Manrope({
  variable: '--font-display',
  subsets: ['latin'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'DXLR | Engineered Comfort',
  description: 'Premium tech-inspired fashion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${plexMono.variable} min-h-screen bg-white text-[#0A0A0A] antialiased`}
      >
        <Header />
        <CartDrawer />
        {children}
      </body>
    </html>
  );
}
