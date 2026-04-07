'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Search, Menu, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { products, shopCategories } from '../../data/products';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartPulsing, setIsCartPulsing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isHome = pathname === '/';
  const isProductPage = pathname.startsWith('/product/');
  const useLightHeader = isProductPage ? false : !isHome || isScrolled;

  const toggleCart = useCartStore((state) => state.toggleCart);
  const cart = useCartStore((state) => state.items);
  const itemCount = cart.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
  const searchResults = Object.values(products).filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300 ${headerClass}`}
      >
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 md:h-[82px] md:px-6">
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
            >
              <Search size={18} strokeWidth={2.2} />
            </button>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setIsMenuOpen((current) => !current)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
              >
                <Menu size={18} strokeWidth={2.2} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-[calc(100%+12px)] z-[120] w-48 overflow-hidden rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.96)] p-2 text-black shadow-[0_22px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl md:w-52 md:rounded-[24px]"
                  >
                    <div className="px-3 pb-2 pt-1 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
                      Categories
                    </div>

                    {shopCategories.map((category) => (
                      <Link
                        key={category.slug}
                        onClick={() => setIsMenuOpen(false)}
                        href={`/shop?category=${category.slug}`}
                        className="flex w-full items-center justify-between rounded-[18px] px-3 py-3 text-right text-sm font-semibold tracking-[-0.01em] transition hover:bg-[var(--surface)]"
                      >
                        <span>{category.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
                  className={`mb-1 text-[7px] font-mono uppercase tracking-[0.28em] md:text-[8px] md:tracking-[0.45em] ${
                    useLightHeader ? 'text-[var(--foreground-soft)]' : 'text-white/55'
                  }`}
                >
                  Engineered Ease
                </p>
                <h2 className="text-[28px] font-extrabold leading-none tracking-[-0.09em] md:text-[40px]">
                  DXLR.
                </h2>
              </motion.div>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <motion.button
              type="button"
              onClick={toggleCart}
              aria-label="Cart"
              data-cart-button="true"
              animate={
                isCartPulsing
                  ? {
                      scale: [1, 1.12, 1],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${iconClass}`}
            >
              <ShoppingBag size={18} strokeWidth={2.2} />

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
              className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.98)] shadow-[0_30px_120px_rgba(0,0,0,0.18)] backdrop-blur-xl md:mt-20 md:rounded-[30px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-[var(--line)] px-3 py-3 md:gap-3 md:px-5 md:py-4">
                <Search size={18} className="text-[var(--foreground-soft)]" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search hoodies, drops, silhouettes..."
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
                            Search Result
                          </p>
                          <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-black">
                            {product.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-[var(--foreground-soft)]">
                            {product.description}
                          </p>
                        </div>

                        <p className="hidden text-sm font-mono text-[var(--foreground-soft)] sm:block">
                          {product.price} EGP
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
                      No Results
                    </p>
                    <p className="mt-3 text-sm text-[var(--foreground-soft)]">
                      Try searching by hoodie name or product style.
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
