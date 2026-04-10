'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Languages, Menu, Search, ShoppingBag, User2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BrandWordmark from './BrandWordmark';
import { getLocalizedProducts, shopCategories } from '../../data/products';
import { formatPrice } from '../../lib/currency';
import { getCategoryLabel, getDictionary } from '../../lib/translations';
import { useAccountStore } from '../../store/useAccountStore';
import { useCartStore } from '../../store/useCartStore';
import { useLocaleStore } from '../../store/useLocaleStore';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartPulsing, setIsCartPulsing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocaleStore((state) => state.locale);
  const toggleLocale = useLocaleStore((state) => state.toggleLocale);
  const dict = getDictionary(locale).common;
  const isArabic = locale === 'ar';
  const nextLocaleLabel = isArabic ? dict.english : dict.arabic;
  const microLabelClassName = isArabic
    ? 'tracking-normal'
    : 'font-mono uppercase tracking-[0.2em] md:tracking-[0.45em]';
  const localeButtonClassName = isArabic
    ? 'text-[11px] tracking-normal md:text-[12px]'
    : 'text-[9px] font-bold uppercase tracking-[0.1em] md:text-[10px] md:tracking-[0.18em]';
  const menuLabelClassName = isArabic
    ? 'text-[12px] tracking-[0.04em]'
    : 'text-[10px] font-mono uppercase tracking-[0.32em]';
  const menuChipClassName = isArabic
    ? 'text-[12px] font-semibold tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.22em]';
  const menuChipSecondaryClassName = isArabic
    ? 'text-[12px] font-semibold tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.2em]';
  const localizedProducts = getLocalizedProducts(locale);
  const isHome = pathname === '/';
  const isProductPage = pathname.startsWith('/product/');
  const useLightHeader = isProductPage ? false : !isHome || isScrolled;

  const navItems: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }> = [
    { label: dict.home, href: '/', isActive: pathname === '/' },
    {
      label: dict.refundPolicy,
      href: '/refund-policy',
      isActive: pathname === '/refund-policy',
    },
    {
      label: dict.shippingPolicy,
      href: '/shipping-policy',
      isActive: pathname === '/shipping-policy',
    },
  ];

  const toggleCart = useCartStore((state) => state.toggleCart);
  const cart = useCartStore((state) => state.items);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const toggleAccount = useAccountStore((state) => state.toggleAccount);
  const accountUser = useAccountStore((state) => state.user);
  const { data: session } = useSession();
  const accountName = session?.user?.name || accountUser?.name || '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic, locale]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [isMenuOpen]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleCartBump = () => {
      setIsCartPulsing(true);
      timeoutId = setTimeout(() => setIsCartPulsing(false), 420);
    };

    window.addEventListener('cart:bump', handleCartBump);
    return () => {
      window.removeEventListener('cart:bump', handleCartBump);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const headerClass = useLightHeader
    ? 'border-[var(--line)] bg-[rgba(248,246,241,0.88)] text-black shadow-[0_14px_45px_rgba(15,15,15,0.06)] backdrop-blur-2xl'
    : isProductPage
      ? 'border-white/10 bg-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)]'
      : 'border-white/10 bg-[rgba(8,8,8,0.68)] text-white supports-[backdrop-filter]:bg-[rgba(8,8,8,0.46)] supports-[backdrop-filter]:backdrop-blur-2xl';

  const iconClass = useLightHeader
    ? 'border-[var(--line)] bg-[rgba(17,17,17,0.03)] text-black hover:bg-[var(--accent-soft-strong)] hover:text-white'
    : isProductPage
      ? 'border-white/14 bg-white/8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] hover:bg-white hover:text-black'
      : 'border-white/16 bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] hover:bg-white hover:text-black';

  const searchResults = localizedProducts.filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header
        className={`safe-top fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300 ${headerClass}`}
      >
        <div className="relative mx-auto flex h-[78px] max-w-7xl items-center justify-between px-4 sm:px-4 md:h-[82px] md:px-6">
          <div className="flex flex-1 items-center gap-2.5">
            <button
              type="button"
              aria-label={dict.search}
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
            >
              <Search size={17} strokeWidth={2.2} />
            </button>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setIsMenuOpen((current) => !current)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
              >
                <Menu size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer text-center"
              >
                <p
                  className={`mb-0.5 text-[5px] md:mb-1 md:text-[8px] ${
                    microLabelClassName
                  } ${
                    useLightHeader ? 'text-[var(--foreground-soft)]' : 'text-white/55'
                  }`}
                >
                  Engineered Ease
                </p>
                  <BrandWordmark
                    className={`text-[27px] font-black tracking-[-0.08em] md:text-[34px] ${
                      useLightHeader ? 'text-black' : 'text-white'
                    }`}
                  />
              </motion.div>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 md:gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={dict.language}
              className={`inline-flex h-11 min-w-[56px] items-center justify-center gap-1 rounded-full border px-3 transition-all duration-300 md:h-11 md:min-w-[60px] md:px-3 ${localeButtonClassName} ${iconClass}`}
            >
              <Languages className="hidden md:block" size={14} strokeWidth={2.1} />
              <span>{nextLocaleLabel}</span>
            </button>

            <button
              type="button"
              onClick={toggleAccount}
              aria-label={dict.account}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
            >
              <User2 size={17} strokeWidth={2.2} />
              {accountName ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold uppercase text-white ring-2 ring-[var(--surface-strong)]">
                  {accountName.slice(0, 1)}
                </span>
              ) : null}
            </button>

            <motion.button
              type="button"
              onClick={toggleCart}
              aria-label={dict.cart}
              data-cart-button="true"
              animate={isCartPulsing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
            >
              <ShoppingBag size={17} strokeWidth={2.2} />

              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute -right-1.5 -top-1.5 z-20 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e53935] px-1 text-[9px] font-bold text-white ring-2 ring-[var(--surface-strong)]"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[135] bg-black/28 backdrop-blur-[2px]"
          >
            <motion.div
              ref={menuRef}
              initial={{ x: -28, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0.92 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="safe-bottom h-full w-[min(90vw,420px)] overflow-y-auto border-r border-black/8 bg-[linear-gradient(180deg,#fcfbf8_0%,#f6f2eb_100%)] shadow-[0_22px_80px_rgba(0,0,0,0.14)]"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <div className="border-b border-black/6 px-6 pb-7 pt-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black transition hover:bg-black hover:text-white"
                  >
                    <X size={22} strokeWidth={1.8} />
                  </button>

                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                      <BrandWordmark className="text-[28px] font-black tracking-[-0.08em] text-black" />
                    </Link>
                </div>

                <div className="mt-7 rounded-[28px] border border-black/8 bg-[radial-gradient(circle_at_top,rgba(185,154,107,0.14),transparent_40%),linear-gradient(145deg,#111111_0%,#1d1a16_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                  <p className={`text-white/60 ${menuLabelClassName}`}>
                    {dict.dxlrNavigation}
                  </p>
                  <h3 className="mt-3 text-[28px] font-semibold tracking-[-0.06em]">
                    {dict.quietLuxury}
                  </h3>
                  <p className="mt-3 max-w-[260px] text-sm leading-6 text-white/70">
                    {dict.menuHint}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-3 pt-5">
                <p className={`text-[var(--foreground-soft)] ${menuLabelClassName}`}>
                  {dict.productCategories}
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <Link
                    href="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className={`inline-flex items-center rounded-full border border-black bg-black px-4 py-2.5 text-white shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition hover:border-[var(--accent-soft-strong)] hover:bg-[var(--accent-soft-strong)] ${menuChipClassName}`}
                  >
                    {dict.shopAll}
                  </Link>
                  {shopCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/shop?category=${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`inline-flex items-center rounded-full border border-black/8 bg-white/90 px-4 py-2.5 text-black shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition hover:border-black hover:bg-white ${menuChipSecondaryClassName}`}
                    >
                      {getCategoryLabel(locale, category.slug)}
                    </Link>
                  ))}
                </div>
              </div>

              <nav className="pb-8 pt-2">
                <div className={`px-6 pb-3 text-[var(--foreground-soft)] ${menuLabelClassName}`}>
                  {dict.quickLinks}
                </div>

                {navItems.map((item) => (
                  <div key={item.label} className="px-4 py-1">
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between rounded-[24px] px-5 py-4 text-[19px] tracking-[-0.03em] transition ${
                        item.isActive
                          ? 'border border-black/8 bg-white text-black shadow-[0_14px_34px_rgba(0,0,0,0.04)]'
                          : 'text-black/88 hover:bg-white/80'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-black/30 p-3 backdrop-blur-sm md:p-8"
            onClick={closeSearch}
          >
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="safe-bottom mx-auto mt-16 max-w-3xl overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.98)] shadow-[0_30px_120px_rgba(0,0,0,0.18)] backdrop-blur-xl md:mt-20 md:rounded-[30px]"
              onClick={(event) => event.stopPropagation()}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-2 border-b border-[var(--line)] px-3 py-3 md:gap-3 md:px-5 md:py-4">
                <Search size={18} className="text-[var(--foreground-soft)]" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={dict.searchPlaceholder}
                  className="h-12 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-[var(--foreground-soft)]"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={closeSearch}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-black/[0.04] text-black transition hover:bg-black hover:text-white md:h-11 md:w-11"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-3 md:p-4">
                {searchResults.length > 0 ? (
                  <div className="grid gap-3">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-3 transition hover:border-[var(--line-strong)] hover:bg-white md:gap-4 md:rounded-[24px]"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] bg-[var(--surface-muted)] md:h-20 md:w-20 md:rounded-[20px]">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--foreground-soft)]">
                            {dict.searchResult}
                          </p>
                          <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-black">
                            {product.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-[var(--foreground-soft)]">
                            {product.description}
                          </p>
                        </div>

                        <p className="hidden text-sm font-mono text-[var(--foreground-soft)] sm:block">
                          {formatPrice(product.price, locale)}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
                      {dict.noResults}
                    </p>
                    <p className="mt-3 text-sm text-[var(--foreground-soft)]">
                      {dict.noResultsHint}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
