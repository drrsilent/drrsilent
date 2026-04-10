import { NextResponse } from 'next/server';

export function GET() {
  const paymobConfigured = Boolean(
    process.env.PAYMOB_SECRET_KEY &&
      process.env.PAYMOB_PUBLIC_KEY &&
      process.env.PAYMOB_CARD_INTEGRATION_ID
  );

  return NextResponse.json({
    paymobConfigured,
    applePayConfigured: Boolean(
      paymobConfigured && process.env.PAYMOB_APPLE_PAY_INTEGRATION_ID
    ),
  });
}
