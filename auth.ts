import NextAuth from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import {
  isEmailOtpConfigured,
  normalizeEmail,
  verifyEmailOtpChallenge,
} from './lib/email-auth';

const providers: Provider[] = [
  Credentials({
    id: 'email-otp',
    name: 'Email Code',
    credentials: {
      email: {
        label: 'Email',
        type: 'email',
      },
      otp: {
        label: 'OTP',
        type: 'text',
      },
      challengeToken: {
        label: 'Challenge Token',
        type: 'text',
      },
    },
    authorize(credentials) {
      if (!isEmailOtpConfigured()) {
        return null;
      }

      const email = normalizeEmail(String(credentials.email ?? ''));
      const otp = String(credentials.otp ?? '').trim();
      const challengeToken = String(credentials.challengeToken ?? '').trim();

      if (!email || !otp || !challengeToken) {
        return null;
      }

      const verifiedEmail = verifyEmailOtpChallenge({
        email,
        otp,
        challengeToken,
      });

      if (!verifiedEmail) {
        return null;
      }

      return {
        id: verifiedEmail,
        email: verifiedEmail,
        name: 'DXLR Member',
        provider: 'email' as const,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    })
  );
}

export const nextAuthResult = NextAuth({
  secret: process.env.AUTH_SECRET || 'dxlr-dev-secret-change-me',
  session: {
    strategy: 'jwt',
  },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider) {
        token.provider = account.provider === 'credentials' ? 'email' : 'google';
      }

      if (user?.name) {
        token.name = user.name;
      }

      if (user?.email) {
        token.email = user.email;
      }

      if (user?.provider) {
        token.provider = user.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = typeof token.name === 'string' ? token.name : session.user.name;
        session.user.email = typeof token.email === 'string' ? token.email : session.user.email;
        session.user.provider =
          token.provider === 'email' || token.provider === 'google' ? token.provider : undefined;
      }

      return session;
    },
  },
});

export const { auth, handlers } = nextAuthResult;
