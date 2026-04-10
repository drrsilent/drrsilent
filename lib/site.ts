const DEFAULT_SITE_URL = 'https://dxlr-store.vercel.app';

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    DEFAULT_SITE_URL;

  return rawUrl.replace(/\/+$/, '');
}

