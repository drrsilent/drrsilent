'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Banknote, CreditCard, LocateFixed, ShoppingBag, Smartphone } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { buildWhatsappOrderUrl, getCartItemCount, getCartSubtotal } from '../../lib/checkout';
import { getLocalizedProduct, products } from '../../data/products';
import { PaymentMethod, useCartStore } from '../../store/useCartStore';
import { useAccountStore } from '../../store/useAccountStore';
import { useLocaleStore } from '../../store/useLocaleStore';

const paymentMethods: Array<{
  label: string;
  value: PaymentMethod;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    label: 'Card',
    value: 'card',
    description: 'Pay online through Paymob checkout.',
    icon: CreditCard,
  },
  {
    label: 'Cash on Delivery',
    value: 'cash_on_delivery',
    description: 'Confirm the order now and collect cash on delivery.',
    icon: Banknote,
  },
  {
    label: 'Apple Pay',
    value: 'apple_pay',
    description: 'Use the Apple Pay flow available in Paymob.',
    icon: Smartphone,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const clearCart = useCartStore((state) => state.clearCart);
  const accountUser = useAccountStore((state) => state.user);
  const addOrder = useAccountStore((state) => state.addOrder);
  const locale = useLocaleStore((state) => state.locale);

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    city: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentConfig, setPaymentConfig] = useState({
    paymobConfigured: false,
    applePayConfigured: false,
    loaded: false,
  });

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const itemCount = useMemo(() => getCartItemCount(items), [items]);
  const localizedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        title: products[item.id] ? getLocalizedProduct(item.id, locale).title : item.title,
      })),
    [items, locale]
  );

  useEffect(() => {
    if (!accountUser) {
      return;
    }

    setCustomer((current) => ({
      ...current,
      firstName: current.firstName || accountUser.name.split(' ')[0] || '',
      lastName:
        current.lastName || accountUser.name.split(' ').slice(1).join(' ') || '',
      email: current.email || accountUser.email || '',
      phone: current.phone || accountUser.phone || '',
    }));
  }, [accountUser]);

  useEffect(() => {
    let cancelled = false;

    async function loadPaymentConfig() {
      try {
        const response = await fetch('/api/checkout/configured-providers', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unable to load payment settings.');
        }

        const data = (await response.json()) as {
          paymobConfigured: boolean;
          applePayConfigured: boolean;
        };

        if (!cancelled) {
          setPaymentConfig({
            ...data,
            loaded: true,
          });
        }
      } catch {
        if (!cancelled) {
          setPaymentConfig({
            paymobConfigured: false,
            applePayConfigured: false,
            loaded: true,
          });
          setPaymentMethod('cash_on_delivery');
        }
      }
    }

    void loadPaymentConfig();
    return () => {
      cancelled = true;
    };
  }, [setPaymentMethod]);

  useEffect(() => {
    if (!paymentConfig.loaded) return;

    if (
      (paymentMethod === 'card' && !paymentConfig.paymobConfigured) ||
      (paymentMethod === 'apple_pay' && !paymentConfig.applePayConfigured)
    ) {
      setPaymentMethod('cash_on_delivery');
    }
  }, [paymentConfig, paymentMethod, setPaymentMethod]);

  const updateField = (field: keyof typeof customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCheckoutError('Location is not supported on this device.');
      return;
    }

    setCheckoutError('');
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

        setCustomer((current) => ({
          ...current,
          location: mapsUrl,
        }));
        setIsLocating(false);
      },
      () => {
        setCheckoutError('Unable to get your location. Please allow location access and try again.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const isFormValid =
    customer.firstName.trim() &&
    customer.lastName.trim() &&
    customer.phone.trim() &&
    customer.location.trim() &&
    customer.address.trim() &&
    customer.city.trim();
  const visiblePaymentMethods = paymentMethods.filter((method) => {
    if (method.value === 'card') return paymentConfig.paymobConfigured;
    if (method.value === 'apple_pay') return paymentConfig.applePayConfigured;
    return true;
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length || !isFormValid) {
      setCheckoutError('Complete your shipping details first.');
      return;
    }

    setCheckoutError('');
    setIsSubmitting(true);

    if (paymentMethod === 'cash_on_delivery') {
      addOrder({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        total: subtotal,
        itemCount,
        paymentMethod,
        status: 'confirmed',
        items: localizedItems,
      });

      const url = buildWhatsappOrderUrl({
        customer,
        items: localizedItems,
        paymentMethod,
      });

      clearCart();
      window.open(url, '_blank', 'noopener,noreferrer');
      router.push('/');
      setIsSubmitting(false);
      return;
    }

    try {
      const abortController = new AbortController();
      const timeoutId = window.setTimeout(() => abortController.abort(), 15000);

      addOrder({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        total: subtotal,
        itemCount,
        paymentMethod,
        status: 'awaiting_payment',
        items: localizedItems,
      });

      const response = await fetch('/api/checkout/paymob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          customer,
          items: localizedItems,
          paymentMethod,
        }),
      }).finally(() => window.clearTimeout(timeoutId));

      const data = (await response.json()) as {
        redirectUrl?: string;
        message?: string;
      };

      if (!response.ok || !data.redirectUrl) {
        throw new Error(data.message || 'Unable to start payment right now.');
      }

      window.location.href = data.redirectUrl;
    } catch (error) {
      setCheckoutError(
        error instanceof Error && error.name === 'AbortError'
          ? 'Payment setup took too long. Please try again.'
          : error instanceof Error
            ? error.message
            : 'Unable to start payment right now.'
      );
      setIsSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[var(--surface)] px-4 pb-20 pt-28 text-black md:px-6 md:pt-32">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-[var(--line)] bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Your cart is empty.</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
            Add a few DXLR pieces first, then come back here to complete the order.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition hover:bg-zinc-800"
          >
            Browse Shop
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 pb-20 pt-28 text-black md:px-6 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-soft)] transition hover:text-black"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </Link>

          <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--foreground-soft)]">
            Secure Checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
            Complete your order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--foreground-soft)]">
            Fill in the shipping details once, then choose whether the customer pays online through Paymob or confirms with cash on delivery.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              value={customer.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
              placeholder="First name"
              className="h-14 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
            />
            <input
              value={customer.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
              placeholder="Last name"
              className="h-14 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
            />
            <input
              value={customer.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="Email"
              type="email"
              className="h-14 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
            />
            <input
              value={customer.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="Phone number"
              className="h-14 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
            />
            <input
              value={customer.city}
              onChange={(event) => updateField('city', event.target.value)}
              placeholder="City"
              className="h-14 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
            />
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <input
                value={customer.location}
                onChange={(event) => updateField('location', event.target.value)}
                placeholder="Google Maps location"
                className="h-14 flex-1 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[20px] border border-black bg-black px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed size={16} />
                {isLocating ? 'Locating...' : 'Use my location'}
              </button>
            </div>
            <input
              value={customer.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="Address"
              className="h-14 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
            />
            <textarea
              value={customer.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Delivery notes"
              className="min-h-32 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm outline-none transition focus:border-black md:col-span-2"
            />
          </div>

          <div className="mt-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--foreground-soft)]">
              Payment Method
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {visiblePaymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.value;

                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-[0_18px_44px_rgba(0,0,0,0.14)]'
                        : 'border-[var(--line)] bg-[var(--surface)] text-black hover:border-black/18 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        isSelected ? 'bg-white text-black' : 'bg-white text-black'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <h2 className="mt-4 text-sm font-bold uppercase tracking-[0.12em]">
                      {method.label}
                    </h2>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        isSelected ? 'text-white/72' : 'text-[var(--foreground-soft)]'
                      }`}
                    >
                      {method.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {paymentConfig.loaded && !paymentConfig.paymobConfigured ? (
            <div className="mt-5 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Online payment is temporarily unavailable. Cash on Delivery is active right now.
            </div>
          ) : null}

          {checkoutError ? (
            <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {checkoutError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-5 text-[10px] font-bold uppercase tracking-[0.28em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : paymentMethod === 'cash_on_delivery'
                ? 'Confirm COD Order'
                : 'Continue to Paymob'}
            <ArrowRight size={14} />
          </button>
        </form>

        <aside className="rounded-[30px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--foreground-soft)]">
                Order Summary
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                {itemCount} items
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {localizedItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-black">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">
                      Size {item.size} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {item.price * item.quantity} EGP
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] bg-black px-5 py-5 text-white">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">
              Subtotal
            </p>
            <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
              {subtotal} EGP
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Cash on Delivery now creates a real order message to your WhatsApp. Online payments are routed to Paymob once account keys are added.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
