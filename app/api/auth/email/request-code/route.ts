import { NextResponse } from 'next/server';
import {
  createEmailOtpChallenge,
  isEmailOtpConfigured,
  isValidEmail,
  maskEmail,
  normalizeEmail,
  sendEmailOtpCode,
} from '@/lib/email-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let email = '';

  try {
    const body = (await request.json()) as { email?: string };
    email = normalizeEmail(body.email ?? '');
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (!isEmailOtpConfigured()) {
    return NextResponse.json({ error: 'email_auth_not_configured' }, { status: 503 });
  }

  try {
    const challenge = createEmailOtpChallenge(email);
    await sendEmailOtpCode(email, challenge.otp);

    return NextResponse.json({
      challengeToken: challenge.challengeToken,
      maskedEmail: maskEmail(email),
      expiresInSeconds: challenge.expiresInSeconds,
    });
  } catch (error) {
    console.error('Failed to send email OTP', error);
    return NextResponse.json({ error: 'failed_to_send_code' }, { status: 500 });
  }
}
