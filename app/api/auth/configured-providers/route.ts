import { NextResponse } from 'next/server';
import { isEmailOtpConfigured } from '@/lib/email-auth';

export function GET() {
  return NextResponse.json({
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    email: isEmailOtpConfigured(),
    apple: false,
  });
}
