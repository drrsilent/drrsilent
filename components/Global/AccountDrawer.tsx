'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AtSign,
  Clock3,
  LogOut,
  Mail,
  PencilLine,
  ShieldCheck,
  User2,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  getProviders,
  signIn as authSignIn,
  signOut as authSignOut,
  useSession,
} from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../lib/currency';
import { getDictionary } from '../../lib/translations';
import { getLocalizedProduct, products } from '../../data/products';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useAccountStore } from '../../store/useAccountStore';
import { useCartStore } from '../../store/useCartStore';

type ConfiguredProviders = {
  google: boolean;
  email: boolean;
  apple?: boolean;
};

type ProviderCard = {
  label: string;
  value: 'google' | 'email';
  icon: LucideIcon;
  helper: string;
};

type AuthNotice = {
  tone: 'error' | 'success';
  message: string;
} | null;

export default function AccountDrawer() {
  const router = useRouter();
  const isOpen = useAccountStore((state) => state.isOpen);
  const user = useAccountStore((state) => state.user);
  const orders = useAccountStore((state) => state.orders);
  const closeAccount = useAccountStore((state) => state.closeAccount);
  const clearManualSignIn = useAccountStore((state) => state.signOut);
  const removeOrder = useAccountStore((state) => state.removeOrder);
  const locale = useLocaleStore((state) => state.locale);
  const dict = getDictionary(locale).common;
  const isArabic = locale === 'ar';
  const setCartState = useCartStore((state) => state.setCartState);
  const { data: session } = useSession();
  const copy = isArabic
    ? {
        accountHub: 'بوابة الحساب',
        yourAccount: 'حسابك',
        closeAccount: 'إغلاق الحساب',
        signedIn: 'تم تسجيل الدخول',
        memberName: 'عضو DXLR',
        googleName: 'Google',
        emailName: 'الإيميل',
        phoneName: 'الهاتف',
        dxlrName: 'DXLR',
        accountLabel: (provider: string) => `حساب ${provider}`,
        noEmail: 'لا يوجد إيميل مضاف بعد',
        purchaseHistory: 'سجل الطلبات',
        ordersCount: (count: number) => `${count} طلبات`,
        signOut: 'تسجيل الخروج',
        order: 'طلب',
        confirmed: 'مؤكد',
        awaitingPayment: 'بانتظار الدفع',
        itemsCount: (count: number) => `${count} قطعة`,
        noOrdersYet: 'لا توجد طلبات بعد',
        noOrdersHint: 'بمجرد إتمام أي عملية شراء، سيظهر سجل طلبات DXLR هنا.',
        editOrder: 'تعديل الطلب',
        accessLabel: 'دخول DXLR',
        signInHeadline: 'سجّل دخولك وابقَ قريبًا من طلباتك.',
        signInHint:
          'استخدم Google أو كود تحقق يصل إلى إيميلك، ثم احتفظ بحساب DXLR للـ checkout وسجل الطلبات.',
        signInOptions: 'خيارات تسجيل الدخول',
        googleHelper: 'سجّل عبر Google وارجع إلى DXLR تلقائيًا.',
        emailHelper: 'اكتب إيميلك، استقبل كود تحقق، ثم ادخل الموقع من داخل DXLR.',
        checking: 'جارٍ الفحص',
        continue: 'متابعة',
        retry: 'أعد المحاولة',
        needsSetup: 'يحتاج إعداد',
        closeForm: 'إغلاق النموذج',
        emailSignIn: 'الدخول بالإيميل',
        emailPlaceholder: 'name@gmail.com',
        sendCode: 'إرسال الكود',
        resendCode: 'إعادة إرسال الكود',
        otpPlaceholder: 'كود من 6 أرقام',
        otpHint: 'سنرسل كود تحقق لمرة واحدة إلى إيميلك.',
        verifyCode: 'تأكيد الكود',
        sentCode: (email: string) => `أرسلنا كود التحقق إلى ${email}.`,
        signedInSuccess: 'تم تسجيل الدخول بنجاح.',
        invalidEmail: 'أدخل إيميلًا صحيحًا أولًا.',
        invalidOtp: 'أدخل كود التحقق المكوّن من 6 أرقام.',
        requestCodeFirst: 'أرسل كود التحقق أولًا.',
        failedToSendCode: 'تعذّر إرسال الكود الآن. جرّب مرة أخرى.',
        emailSetupMissing: 'تسجيل الدخول بالإيميل غير مفعّل بعد.',
        googleSetupMissing: 'تسجيل Google غير مفعّل بعد.',
        googleUnavailable: 'تسجيل Google غير متاح مؤقتًا. جرّب مرة أخرى.',
        invalidCode: 'الكود غير صحيح أو انتهت صلاحيته. اطلب كودًا جديدًا وحاول مرة أخرى.',
        verificationHint: (email: string) => `أدخل الكود الذي وصلك على ${email}.`,
        sizeQtySummary: (size: string, quantity: number) => `المقاس ${size} - الكمية ${quantity}`,
      }
    : {
        accountHub: 'Account Hub',
        yourAccount: 'Your Account',
        closeAccount: 'Close account drawer',
        signedIn: 'Signed In',
        memberName: 'DXLR Member',
        googleName: 'Google',
        emailName: 'Email',
        phoneName: 'Phone',
        dxlrName: 'DXLR',
        accountLabel: (provider: string) => `${provider} account`,
        noEmail: 'No email added yet',
        purchaseHistory: 'Purchase History',
        ordersCount: (count: number) => `${count} orders`,
        signOut: 'Sign Out',
        order: 'Order',
        confirmed: 'Confirmed',
        awaitingPayment: 'Awaiting Payment',
        itemsCount: (count: number) => `${count} items`,
        noOrdersYet: 'No Orders Yet',
        noOrdersHint: 'Once a checkout is placed, your DXLR purchase history will appear here.',
        editOrder: 'Edit Order',
        accessLabel: 'DXLR Access',
        signInHeadline: 'Sign in and keep your orders close.',
        signInHint:
          'Use Google or a one-time email code, then keep your DXLR profile for checkout and order history.',
        signInOptions: 'Sign In Options',
        googleHelper: 'Continue with Google and return to DXLR automatically.',
        emailHelper: 'Enter your email, receive a verification code, then sign in inside DXLR.',
        checking: 'Checking',
        continue: 'Continue',
        retry: 'Retry',
        needsSetup: 'Needs Setup',
        closeForm: 'Close Form',
        emailSignIn: 'Email Sign In',
        emailPlaceholder: 'your@email.com',
        sendCode: 'Send Code',
        resendCode: 'Resend Code',
        otpPlaceholder: '6-digit code',
        otpHint: 'We will send a one-time 6-digit code to your inbox.',
        verifyCode: 'Verify Code',
        sentCode: (email: string) => `We sent a verification code to ${email}.`,
        signedInSuccess: 'Signed in successfully.',
        invalidEmail: 'Add a valid email address first.',
        invalidOtp: 'Enter the 6-digit verification code.',
        requestCodeFirst: 'Request a verification code first.',
        failedToSendCode: 'We could not send the code right now. Please try again.',
        emailSetupMissing: 'Email verification is not configured yet.',
        googleSetupMissing: 'Google sign-in is not configured yet.',
        googleUnavailable: 'Google sign-in is temporarily unavailable. Please try again.',
        invalidCode: 'That code is incorrect or expired. Request a new one and try again.',
        verificationHint: (email: string) => `Enter the code we sent to ${email}.`,
        sizeQtySummary: (size: string, quantity: number) => `Size ${size} - Qty ${quantity}`,
      };
  const labelClassName = isArabic
    ? 'text-[12px] tracking-[0.04em]'
    : 'text-[10px] font-mono uppercase tracking-[0.3em]';
  const sectionCountClassName = isArabic
    ? 'text-[14px] tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.22em]';
  const badgeClassName = isArabic
    ? 'text-[11px] tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.18em]';
  const actionButtonClassName = isArabic
    ? 'text-[13px] tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.18em]';
  const providerCardTitleClassName = isArabic
    ? 'text-[15px] tracking-normal'
    : 'text-sm font-bold uppercase tracking-[0.16em]';
  const providerCards: ProviderCard[] = [
    {
      label: copy.googleName,
      value: 'google',
      icon: AtSign,
      helper: copy.googleHelper,
    },
    {
      label: copy.emailName,
      value: 'email',
      icon: Mail,
      helper: copy.emailHelper,
    },
  ];

  const [availableProviders, setAvailableProviders] = useState<Record<string, unknown>>({});
  const [configuredProviders, setConfiguredProviders] = useState<ConfiguredProviders>({
    google: false,
    email: false,
  });
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | null>(null);
  const [authNotice, setAuthNotice] = useState<AuthNotice>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailChallengeToken, setEmailChallengeToken] = useState('');
  const [maskedEmailAddress, setMaskedEmailAddress] = useState('');
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const authFormRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  const activeUser = session?.user
    ? {
        name: session.user.name || copy.memberName,
        email: session.user.email || '',
        phone: '',
      }
    : user;
  const signedInProviderName = session?.user?.provider
    ? session.user.provider === 'google'
      ? copy.googleName
      : copy.emailName
    : user?.provider === 'google'
      ? copy.googleName
      : user?.provider === 'email'
        ? copy.emailName
        : user?.provider === 'whatsapp'
          ? copy.phoneName
          : copy.dxlrName;

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
    if (authMode !== 'email') {
      return;
    }

    const scrollTimeout = window.setTimeout(() => {
      authFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      emailInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(scrollTimeout);
  }, [authMode]);

  useEffect(() => {
    if (session?.user) {
      setAuthMode(null);
      setAuthNotice(null);
      setEmailAddress('');
      setEmailOtp('');
      setEmailChallengeToken('');
      setMaskedEmailAddress('');
      setIsSendingEmailCode(false);
      setIsVerifyingEmailCode(false);
    }
  }, [session?.user]);

  const setNotice = (tone: 'error' | 'success', message: string) => {
    setAuthNotice({ tone, message });
  };

  const getProviderAvailability = (provider: 'google' | 'email') => {
    const providerKey = provider === 'email' ? 'email-otp' : provider;
    const providerIsConfigured = configuredProviders[provider];
    const providerIsAvailable =
      providerIsConfigured && (Boolean(availableProviders[providerKey]) || !providersLoaded);

    return {
      providerIsConfigured,
      providerIsAvailable,
    };
  };

  const handleGoogleSignIn = () => {
    const { providerIsConfigured, providerIsAvailable } = getProviderAvailability('google');

    if (!providerIsConfigured) {
      setNotice('error', copy.googleSetupMissing);
      return;
    }

    if (!providerIsAvailable) {
      setNotice('error', copy.googleUnavailable);
      return;
    }

    setAuthNotice(null);
    void authSignIn('google', { callbackUrl: '/' });
  };

  const handleToggleEmailForm = () => {
    const { providerIsConfigured } = getProviderAvailability('email');

    if (!providerIsConfigured) {
      setNotice('error', copy.emailSetupMissing);
      return;
    }

    setAuthNotice(null);
    setAuthMode((current) => (current === 'email' ? null : 'email'));
  };

  const handleRequestEmailCode = async () => {
    const normalizedEmail = emailAddress.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNotice('error', copy.invalidEmail);
      return;
    }

    try {
      setIsSendingEmailCode(true);
      setAuthNotice(null);

      const response = await fetch('/api/auth/email/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        challengeToken?: string;
        maskedEmail?: string;
        error?: string;
      };

      if (!response.ok || !data.challengeToken) {
        if (data.error === 'email_auth_not_configured') {
          setNotice('error', copy.emailSetupMissing);
        } else if (data.error === 'invalid_email') {
          setNotice('error', copy.invalidEmail);
        } else {
          setNotice('error', copy.failedToSendCode);
        }
        return;
      }

      setEmailAddress(normalizedEmail);
      setEmailChallengeToken(data.challengeToken);
      setMaskedEmailAddress(data.maskedEmail ?? normalizedEmail);
      setEmailOtp('');
      setNotice('success', copy.sentCode(data.maskedEmail ?? normalizedEmail));

      window.setTimeout(() => {
        otpInputRef.current?.focus();
      }, 120);
    } catch {
      setNotice('error', copy.failedToSendCode);
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    const normalizedEmail = emailAddress.trim().toLowerCase();
    const normalizedOtp = emailOtp.replace(/\D/g, '');

    if (!emailChallengeToken) {
      setNotice('error', copy.requestCodeFirst);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNotice('error', copy.invalidEmail);
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setNotice('error', copy.invalidOtp);
      return;
    }

    try {
      setIsVerifyingEmailCode(true);
      setAuthNotice(null);

      const result = await authSignIn('email-otp', {
        email: normalizedEmail,
        otp: normalizedOtp,
        challengeToken: emailChallengeToken,
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setNotice('error', copy.invalidCode);
        return;
      }

      setNotice('success', copy.signedInSuccess);
      router.refresh();
    } catch {
      setNotice('error', copy.invalidCode);
    } finally {
      setIsVerifyingEmailCode(false);
    }
  };

  const handleEditOrder = (orderId: string) => {
    const order = orders.find((entry) => entry.id === orderId);

    if (!order) {
      return;
    }

    setCartState(order.items, order.paymentMethod);
    removeOrder(orderId);
    closeAccount();
    router.push('/checkout');
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
            aria-label={copy.closeAccount}
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
                <p className={`text-zinc-500 ${labelClassName}`}>{copy.accountHub}</p>
                <h2 className={`mt-2 text-xl font-semibold text-black ${isArabic ? 'tracking-normal' : 'uppercase tracking-[0.08em]'}`}>
                  {copy.yourAccount}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeAccount}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:rotate-90 hover:bg-black hover:text-white"
                aria-label={copy.closeAccount}
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {activeUser ? (
                <>
                <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(145deg,#111111_0%,#1d1a16_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                  <p className={`text-white/58 ${labelClassName}`}>{copy.signedIn}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                      <User2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                        {activeUser.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/68">{copy.accountLabel(signedInProviderName)}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-white/72">
                    <p>{activeUser.email || copy.noEmail}</p>
                    {activeUser.phone ? <p>{activeUser.phone}</p> : null}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className={`text-zinc-500 ${labelClassName}`}>{copy.purchaseHistory}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-black">
                      {copy.ordersCount(orders.length)}
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
                    className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-black transition hover:bg-black hover:text-white ${sectionCountClassName}`}
                  >
                    <LogOut size={14} />
                    {copy.signOut}
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
                            <p className={`text-zinc-500 ${labelClassName}`}>
                              {copy.order} #{order.id.slice(-6)}
                            </p>
                            <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-black">
                              {formatPrice(order.total, locale)}
                            </h4>
                          </div>

                          <span
                            className={`rounded-full px-3 py-2 ${badgeClassName} ${
                              order.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {order.status === 'confirmed' ? copy.confirmed : copy.awaitingPayment}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-[var(--foreground-soft)]">
                          <p className="inline-flex items-center gap-2">
                            <Clock3 size={14} />
                            {new Date(order.createdAt).toLocaleString(isArabic ? 'ar-EG' : 'en-GB')}
                          </p>
                          <p className="inline-flex items-center gap-2">
                            <ShieldCheck size={14} />
                            {order.paymentMethod.replaceAll('_', ' ')}
                          </p>
                          <p>{copy.itemsCount(order.itemCount)}</p>
                        </div>

                        {order.items.length > 0 ? (
                          <div className="mt-4 space-y-3 border-t border-black/8 pt-4">
                            {order.items.map((item) => {
                              const localizedItem = products[item.id]
                                ? getLocalizedProduct(item.id, locale)
                                : item;

                              return (
                                <div
                                  key={`${order.id}-${item.id}-${item.size}`}
                                  className="flex items-center gap-3 rounded-[18px] bg-[var(--surface)] p-3"
                                >
                                  <div className="relative h-18 w-16 shrink-0 overflow-hidden rounded-[14px] bg-[var(--surface-muted)]">
                                    <Image
                                      src={item.image}
                                      alt={localizedItem.title}
                                      fill
                                      sizes="64px"
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-black">
                                      {localizedItem.title}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                      <span className="inline-flex items-center rounded-full border border-black bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                                        {dict.size} {item.size}
                                      </span>
                                      <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] text-[var(--foreground-soft)]">
                                        {dict.quantity} {item.quantity}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-xs text-[var(--foreground-soft)]">
                                      {copy.sizeQtySummary(item.size, item.quantity)}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-black">
                                      {formatPrice(item.price * item.quantity, locale)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}

                        {order.status === 'awaiting_payment' ? (
                          <button
                            type="button"
                            onClick={() => handleEditOrder(order.id)}
                            className={`mt-4 inline-flex items-center gap-2 rounded-full border border-black bg-black px-4 py-3 text-white transition hover:bg-zinc-800 ${actionButtonClassName}`}
                          >
                            <PencilLine size={14} />
                            {copy.editOrder}
                          </button>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-6 py-12 text-center">
                      <p className={`text-zinc-500 ${labelClassName}`}>{copy.noOrdersYet}</p>
                      <p className="mt-3 text-sm leading-7 text-zinc-600">
                        {copy.noOrdersHint}
                      </p>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(145deg,#111111_0%,#1d1a16_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                  <p className={`text-white/58 ${labelClassName}`}>{copy.accessLabel}</p>
                  <h3 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.05em]">
                    {copy.signInHeadline}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/72">{copy.signInHint}</p>
                </div>

                <div className="mt-5">
                  <p className={`text-zinc-500 ${labelClassName}`}>{copy.signInOptions}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {providerCards.map((provider) => {
                    const Icon = provider.icon;
                    const { providerIsConfigured, providerIsAvailable } = getProviderAvailability(
                      provider.value
                    );
                    const providerStatus =
                      provider.value === 'email' && authMode === 'email'
                        ? copy.closeForm
                        : !providersLoaded
                          ? copy.checking
                          : providerIsAvailable
                            ? copy.continue
                            : providerIsConfigured
                              ? copy.retry
                              : copy.needsSetup;

                    return (
                      <button
                        key={provider.value}
                        type="button"
                        onClick={() =>
                          provider.value === 'email' ? handleToggleEmailForm() : handleGoogleSignIn()
                        }
                        className={`rounded-[20px] border p-4 text-left transition ${
                          provider.value === 'email' && authMode === 'email'
                            ? 'border-black bg-black text-white'
                            : providerIsAvailable
                              ? 'border-black/8 bg-white text-black hover:border-black/14'
                              : providerIsConfigured
                                ? 'border-amber-200 bg-amber-50 text-black'
                                : 'border-black/8 bg-[#f7f4ee] text-black/75'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            provider.value === 'email' && authMode === 'email'
                              ? 'bg-white text-black'
                              : 'bg-[var(--surface)] text-black'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <h4 className={`mt-3 ${providerCardTitleClassName}`}>
                          {provider.label}
                        </h4>
                        <p
                          className={`mt-2 text-xs leading-5 ${
                            provider.value === 'email' && authMode === 'email'
                              ? 'text-white/72'
                              : 'text-[var(--foreground-soft)]'
                          }`}
                        >
                          {provider.helper}
                        </p>
                        <p
                          className={`mt-3 ${
                            provider.value === 'email' && authMode === 'email'
                              ? `text-white/80 ${badgeClassName}`
                              : `text-[var(--accent-soft-strong)] ${badgeClassName}`
                          }`}
                        >
                          {providerStatus}
                        </p>
                      </button>
                    );
                  })}
                </div>

                  {authMode === 'email' ? (
                      <div
                        ref={authFormRef}
                        className="mt-4 rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
                      >
                        <p className={`text-zinc-500 ${labelClassName}`}>{copy.emailSignIn}</p>
                        <div className="mt-4 grid gap-3">
                          <input
                            ref={emailInputRef}
                            type="email"
                            value={emailAddress}
                            onChange={(event) => setEmailAddress(event.target.value)}
                            placeholder={copy.emailPlaceholder}
                            className="h-12 rounded-[16px] border border-black/10 bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={handleRequestEmailCode}
                            disabled={isSendingEmailCode}
                            className={`inline-flex h-12 items-center justify-center rounded-full border border-black bg-black px-5 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-700 ${actionButtonClassName}`}
                          >
                            {isSendingEmailCode
                              ? copy.checking
                              : emailChallengeToken
                                ? copy.resendCode
                                : copy.sendCode}
                          </button>
                          <p className="text-xs leading-5 text-zinc-500">
                            {emailChallengeToken
                              ? copy.verificationHint(maskedEmailAddress || emailAddress)
                              : copy.otpHint}
                          </p>
                          <input
                            ref={otpInputRef}
                            type="text"
                            inputMode="numeric"
                            value={emailOtp}
                            onChange={(event) =>
                              setEmailOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                            }
                            placeholder={copy.otpPlaceholder}
                            className="h-12 rounded-[16px] border border-black/10 bg-[var(--surface)] px-4 text-sm tracking-[0.34em] outline-none transition focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailCode}
                            disabled={isVerifyingEmailCode}
                            className={`inline-flex h-12 items-center justify-center rounded-full bg-black px-5 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-700 ${actionButtonClassName}`}
                          >
                            {isVerifyingEmailCode ? copy.checking : copy.verifyCode}
                          </button>
                          {authNotice ? (
                            <div
                              className={`rounded-[16px] px-4 py-3 text-sm ${
                                authNotice.tone === 'success'
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border border-amber-200 bg-amber-50 text-amber-700'
                              }`}
                            >
                              {authNotice.message}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : authNotice ? (
                      <div
                        className={`mt-4 rounded-[16px] px-4 py-3 text-sm ${
                          authNotice.tone === 'success'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {authNotice.message}
                      </div>
                    ) : null}
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
