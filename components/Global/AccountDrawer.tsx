'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AtSign,
  Clock3,
  ExternalLink,
  LogOut,
  Mail,
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
import { useEffect, useMemo, useState } from 'react';
import { DXLR_WHATSAPP_NUMBER } from '../../lib/checkout';
import { useAccountStore } from '../../store/useAccountStore';

const socialProviders: Array<{
  label: string;
  value: 'google' | 'apple';
  icon: typeof Mail;
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
  const { data: session } = useSession();

  const [availableProviders, setAvailableProviders] = useState<Record<string, unknown>>({});
  const [authMessage, setAuthMessage] = useState('');
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'orders@dxlr.store';

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

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      const availableProviders = await getProviders();

      if (!cancelled) {
        setAvailableProviders(availableProviders ?? {});
      }
    }

    loadProviders();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOAuthSignIn = (provider: 'google' | 'apple') => {
    const providerIsAvailable = Boolean(availableProviders[provider]);
    const providerLabel = provider === 'google' ? 'Google' : 'Apple';

    if (!providerIsAvailable) {
      setAuthMessage(`${providerLabel} sign-in is not configured yet.`);
      return;
    }

    setAuthMessage('');
    void oauthSignIn(provider, { callbackUrl: '/' });
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
                              {order.total} EGP
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
                    const providerIsAvailable = Boolean(availableProviders[provider.value]);

                    return (
                      <button
                        key={provider.value}
                        type="button"
                        onClick={() => handleOAuthSignIn(provider.value)}
                        className={`rounded-[20px] border p-4 text-left transition ${
                          providerIsAvailable
                            ? 'border-black/8 bg-white text-black hover:border-black/14'
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
                          {providerIsAvailable ? 'Ready' : 'Needs Setup'}
                        </p>
                      </button>
                    );
                  })}
                </div>

                  {authMessage ? (
                    <div className="mt-5 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      {authMessage}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                      Direct Contact
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <a
                        href={`https://wa.me/${DXLR_WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[20px] border border-black/8 bg-white p-4 text-left transition hover:border-black/14"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-black">
                          <MessageCircle size={16} />
                        </div>
                        <h4 className="mt-3 text-sm font-bold uppercase tracking-[0.16em]">
                          WhatsApp
                        </h4>
                        <p className="mt-2 text-xs leading-5 text-[var(--foreground-soft)]">
                          Open WhatsApp directly for DXLR support and order help.
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-soft-strong)]">
                          Open App
                          <ExternalLink size={12} />
                        </p>
                      </a>

                      <a
                        href={`mailto:${supportEmail}?subject=${encodeURIComponent('DXLR Account Support')}`}
                        className="rounded-[20px] border border-black/8 bg-white p-4 text-left transition hover:border-black/14"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-black">
                          <Mail size={16} />
                        </div>
                        <h4 className="mt-3 text-sm font-bold uppercase tracking-[0.16em]">
                          Email
                        </h4>
                        <p className="mt-2 text-xs leading-5 text-[var(--foreground-soft)]">
                          Open your mail app and contact DXLR account support directly.
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-soft-strong)]">
                          Open Mail
                          <ExternalLink size={12} />
                        </p>
                      </a>
                    </div>
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
