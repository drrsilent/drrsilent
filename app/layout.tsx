import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '../components/Global/AuthProvider';
import Header from '../components/Global/Header';
import CartDrawer from '../components/Global/CartDrawer';
import AccountDrawer from '../components/Global/AccountDrawer';
import { getSiteUrl } from '../lib/site';

const siteUrl = getSiteUrl();
const siteName = 'DXLR';
const siteDescription =
  'Quiet luxury streetwear with a sharper silhouette, premium essentials, and an engineered comfort finish.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DXLR | Engineered Comfort',
    template: '%s | DXLR',
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'DXLR',
    'DXLR store',
    'streetwear Egypt',
    'luxury streetwear',
    'hoodies Egypt',
    'premium essentials',
  ],
  alternates: {
    canonical: '/',
  },
  category: 'fashion',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: 'DXLR | Engineered Comfort',
    description: siteDescription,
    url: '/',
    siteName,
    type: 'website',
    locale: 'en_US',
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
    description: siteDescription,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteName,
              url: siteUrl,
              logo: `${siteUrl}/opengraph-image`,
              sameAs: ['https://www.instagram.com/x1k3.1/'],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+20 010 285 89747',
                  contactType: 'customer service',
                  areaServed: 'EG',
                  availableLanguage: ['en', 'ar'],
                },
              ],
            }),
          }}
        />
        <AuthProvider>
          <Header />
          <CartDrawer />
          <AccountDrawer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
