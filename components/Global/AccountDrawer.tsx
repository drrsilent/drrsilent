'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  AtSign,
  Check,
  ChevronDown,
  Clock3,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  User2,
  X,
} from 'lucide-react';
import {
  getProviders,
  signIn as oauthSignIn,
  signOut as authSignOut,
  useSession,
} from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatPrice } from '../../lib/currency';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useAccountStore } from '../../store/useAccountStore';

type ConfiguredProviders = {
  google: boolean;
  apple: boolean;
};

type PhoneCountry = {
  code: string;
  dialCode: string;
  label: string;
  flagUrl: string;
  pattern: RegExp;
  placeholder: string;
  hint: string;
};

const phoneCountries: PhoneCountry[] = [
  {
    code: 'EG',
    dialCode: '+20',
    label: 'Egypt',
    flagUrl: 'https://flagcdn.com/w40/eg.png',
    pattern: /^(10|11|12|15)\d{8}$/,
    placeholder: '10XXXXXXXX',
    hint: 'Use 10 digits starting with 10, 11, 12, or 15.',
  },
  {
    code: 'SA',
    dialCode: '+966',
    label: 'Saudi Arabia',
    flagUrl: 'https://flagcdn.com/w40/sa.png',
    pattern: /^5\d{8}$/,
    placeholder: '5XXXXXXXX',
    hint: 'Use 9 digits starting with 5.',
  },
  {
    code: 'AE',
    dialCode: '+971',
    label: 'UAE',
    flagUrl: 'https://flagcdn.com/w40/ae.png',
    pattern: /^5\d{8}$/,
    placeholder: '5XXXXXXXX',
    hint: 'Use 9 digits starting with 5.',
  },
  {
    code: 'KW',
    dialCode: '+965',
    label: 'Kuwait',
    flagUrl: 'https://flagcdn.com/w40/kw.png',
    pattern: /^[569]\d{7}$/,
    placeholder: 'XXXXXXXX',
    hint: 'Use 8 digits starting with 5, 6, or 9.',
  },
  {
    code: 'QA',
    dialCode: '+974',
    label: 'Qatar',
    flagUrl: 'https://flagcdn.com/w40/qa.png',
    pattern: /^(3|5|6|7)\d{7}$/,
    placeholder: 'XXXXXXXX',
    hint: 'Use 8 digits starting with 3, 5, 6, or 7.',
  },
  {
    code: 'BH',
    dialCode: '+973',
    label: 'Bahrain',
    flagUrl: 'https://flagcdn.com/w40/bh.png',
    pattern: /^(3|6)\d{7}$/,
    placeholder: 'XXXXXXXX',
    hint: 'Use 8 digits starting with 3 or 6.',
  },
  {
    code: 'OM',
    dialCode: '+968',
    label: 'Oman',
    flagUrl: 'https://flagcdn.com/w40/om.png',
    pattern: /^(7|9)\d{7}$/,
    placeholder: 'XXXXXXXX',
    hint: 'Use 8 digits starting with 7 or 9.',
  },
  {
    code: 'JO',
    dialCode: '+962',
    label: 'Jordan',
    flagUrl: 'https://flagcdn.com/w40/jo.png',
    pattern: /^7\d{8}$/,
    placeholder: '7XXXXXXXX',
    hint: 'Use 9 digits starting with 7.',
  },
  {
    code: 'LB',
    dialCode: '+961',
    label: 'Lebanon',
    flagUrl: 'https://flagcdn.com/w40/lb.png',
    pattern: /^(3|7|8|9)\d{6,7}$/,
    placeholder: 'XXXXXXXX',
    hint: 'Use a valid Lebanese mobile number.',
  },
  {
    code: 'MA',
    dialCode: '+212',
    label: 'Morocco',
    flagUrl: 'https://flagcdn.com/w40/ma.png',
    pattern: /^(6|7)\d{8}$/,
    placeholder: '6XXXXXXXX',
    hint: 'Use 9 digits starting with 6 or 7.',
  },
  {
    code: 'TR',
    dialCode: '+90',
    label: 'Turkey',
    flagUrl: 'https://flagcdn.com/w40/tr.png',
    pattern: /^5\d{9}$/,
    placeholder: '5XXXXXXXXX',
    hint: 'Use 10 digits starting with 5.',
  },
  {
    code: 'US',
    dialCode: '+1',
    label: 'United States',
    flagUrl: 'https://flagcdn.com/w40/us.png',
    pattern: /^[2-9]\d{9}$/,
    placeholder: '2015550123',
    hint: 'Use a 10-digit mobile number.',
  },
  {
    code: 'CA',
    dialCode: '+1',
    label: 'Canada',
    flagUrl: 'https://flagcdn.com/w40/ca.png',
    pattern: /^[2-9]\d{9}$/,
    placeholder: '2045550123',
    hint: 'Use a 10-digit mobile number.',
  },
  {
    code: 'GB',
    dialCode: '+44',
    label: 'United Kingdom',
    flagUrl: 'https://flagcdn.com/w40/gb.png',
    pattern: /^7\d{9}$/,
    placeholder: '7XXXXXXXXX',
    hint: 'Use 10 digits starting with 7.',
  },
  {
    code: 'DE',
    dialCode: '+49',
    label: 'Germany',
    flagUrl: 'https://flagcdn.com/w40/de.png',
    pattern: /^1\d{9,11}$/,
    placeholder: '15XXXXXXXX',
    hint: 'Use a valid German mobile number.',
  },
  {
    code: 'FR',
    dialCode: '+33',
    label: 'France',
    flagUrl: 'https://flagcdn.com/w40/fr.png',
    pattern: /^(6|7)\d{8}$/,
    placeholder: '6XXXXXXXX',
    hint: 'Use 9 digits starting with 6 or 7.',
  },
  {
    code: 'IT',
    dialCode: '+39',
    label: 'Italy',
    flagUrl: 'https://flagcdn.com/w40/it.png',
    pattern: /^3\d{8,10}$/,
    placeholder: '3XXXXXXXXX',
    hint: 'Use a valid Italian mobile number.',
  },
  {
    code: 'ES',
    dialCode: '+34',
    label: 'Spain',
    flagUrl: 'https://flagcdn.com/w40/es.png',
    pattern: /^(6|7)\d{8}$/,
    placeholder: '6XXXXXXXX',
    hint: 'Use 9 digits starting with 6 or 7.',
  },
  {
    code: 'AU',
    dialCode: '+61',
    label: 'Australia',
    flagUrl: 'https://flagcdn.com/w40/au.png',
    pattern: /^4\d{8}$/,
    placeholder: '4XXXXXXXX',
    hint: 'Use 9 digits starting with 4.',
  },
  {
    code: 'IN',
    dialCode: '+91',
    label: 'India',
    flagUrl: 'https://flagcdn.com/w40/in.png',
    pattern: /^[6-9]\d{9}$/,
    placeholder: '9XXXXXXXXX',
    hint: 'Use 10 digits starting with 6, 7, 8, or 9.',
  },
];

const socialProviders: Array<{
  label: string;
  value: 'google' | 'apple';
  icon: typeof AtSign;
  helper: string;
}> = [
  {
    label: 'Google',
    value: 'google',
    icon: AtSign,
    helper: 'Real Google sign-in that returns to DXLR automatically.',
  },
  {
    label: 'Apple',
    value: 'apple',
    icon: Smartphone,
    helper: 'Secure Apple sign-in for live HTTPS deployments.',
  },
];

export default function AccountDrawer() {
  const isOpen = useAccountStore((state) => state.isOpen);
  const user = useAccountStore((state) => state.user);
  const orders = useAccountStore((state) => state.orders);
  const closeAccount = useAccountStore((state) => state.closeAccount);
  const clearManualSignIn = useAccountStore((state) => state.signOut);
  const manualSignIn = useAccountStore((state) => state.signIn);
  const locale = useLocaleStore((state) => state.locale);
  const { data: session } = useSession();

  const [availableProviders, setAvailableProviders] = useState<Record<string, unknown>>({});
  const [configuredProviders, setConfiguredProviders] = useState<ConfiguredProviders>({
    google: false,
    apple: false,
  });
  const [authMessage, setAuthMessage] = useState('');
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [manualMode, setManualMode] = useState<'phone' | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualCountryCode, setManualCountryCode] = useState('EG');
  const [manualPhone, setManualPhone] = useState('');
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const countryMenuRef = useRef<HTMLDivElement | null>(null);
  const manualFormRef = useRef<HTMLDivElement | null>(null);
  const manualNameInputRef = useRef<HTMLInputElement | null>(null);

  const activeUser = session?.user
    ? {
        name: session.user.name || 'DXLR Member',
        email: session.user.email || '',
        phone: '',
      }
    : user;
  const signedInProviderLabel = useMemo(
    () =>
      session?.user
        ? 'Social account'
        : user?.provider
          ? `${user.provider} account`
          : 'DXLR',
    [session, user]
  );
  const selectedCountry =
    phoneCountries.find((country) => country.code === manualCountryCode) ?? phoneCountries[0];

  useEffect(() => {
    let cancelled = false;

    async function loadProviderState() {
      try {
        const configuredProvidersResponse = await Promise.race([
          fetch('/api/auth/configured-providers', {
            cache: 'no-store',
          }),
          new Promise<null>((resolve) => {
            window.setTimeout(() => resolve(null), 4000);
          }),
        ]);

        if (
          configuredProvidersResponse &&
          'ok' in configuredProvidersResponse &&
          configuredProvidersResponse.ok
        ) {
          const data = (await configuredProvidersResponse.json()) as ConfiguredProviders;

          if (!cancelled) {
            setConfiguredProviders(data);
          }
        }

        const availableProviders = await Promise.race([
          getProviders(),
          new Promise<null>((resolve) => {
            window.setTimeout(() => resolve(null), 4000);
          }),
        ]);

        if (!cancelled) {
          setAvailableProviders(availableProviders ?? {});
          setProvidersLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setAvailableProviders({});
          setProvidersLoaded(true);
        }
      }
    }

    void loadProviderState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isCountryMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!countryMenuRef.current?.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [isCountryMenuOpen]);

  useEffect(() => {
    if (manualMode !== 'phone') return;

    const scrollTimeout = window.setTimeout(() => {
      manualFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      manualNameInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(scrollTimeout);
  }, [manualMode]);

  const handleOAuthSignIn = (provider: 'google' | 'apple') => {
    const providerIsConfigured = configuredProviders[provider];
    const providerIsAvailable =
      providerIsConfigured && (Boolean(availableProviders[provider]) || !providersLoaded);
    const providerLabel = provider === 'google' ? 'Google' : 'Apple';

    if (!providerIsConfigured) {
      setAuthMessage(`${providerLabel} sign-in is not configured yet.`);
      return;
    }

    if (!providerIsAvailable) {
      setAuthMessage(`${providerLabel} sign-in is temporarily unavailable. Please try again.`);
      return;
    }

    setAuthMessage('');
    void oauthSignIn(provider, { callbackUrl: '/' });
  };

  const resetManualFields = () => {
    setManualMode(null);
    setManualName('');
    setManualCountryCode('EG');
    setManualPhone('');
    setIsCountryMenuOpen(false);
  };

  const handleManualSignIn = () => {
    const trimmedName = manualName.trim();
    const normalizedPhone = manualPhone.replace(/\D/g, '');
    if (!trimmedName) {
      setAuthMessage('Add your name first.');
      return;
    }

    if (!normalizedPhone) {
      setAuthMessage('Add your phone number to continue.');
      return;
    }

    if (!selectedCountry.pattern.test(normalizedPhone)) {
      setAuthMessage(`This phone number does not match ${selectedCountry.label}. ${selectedCountry.hint}`);
      return;
    }

    manualSignIn({
      name: trimmedName,
      email: '',
      phone: `${selectedCountry.dialCode}${normalizedPhone}`,
      provider: 'whatsapp',
    });
    setAuthMessage('');
    resetManualFields();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[145]">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeAccount}
            aria-label="Close account drawer"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-[440px] flex-col overflow-hidden border-l border-black/8 bg-[#fbfaf7] px-4 pb-4 pt-4 shadow-[0_30px_120px_rgba(0,0,0,0.22)] md:px-6 md:pb-6"
          >
            <div className="mb-5 flex shrink-0 items-center justify-between border-b border-black/8 pb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                  Account Hub
                </p>
                <h2 className="mt-2 text-xl font-semibold uppercase tracking-[0.08em] text-black">
                  Your Account
                </h2>
              </div>

              <button
                type="button"
                onClick={closeAccount}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:rotate-90 hover:bg-black hover:text-white"
                aria-label="Close account drawer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {activeUser ? (
                <>
                <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(145deg,#111111_0%,#1d1a16_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/58">
                    Signed In
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                      <User2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                        {activeUser.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/68">
                        {signedInProviderLabel} account
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-white/72">
                    <p>{activeUser.email || 'No email added yet'}</p>
                    <p>{activeUser.phone || 'No phone added yet'}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                      Purchase History
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-black">
                      {orders.length} orders
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (session?.user) {
                        void authSignOut({ callbackUrl: '/' });
                      }
                      clearManualSignIn();
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-black transition hover:bg-black hover:text-white"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>

                <div className="mt-4 space-y-3 pb-2">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                              Order #{order.id.slice(-6)}
                            </p>
                            <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-black">
                              {formatPrice(order.total, locale)}
                            </h4>
                          </div>

                          <span
                            className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                              order.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {order.status === 'confirmed' ? 'Confirmed' : 'Awaiting Payment'}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-[var(--foreground-soft)]">
                          <p className="inline-flex items-center gap-2">
                            <Clock3 size={14} />
                            {new Date(order.createdAt).toLocaleString('en-GB')}
                          </p>
                          <p className="inline-flex items-center gap-2">
                            <ShieldCheck size={14} />
                            {order.paymentMethod.replaceAll('_', ' ')}
                          </p>
                          <p>{order.itemCount} items</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-6 py-12 text-center">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                        No Orders Yet
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-600">
                        Once a checkout is placed, your DXLR purchase history will appear here.
                      </p>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(145deg,#111111_0%,#1d1a16_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/58">
                    DXLR Access
                  </p>
                  <h3 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.05em]">
                    Sign in and keep your orders close.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    Choose the sign-in style you want, then save your DXLR profile for checkout and order history.
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                    Social Sign In
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {socialProviders.map((provider) => {
                    const Icon = provider.icon;
                    const providerIsConfigured = configuredProviders[provider.value];
                    const providerIsAvailable =
                      providerIsConfigured &&
                      (Boolean(availableProviders[provider.value]) || !providersLoaded);
                    const providerStatus = !providersLoaded
                      ? 'Checking'
                      : providerIsAvailable
                        ? 'Continue'
                        : providerIsConfigured
                          ? 'Retry'
                          : 'Needs Setup';

                    return (
                      <button
                        key={provider.value}
                        type="button"
                        onClick={() => handleOAuthSignIn(provider.value)}
                        className={`rounded-[20px] border p-4 text-left transition ${
                          providerIsAvailable
                            ? 'border-black/8 bg-white text-black hover:border-black/14'
                            : providerIsConfigured
                              ? 'border-amber-200 bg-amber-50 text-black'
                              : 'border-black/8 bg-[#f7f4ee] text-black/75'
                        }`}
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-black"
                        >
                          <Icon size={16} />
                        </div>
                        <h4 className="mt-3 text-sm font-bold uppercase tracking-[0.16em]">
                          {provider.label}
                        </h4>
                        <p
                          className="mt-2 text-xs leading-5 text-[var(--foreground-soft)]"
                        >
                          {provider.helper}
                        </p>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-soft-strong)]">
                          {providerStatus}
                        </p>
                      </button>
                    );
                  })}
                </div>

                  <div className="mt-6">
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                      Direct Contact
                    </p>

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMessage('');
                          setManualMode((current) => (current === 'phone' ? null : 'phone'));
                        }}
                        className="w-full rounded-[20px] border border-black/8 bg-white p-4 text-left transition hover:border-black/14"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-black">
                          <MessageCircle size={16} />
                        </div>
                        <h4 className="mt-3 text-sm font-bold uppercase tracking-[0.16em]">
                          Phone
                        </h4>
                        <p className="mt-2 text-xs leading-5 text-[var(--foreground-soft)]">
                          Create your account with your phone number inside DXLR.
                        </p>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-soft-strong)]">
                          {manualMode === 'phone' ? 'Close Form' : 'Continue'}
                        </p>
                      </button>
                    </div>

                    {manualMode ? (
                      <div
                        ref={manualFormRef}
                        className="mt-4 rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
                      >
                        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                          Phone Sign In
                        </p>
                        <div className="mt-4 grid gap-3">
                          <input
                            ref={manualNameInputRef}
                            type="text"
                            value={manualName}
                            onChange={(event) => setManualName(event.target.value)}
                            placeholder="Your name"
                            className="h-12 rounded-[16px] border border-black/10 bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
                          />
                          <div className="grid gap-3">
                            <div ref={countryMenuRef} className="relative">
                              <button
                                type="button"
                                onClick={() => setIsCountryMenuOpen((current) => !current)}
                                className="flex h-13 w-full items-center gap-3 rounded-[16px] border border-black/10 bg-[var(--surface)] px-4 text-left text-sm text-black transition hover:border-black/20"
                              >
                                <Image
                                  src={selectedCountry.flagUrl}
                                  alt={`${selectedCountry.label} flag`}
                                  width={28}
                                  height={20}
                                  className="h-5 w-7 rounded-[4px] object-cover shadow-sm"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-black">
                                    {selectedCountry.label}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {selectedCountry.dialCode}
                                  </p>
                                </div>
                                <ChevronDown
                                  size={18}
                                  className={`shrink-0 text-zinc-500 transition ${isCountryMenuOpen ? 'rotate-180' : ''}`}
                                />
                              </button>

                              {isCountryMenuOpen ? (
                                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-72 overflow-y-auto rounded-[18px] border border-black/10 bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
                                  {phoneCountries.map((country) => {
                                    const isSelected = country.code === manualCountryCode;

                                    return (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setManualCountryCode(country.code);
                                          setIsCountryMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition ${
                                          isSelected ? 'bg-black text-white' : 'hover:bg-[var(--surface)]'
                                        }`}
                                      >
                                        <Image
                                          src={country.flagUrl}
                                          alt={`${country.label} flag`}
                                          width={28}
                                          height={20}
                                          className="h-5 w-7 rounded-[4px] object-cover shadow-sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                          <p className="truncate text-sm font-medium">
                                            {country.label}
                                          </p>
                                          <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-zinc-500'}`}>
                                            {country.dialCode}
                                          </p>
                                        </div>
                                        {isSelected ? <Check size={16} className="shrink-0" /> : null}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : null}
                            </div>
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={manualPhone}
                              onChange={(event) =>
                                setManualPhone(event.target.value.replace(/[^\d\s()-]/g, ''))
                              }
                              placeholder={selectedCountry.placeholder}
                              className="h-12 rounded-[16px] border border-black/10 bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
                            />
                          </div>
                          <p className="text-xs leading-5 text-zinc-500">
                            {selectedCountry.hint}
                          </p>
                          <button
                            type="button"
                            onClick={handleManualSignIn}
                            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800"
                          >
                            Save Account
                          </button>
                          {authMessage ? (
                            <div className="rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                              {authMessage}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
