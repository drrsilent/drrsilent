import { NextResponse } from 'next/server';
import { CheckoutPayload, getCartSubtotal } from '../../../../lib/checkout';

export const runtime = 'nodejs';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}. Add it in your environment settings first.`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;

    if (!body.items?.length) {
      return NextResponse.json({ message: 'Your cart is empty.' }, { status: 400 });
    }

    const secretKey = getRequiredEnv('PAYMOB_SECRET_KEY');
    const publicKey = getRequiredEnv('PAYMOB_PUBLIC_KEY');
    const cardIntegrationId = getRequiredEnv('PAYMOB_CARD_INTEGRATION_ID');
    const applePayIntegrationId =
      process.env.PAYMOB_APPLE_PAY_INTEGRATION_ID || cardIntegrationId;

    const firstName = body.customer.firstName.trim();
    const lastName = body.customer.lastName.trim();
    const phone = body.customer.phone.trim();
    const email = body.customer.email.trim() || 'orders@dxlr.store';

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: 'Missing required customer details.' },
        { status: 400 }
      );
    }

    const paymentMethodId =
      body.paymentMethod === 'apple_pay' ? applePayIntegrationId : cardIntegrationId;
    const orderReference = `DXLR-${Date.now()}`;

    const paymobResponse = await fetch('https://accept.paymob.com/v1/intention/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${secretKey}`,
      },
      body: JSON.stringify({
        amount: Math.round(getCartSubtotal(body.items) * 100),
        currency: 'EGP',
        payment_methods: [Number(paymentMethodId)],
        special_reference: orderReference,
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          apartment: 'NA',
          floor: 'NA',
          street: body.customer.address || 'NA',
          building: 'NA',
          shipping_method: 'DXLR',
          postal_code: '00000',
          city: body.customer.city || 'Cairo',
          country: 'EG',
          state: body.customer.city || 'Cairo',
        },
        items: body.items.map((item) => ({
          name: item.title,
          amount: Math.round(item.price * 100),
          description: `${item.title} / ${item.size}`,
          quantity: item.quantity,
        })),
      }),
    });

    const data = (await paymobResponse.json()) as {
      client_secret?: string;
      detail?: string;
      message?: string;
    };

    if (!paymobResponse.ok || !data.client_secret) {
      return NextResponse.json(
        {
          message:
            data.detail ||
            data.message ||
            'Paymob rejected the payment setup. Check your Paymob keys and integration IDs.',
        },
        { status: 502 }
      );
    }

    const redirectUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(publicKey)}&clientSecret=${encodeURIComponent(data.client_secret)}`;

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to initialize online payment.',
      },
      { status: 500 }
    );
  }
}
