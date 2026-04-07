import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Global/Header';
import CartDrawer from '../components/Global/CartDrawer';

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
      <body className="min-h-screen bg-[var(--surface)] text-[var(--foreground)] antialiased">
        <Header />
        <CartDrawer />
        {children}
      </body>
    </html>
  );
}
