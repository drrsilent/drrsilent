import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      provider?: 'google' | 'email';
    };
  }

  interface User {
    provider?: 'google' | 'email';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: 'google' | 'email';
  }
}
