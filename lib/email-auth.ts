import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const OTP_EXPIRY_SECONDS = 10 * 60;
const OTP_LENGTH = 6;

type EmailServerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

type EmailOtpChallengePayload = {
  email: string;
  salt: string;
  otpHash: string;
  exp: number;
  v: 1;
};

function getEnvValue(...keys: string[]) {
  return keys.find((key) => process.env[key]?.trim()) ? process.env[keys.find((key) => process.env[key]?.trim())!]!.trim() : '';
}

function getEmailServerConfig(): EmailServerConfig | null {
  const host = getEnvValue('EMAIL_SERVER_HOST', 'AUTH_EMAIL_SERVER_HOST', 'SMTP_HOST');
  const portValue = getEnvValue('EMAIL_SERVER_PORT', 'AUTH_EMAIL_SERVER_PORT', 'SMTP_PORT');
  const user = getEnvValue('EMAIL_SERVER_USER', 'AUTH_EMAIL_SERVER_USER', 'SMTP_USER');
  const password = getEnvValue(
    'EMAIL_SERVER_PASSWORD',
    'AUTH_EMAIL_SERVER_PASSWORD',
    'EMAIL_SERVER_PASS',
    'SMTP_PASS',
    'SMTP_PASSWORD'
  );
  const from = getEnvValue('EMAIL_FROM', 'AUTH_EMAIL_FROM', 'SMTP_FROM');

  if (!host || !portValue || !user || !password || !from) {
    return null;
  }

  const port = Number(portValue);
  if (!Number.isFinite(port)) {
    return null;
  }

  const secureValue = getEnvValue('EMAIL_SERVER_SECURE', 'AUTH_EMAIL_SERVER_SECURE', 'SMTP_SECURE');

  return {
    host,
    port,
    secure: secureValue ? secureValue.toLowerCase() === 'true' : port === 465,
    user,
    password,
    from,
  };
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || 'dxlr-dev-secret-change-me';
}

function createOtpHash(email: string, otp: string, salt: string) {
  return crypto
    .createHash('sha256')
    .update(`${email}:${otp}:${salt}:${getAuthSecret()}`)
    .digest('hex');
}

function signPayload(payloadBase64: string) {
  return crypto.createHmac('sha256', getAuthSecret()).update(payloadBase64).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function maskEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const [localPart, domain] = normalizedEmail.split('@');

  if (!localPart || !domain) {
    return normalizedEmail;
  }

  const maskedLocal =
    localPart.length <= 2
      ? `${localPart.slice(0, 1)}${'*'.repeat(Math.max(localPart.length - 1, 1))}`
      : `${localPart.slice(0, 2)}${'*'.repeat(Math.max(localPart.length - 2, 2))}`;

  const [domainName, domainSuffix] = domain.split('.');
  const maskedDomainName = domainName
    ? `${domainName.slice(0, 1)}${'*'.repeat(Math.max(domainName.length - 1, 1))}`
    : domain;

  return `${maskedLocal}@${maskedDomainName}${domainSuffix ? `.${domainSuffix}` : ''}`;
}

export function isEmailOtpConfigured() {
  return Boolean(getEmailServerConfig());
}

export function createEmailOtpChallenge(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const otp = crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
  const salt = crypto.randomBytes(16).toString('base64url');
  const exp = Date.now() + OTP_EXPIRY_SECONDS * 1000;
  const payload: EmailOtpChallengePayload = {
    email: normalizedEmail,
    salt,
    otpHash: createOtpHash(normalizedEmail, otp, salt),
    exp,
    v: 1,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(payloadBase64);

  return {
    otp,
    challengeToken: `${payloadBase64}.${signature}`,
    expiresInSeconds: OTP_EXPIRY_SECONDS,
  };
}

export function verifyEmailOtpChallenge({
  email,
  otp,
  challengeToken,
}: {
  email: string;
  otp: string;
  challengeToken: string;
}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedOtp = otp.trim();

  if (!normalizedEmail || !normalizedOtp || !challengeToken.includes('.')) {
    return null;
  }

  const [payloadBase64, signature] = challengeToken.split('.');
  const expectedSignature = signPayload(payloadBase64);

  if (!signature || !safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf8')
    ) as EmailOtpChallengePayload;

    if (payload.v !== 1 || payload.exp < Date.now()) {
      return null;
    }

    if (!safeEqual(payload.email, normalizedEmail)) {
      return null;
    }

    const expectedOtpHash = createOtpHash(normalizedEmail, normalizedOtp, payload.salt);

    if (!safeEqual(payload.otpHash, expectedOtpHash)) {
      return null;
    }

    return normalizedEmail;
  } catch {
    return null;
  }
}

export async function sendEmailOtpCode(email: string, otp: string) {
  const config = getEmailServerConfig();

  if (!config) {
    throw new Error('Email OTP is not configured.');
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  const subject = 'Your DXLR verification code';
  const text = `Your DXLR verification code is ${otp}. This code expires in 10 minutes.`;
  const html = `
    <div style="background:#0f0f0f;padding:32px;font-family:Arial,sans-serif;color:#f7f3ec;">
      <div style="max-width:520px;margin:0 auto;background:#171512;border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:32px;">
        <p style="margin:0 0 12px;color:#bba27a;letter-spacing:0.28em;font-size:11px;text-transform:uppercase;">DXLR Access</p>
        <h1 style="margin:0 0 16px;font-size:32px;line-height:1.1;">Your verification code</h1>
        <p style="margin:0 0 24px;color:rgba(255,255,255,0.72);font-size:15px;line-height:1.8;">
          Use the code below to complete your DXLR sign in. The code expires in 10 minutes.
        </p>
        <div style="margin:0 0 24px;padding:18px 22px;border-radius:22px;background:#fbfaf7;color:#111;text-align:center;font-size:32px;font-weight:700;letter-spacing:0.34em;">
          ${otp}
        </div>
        <p style="margin:0;color:rgba(255,255,255,0.62);font-size:13px;line-height:1.7;">
          If you did not request this code, you can safely ignore this message.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: config.from,
    to: normalizeEmail(email),
    subject,
    text,
    html,
  });
}
