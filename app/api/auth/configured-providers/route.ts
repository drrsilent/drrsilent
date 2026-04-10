import { NextResponse } from 'next/server';
import { isEmailOtpConfigured } from '@/lib/email-auth';

export function GET() {
  return NextResponse.json({
    google: false,
    email: isEmailOtpConfigured(),
    apple: false,
  });
}
