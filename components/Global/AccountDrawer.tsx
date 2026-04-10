'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Clock3,
  CreditCard,
  ExternalLink,
  LogOut,
  Mail,
  LocateFixed,
  MapPinned,
  PencilLine,
  Plus,
  ShieldCheck,
  Trash2,
  User2,
  WalletCards,
  X,
} from 'lucide-react';
import {
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
  email: boolean;
  apple?: boolean;
};

type AuthNotice = {
  tone: 'error' | 'success';
  message: string;
} | null;

const normalizeProfileEmail = (email: string) => email.trim().toLowerCase();

const formatCardBrand = (brand: string) => {
  if (brand === 'visa') return 'Visa';
  if (brand === 'mastercard') return 'Mastercard';
  if (brand === 'amex') return 'Amex';
  if (brand === 'meeza') return 'Meeza';
  return 'Card';
};

const buildMapsLinks = (locationUrl: string, address: string, city: string) => {
  const rawLocation = locationUrl.trim();
  const fallbackQuery = [address.trim(), city.trim()].filter(Boolean).join(', ');

  if (!rawLocation && !fallbackQuery) {
    return null;
  }

  let query = rawLocation || fallbackQuery;
  let openUrl = rawLocation;

  try {
    const parsedUrl = new URL(rawLocation);
    const urlQuery =
      parsedUrl.searchParams.get('q') ||
      parsedUrl.searchParams.get('query') ||
      parsedUrl.searchParams.get('destination');

    if (urlQuery) {
      query = urlQuery;
    }
  } catch {
    openUrl = '';
  }

  if (!openUrl) {
    openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return {
    query,
    openUrl,
    embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`,
  };
};

export default function AccountDrawer() {
  const router = useRouter();
  const isOpen = useAccountStore((state) => state.isOpen);
  const user = useAccountStore((state) => state.user);
  const orders = useAccountStore((state) => state.orders);
  const profiles = useAccountStore((state) => state.profiles);
  const closeAccount = useAccountStore((state) => state.closeAccount);
  const clearManualSignIn = useAccountStore((state) => state.signOut);
  const removeOrder = useAccountStore((state) => state.removeOrder);
  const saveCurrentLocation = useAccountStore((state) => state.saveCurrentLocation);
  const saveCard = useAccountStore((state) => state.saveCard);
  const removeSavedCard = useAccountStore((state) => state.removeSavedCard);
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
  const [configuredProviders, setConfiguredProviders] = useState<ConfiguredProviders>({
    email: false,
  });
  const [authNotice, setAuthNotice] = useState<AuthNotice>(null);
  const [accountNotice, setAccountNotice] = useState<AuthNotice>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailChallengeToken, setEmailChallengeToken] = useState('');
  const [maskedEmailAddress, setMaskedEmailAddress] = useState('');
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDraft, setCardDraft] = useState({
    nickname: '',
    cardholder: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
  });
  const [resendCooldown, setResendCooldown] = useState(0);
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
  const hasActiveUser = Boolean(session?.user || user);
  const activeEmail = normalizeProfileEmail(activeUser?.email || '');
  const currentProfile = activeEmail ? profiles[activeEmail] : undefined;
  const savedLocation = currentProfile?.location || null;
  const savedCards = currentProfile?.savedCards || [];
  const mapsLinks = buildMapsLinks(
    savedLocation?.locationUrl || '',
    savedLocation?.address || '',
    savedLocation?.city || ''
  );
  const signedInProviderName =
    session?.user?.provider === 'email' || user?.provider === 'email'
      ? copy.emailName
      : user?.provider === 'whatsapp'
        ? copy.phoneName
        : copy.dxlrName;
  const resendCooldownLabel = isArabic
    ? `إعادة الإرسال خلال ${resendCooldown}ث`
    : `Resend in ${resendCooldown}s`;
  const emailOnlyHint = isArabic
    ? 'سجل دخولك بكود تحقق يصل إلى إيميلك، واحتفظ بحساب DXLR للطلب وسجل الشراء.'
    : 'Sign in with a one-time code sent to your email, then keep your DXLR profile for checkout and order history.';
  const emailAccessHeading = isArabic ? 'التحقق عبر الإيميل' : 'Email Verification';
  const emailAccessHint = isArabic
    ? 'اكتب إيميلك ليصلك كود تحقق، ثم أدخله هنا لإكمال الدخول داخل DXLR.'
    : 'Enter your email to receive a one-time verification code, then enter it here to complete sign in.';
  const accountOptionsLabel = isArabic ? 'خيارات الحساب' : 'Account Options';
  const locationLabel = isArabic ? 'موقعك' : 'Your Location';
  const locationHint = isArabic
    ? 'احفظ موقعك الحالي أو افتحه مباشرة على Google Maps من داخل حسابك.'
    : 'Keep your latest delivery pin ready and open it directly in Google Maps.';
  const locationEmptyLabel = isArabic
    ? 'لا يوجد موقع محفوظ حتى الآن. احفظه من checkout أو استخدم موقعك الحالي.'
    : 'No saved location yet. Save one from checkout or use your current location.';
  const openMapsLabel = isArabic ? 'فتح Google Maps' : 'Open Google Maps';
  const useCurrentLocationLabel = isArabic ? 'استخدام موقعي الحالي' : 'Use Current Location';
  const locationSavedMessage = isArabic
    ? 'تم حفظ موقعك الحالي وربطه بـ Google Maps.'
    : 'Your current location was saved and linked to Google Maps.';
  const locationErrorMessage = isArabic
    ? 'تعذر تحديد موقعك الآن. اسمح بالوصول إلى الموقع وجرّب مرة أخرى.'
    : 'We could not detect your location right now. Allow location access and try again.';
  const cardsLabel = isArabic ? 'البطاقات المحفوظة' : 'Saved Cards';
  const cardsHint = isArabic
    ? 'احفظ بيانات البطاقة بشكل مقنّع داخل هذا المتصفح لتسهيل الرجوع إليها.'
    : 'Keep masked card details in this browser for quick access later.';
  const addCardLabel = isArabic ? 'إضافة بطاقة' : 'Add Card';
  const hideCardFormLabel = isArabic ? 'إخفاء النموذج' : 'Hide Form';
  const noCardsLabel = isArabic
    ? 'لا توجد بطاقات محفوظة حتى الآن.'
    : 'No saved cards yet.';
  const nicknamePlaceholder = isArabic ? 'اسم البطاقة' : 'Card nickname';
  const cardholderPlaceholder = isArabic ? 'اسم حامل البطاقة' : 'Cardholder name';
  const cardNumberPlaceholder = isArabic ? 'رقم البطاقة' : 'Card number';
  const expiryMonthPlaceholder = isArabic ? 'الشهر MM' : 'MM';
  const expiryYearPlaceholder = isArabic ? 'السنة YY' : 'YY';
  const saveCardLabel = isArabic ? 'حفظ البطاقة' : 'Save Card';
  const removeCardLabel = isArabic ? 'حذف' : 'Remove';
  const savedBrowserHint = isArabic
    ? 'نحفظ آخر 4 أرقام فقط دون رقم البطاقة الكامل أو CVV.'
    : 'Only the last 4 digits are stored, never the full card number or CVV.';
  const cardSavedMessage = isArabic
    ? 'تم حفظ البطاقة بشكل مقنّع داخل هذا المتصفح.'
    : 'The card was saved in masked form in this browser.';
  const cardInvalidMessage = isArabic
    ? 'أكمل اسم البطاقة والاسم ورقم البطاقة وتاريخ الانتهاء بشكل صحيح.'
    : 'Complete the nickname, cardholder, card number, and expiry correctly.';

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
      } catch {
        if (!cancelled) {
          setConfiguredProviders({ email: false });
        }
      }
    }

    void loadProviderState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      setAuthNotice(null);
      setAccountNotice(null);
      setEmailAddress('');
      setEmailOtp('');
      setEmailChallengeToken('');
      setMaskedEmailAddress('');
      setIsSendingEmailCode(false);
      setIsVerifyingEmailCode(false);
      setResendCooldown(0);
    }
  }, [session?.user]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendCooldown]);

  const setNotice = (tone: 'error' | 'success', message: string) => {
    setAuthNotice({ tone, message });
  };

  useEffect(() => {
    if (isOpen && !hasActiveUser) {
      const focusTimeout = window.setTimeout(() => {
        authFormRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        emailInputRef.current?.focus();
      }, 120);

      return () => window.clearTimeout(focusTimeout);
    }
  }, [hasActiveUser, isOpen]);

  const handleRequestEmailCode = async () => {
    const normalizedEmail = emailAddress.trim().toLowerCase();

    if (!configuredProviders.email) {
      setNotice('error', copy.emailSetupMissing);
      return;
    }

    if (resendCooldown > 0) {
      return;
    }

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
      setResendCooldown(15);
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

  const handleSaveCurrentLocation = () => {
    if (!activeEmail) {
      return;
    }

    if (!navigator.geolocation) {
      setAccountNotice({
        tone: 'error',
        message: locationErrorMessage,
      });
      return;
    }

    setIsSavingLocation(true);
    setAccountNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        saveCurrentLocation(activeEmail, mapsUrl);
        setAccountNotice({
          tone: 'success',
          message: locationSavedMessage,
        });
        setIsSavingLocation(false);
      },
      () => {
        setAccountNotice({
          tone: 'error',
          message: locationErrorMessage,
        });
        setIsSavingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSaveCard = () => {
    if (!activeEmail) {
      return;
    }

    const result = saveCard(activeEmail, cardDraft);

    if (!result.ok) {
      setAccountNotice({
        tone: 'error',
        message: cardInvalidMessage,
      });
      return;
    }

    setCardDraft({
      nickname: '',
      cardholder: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
    });
    setShowCardForm(false);
    setAccountNotice({
      tone: 'success',
      message: cardSavedMessage,
    });
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

                <div className="mt-5">
                  <p className={`text-zinc-500 ${labelClassName}`}>{accountOptionsLabel}</p>

                  <div className="mt-3 grid gap-3">
                    <div className="rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                            <MapPinned size={18} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold tracking-[-0.03em] text-black">
                              {locationLabel}
                            </h4>
                            <p className="mt-1 text-sm leading-6 text-[var(--foreground-soft)]">
                              {savedLocation
                                ? [savedLocation.address, savedLocation.city]
                                    .filter(Boolean)
                                    .join(isArabic ? '، ' : ', ') || locationHint
                                : locationEmptyLabel}
                            </p>
                          </div>
                        </div>

                        {mapsLinks ? (
                          <a
                            href={mapsLinks.openUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-[var(--surface)] px-3 py-2 text-black transition hover:border-black/20 hover:bg-black hover:text-white ${actionButtonClassName}`}
                          >
                            <ExternalLink size={14} />
                            {openMapsLabel}
                          </a>
                        ) : null}
                      </div>

                      {mapsLinks ? (
                        <div className="mt-4 overflow-hidden rounded-[18px] border border-black/8">
                          <iframe
                            src={mapsLinks.embedUrl}
                            title={locationLabel}
                            className="h-36 w-full bg-[var(--surface)]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleSaveCurrentLocation}
                          disabled={isSavingLocation}
                          className={`inline-flex items-center gap-2 rounded-full border border-black bg-black px-4 py-3 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 ${actionButtonClassName}`}
                        >
                          <LocateFixed size={14} />
                          {isSavingLocation ? copy.checking : useCurrentLocationLabel}
                        </button>
                        {savedLocation?.notes ? (
                          <span className="inline-flex items-center rounded-full border border-black/10 bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground-soft)]">
                            {savedLocation.notes}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                            <WalletCards size={18} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold tracking-[-0.03em] text-black">
                              {cardsLabel}
                            </h4>
                            <p className="mt-1 text-sm leading-6 text-[var(--foreground-soft)]">
                              {cardsHint}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowCardForm((current) => !current)}
                          className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-[var(--surface)] px-3 py-2 text-black transition hover:border-black/20 hover:bg-black hover:text-white ${actionButtonClassName}`}
                        >
                          <Plus size={14} />
                          {showCardForm ? hideCardFormLabel : addCardLabel}
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        {savedCards.length > 0 ? (
                          savedCards.map((card) => (
                            <div
                              key={card.id}
                              className="rounded-[18px] border border-black/8 bg-[var(--surface)] px-4 py-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
                                    <CreditCard size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-black">
                                      {card.nickname || `${formatCardBrand(card.brand)} •••• ${card.last4}`}
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--foreground-soft)]">
                                      {formatCardBrand(card.brand)} •••• {card.last4} · {card.expiryMonth}/{card.expiryYear}
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--foreground-soft)]">
                                      {card.cardholder}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    removeSavedCard(activeEmail, card.id);
                                    setAccountNotice(null);
                                  }}
                                  className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-black transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 ${actionButtonClassName}`}
                                >
                                  <Trash2 size={14} />
                                  {removeCardLabel}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[18px] border border-dashed border-black/10 bg-[var(--surface)] px-4 py-5 text-sm text-[var(--foreground-soft)]">
                            {noCardsLabel}
                          </div>
                        )}

                        <p className="text-xs leading-5 text-zinc-500">{savedBrowserHint}</p>

                        {showCardForm ? (
                          <div className="rounded-[18px] border border-black/8 bg-[var(--surface)] p-4">
                            <div className="grid gap-3">
                              <input
                                type="text"
                                value={cardDraft.nickname}
                                onChange={(event) =>
                                  setCardDraft((current) => ({
                                    ...current,
                                    nickname: event.target.value,
                                  }))
                                }
                                placeholder={nicknamePlaceholder}
                                className="h-11 rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                              />
                              <input
                                type="text"
                                value={cardDraft.cardholder}
                                onChange={(event) =>
                                  setCardDraft((current) => ({
                                    ...current,
                                    cardholder: event.target.value,
                                  }))
                                }
                                placeholder={cardholderPlaceholder}
                                className="h-11 rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                              />
                              <input
                                type="text"
                                inputMode="numeric"
                                value={cardDraft.cardNumber}
                                onChange={(event) =>
                                  setCardDraft((current) => ({
                                    ...current,
                                    cardNumber: event.target.value.replace(/\D/g, '').slice(0, 19),
                                  }))
                                }
                                placeholder={cardNumberPlaceholder}
                                className="h-11 rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={cardDraft.expiryMonth}
                                  onChange={(event) =>
                                    setCardDraft((current) => ({
                                      ...current,
                                      expiryMonth: event.target.value.replace(/\D/g, '').slice(0, 2),
                                    }))
                                  }
                                  placeholder={expiryMonthPlaceholder}
                                  className="h-11 rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                                />
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={cardDraft.expiryYear}
                                  onChange={(event) =>
                                    setCardDraft((current) => ({
                                      ...current,
                                      expiryYear: event.target.value.replace(/\D/g, '').slice(0, 2),
                                    }))
                                  }
                                  placeholder={expiryYearPlaceholder}
                                  className="h-11 rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={handleSaveCard}
                                className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black bg-black px-4 text-white transition hover:bg-zinc-800 ${actionButtonClassName}`}
                              >
                                <CreditCard size={14} />
                                {saveCardLabel}
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {accountNotice ? (
                    <div
                      className={`mt-3 rounded-[16px] px-4 py-3 text-sm ${
                        accountNotice.tone === 'success'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {accountNotice.message}
                    </div>
                  ) : null}
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
                  <p className="mt-3 text-sm leading-6 text-white/72">{emailOnlyHint}</p>
                </div>

                <div
                  ref={authFormRef}
                  className="mt-5 rounded-[26px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                    <Mail size={18} />
                  </div>
                  <p className={`mt-4 text-zinc-500 ${labelClassName}`}>{emailAccessHeading}</p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-black">
                    {copy.emailSignIn}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-soft)]">
                    {emailAccessHint}
                  </p>

                  <div className="mt-5 grid gap-3">
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
                      disabled={!configuredProviders.email || isSendingEmailCode || resendCooldown > 0}
                      className={`inline-flex h-12 items-center justify-center rounded-full border border-black bg-black px-5 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-700 ${actionButtonClassName}`}
                    >
                      {isSendingEmailCode
                        ? copy.checking
                        : resendCooldown > 0
                          ? resendCooldownLabel
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
                      disabled={!configuredProviders.email || isVerifyingEmailCode}
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
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
