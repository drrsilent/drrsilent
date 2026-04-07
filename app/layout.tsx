import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Global/Header';
import CartDrawer from '../components/Global/CartDrawer';

export const metadata: Metadata = {
  metadataBase: new URL('https://drrsilent-git-main-drrsilents-projects.vercel.app'),
  title: 'DXLR | Engineered Comfort',
  description:
    'Quiet luxury streetwear with a sharper silhouette, premium essentials, and an engineered comfort finish.',
  applicationName: 'DXLR',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DXLR | Engineered Comfort',
    description:
      'Quiet luxury streetwear with a sharper silhouette, premium essentials, and an engineered comfort finish.',
    url: '/',
    siteName: 'DXLR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DXLR luxury streetwear social preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DXLR | Engineered Comfort',
    description:
      'Quiet luxury streetwear with a sharper silhouette, premium essentials, and an engineered comfort finish.',
    images: ['/opengraph-image'],
  },
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
