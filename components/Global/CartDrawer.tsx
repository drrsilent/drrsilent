'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Banknote, CreditCard, ShoppingBag, Smartphone, Trash2, X } from 'lucide-react';
import { CartItem, PaymentMethod, useCartStore } from '../../store/useCartStore';
import { getLocalizedProduct, products } from '../../data/products';
import { formatPrice } from '../../lib/currency';
import { getDictionary } from '../../lib/translations';
import { useLocaleStore } from '../../store/useLocaleStore';

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateItemSize = useCartStore((state) => state.updateItemSize);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const locale = useLocaleStore((state) => state.locale);
  const dict = getDictionary(locale).common;
  const isArabic = locale === 'ar';
  const labelClassName = isArabic
    ? 'text-[12px] tracking-[0.04em]'
    : 'text-[10px] font-mono uppercase tracking-[0.3em]';
  const titleClassName = isArabic
    ? 'text-xl tracking-normal'
    : 'text-xl uppercase tracking-[0.08em]';
  const productTitleClassName = isArabic
    ? 'text-sm tracking-normal'
    : 'text-sm uppercase tracking-[0.08em]';
  const sizeChipClassName = isArabic
    ? 'text-[11px] tracking-normal'
    : 'text-[10px] uppercase tracking-[0.16em]';
  const activeSizeBadgeClassName = isArabic
    ? 'text-[12px] font-semibold tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.16em]';
  const countChipClassName = isArabic
    ? 'text-[12px] tracking-normal'
    : 'text-[10px] uppercase tracking-[0.22em]';
  const checkoutButtonClassName = isArabic
    ? 'text-[14px] tracking-normal'
    : 'text-[10px] uppercase tracking-[0.28em]';

  const subtotal = items.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );
  const paymentMethods = [
    { label: dict.paymentCard, value: 'card', icon: CreditCard },
    { label: dict.paymentCashOnDelivery, value: 'cash_on_delivery', icon: Banknote },
    { label: dict.paymentApplePay, value: 'apple_pay', icon: Smartphone },
  ];
  const checkoutLabel =
    paymentMethod === 'cash_on_delivery'
      ? dict.checkoutCashOnDelivery
      : paymentMethod === 'apple_pay'
        ? dict.checkoutApplePay
        : dict.checkoutCard;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150]">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            onClick={toggleCart}
            aria-label="Close cart"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-[440px] flex-col border-l border-black/8 bg-[#fbfaf7] px-4 pb-4 pt-4 shadow-[0_30px_120px_rgba(0,0,0,0.22)] md:px-6 md:pb-6"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-4">
              <div>
                <p className={`text-zinc-500 ${labelClassName}`}>
                  {dict.cartSummary}
                </p>
                <h2 className={`mt-2 flex items-center gap-2 font-semibold text-black ${titleClassName}`}>
                  {dict.yourCart}
                  <ShoppingBag size={18} />
                </h2>
              </div>

              <button
                type="button"
                onClick={toggleCart}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:rotate-90 hover:bg-black hover:text-white"
                aria-label={dict.closeCart}
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="w-full rounded-[28px] border border-dashed border-black/10 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                    <ShoppingBag size={24} />
                  </div>
                  <p className={`text-zinc-500 ${labelClassName}`}>
                    {dict.cartEmpty}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    {dict.cartEmptyHint}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                  {items.map((item: CartItem, index: number) => {
                    const localizedTitle = products[item.id]
                      ? getLocalizedProduct(item.id, locale).title
                      : item.title;

                    return (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="rounded-[22px] border border-black/8 bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:rounded-[26px]"
                    >
                      <div className="flex gap-3 md:gap-4">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[#eceae3] md:h-28 md:w-24 md:rounded-[18px]">
                          <Image
                            src={item.image}
                            alt={localizedTitle}
                            fill
                            sizes="96px"
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className={`truncate font-bold text-black ${productTitleClassName}`}>
                                  {localizedTitle}
                                </h3>
                                <span
                                  className={`inline-flex items-center rounded-full border border-black bg-black px-2.5 py-1 text-white ${activeSizeBadgeClassName}`}
                                >
                                  {dict.size} {item.size}
                                </span>
                                <span className="inline-flex items-center rounded-full border border-black/10 bg-[#f8f7f3] px-2.5 py-1 text-xs text-[var(--foreground-soft)]">
                                  {dict.quantity} {item.quantity}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-[var(--foreground-soft)]">
                                {isArabic
                                  ? `المقاس الحالي: ${item.size}`
                                  : `Current size: ${item.size}`}
                              </p>
                              <div className="mt-3">
                                <p className={`mb-2 text-zinc-500 ${labelClassName}`}>
                                  {isArabic ? 'تغيير المقاس' : 'Change size'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {(products[item.id]?.sizes ?? [item.size]).map((sizeOption) => {
                                    const isSelected = item.size === sizeOption;

                                    return (
                                      <button
                                        key={`${item.id}-${item.size}-${sizeOption}`}
                                        type="button"
                                        onClick={() =>
                                          updateItemSize(item.id, item.size, sizeOption)
                                        }
                                        className={`rounded-full border px-3 py-1.5 font-bold transition ${sizeChipClassName} ${
                                          isSelected
                                            ? 'border-black bg-black text-white'
                                            : 'border-black/10 bg-[#f8f7f3] text-black hover:border-black/25'
                                        }`}
                                      >
                                        {sizeOption}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                              aria-label={`${dict.removeItem} ${localizedTitle}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <p className={`text-zinc-500 ${labelClassName}`}>
                                {dict.quantity}
                              </p>
                              <div className="mt-2 inline-flex items-center rounded-full border border-black/10 bg-[#f8f7f3] p-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateItemQuantity(item.id, item.size, item.quantity - 1)
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-black transition hover:bg-white"
                                  aria-label={`${dict.decreaseQuantity} ${localizedTitle}`}
                                >
                                  -
                                </button>
                                <span className="min-w-[28px] text-center text-sm font-semibold text-black">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateItemQuantity(item.id, item.size, item.quantity + 1)
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-black transition hover:bg-white"
                                  aria-label={`${dict.increaseQuantity} ${localizedTitle}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className={`text-zinc-500 ${labelClassName}`}>
                                {dict.price}
                              </p>
                              <p className="mt-1 text-base font-semibold text-black">
                                {formatPrice(item.price * item.quantity, locale)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="mt-5 rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:rounded-[30px] md:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`text-zinc-500 ${labelClassName}`}>
                        {dict.subtotal}
                      </p>
                      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                        {formatPrice(subtotal, locale)}
                      </h3>
                    </div>

                    <div className={`rounded-full bg-[#f5f5f2] px-4 py-2 font-bold text-zinc-500 ${countChipClassName}`}>
                      {itemCount} {dict.itemsCount}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className={`text-zinc-500 ${labelClassName}`}>
                      {dict.paymentMethods}
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = paymentMethod === method.value;

                        return (
                          <button
                            key={method.label}
                            type="button"
                            onClick={() =>
                              setPaymentMethod(method.value as PaymentMethod)
                            }
                            className={`flex items-center gap-2 rounded-[18px] border px-3 py-3 text-left text-xs font-semibold transition ${
                              isSelected
                                ? 'border-black bg-black text-white shadow-[0_16px_40px_rgba(0,0,0,0.14)]'
                                : 'border-black/8 bg-[#f8f7f3] text-black hover:border-black/20 hover:bg-white'
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.06)] ${
                                isSelected
                                  ? 'bg-white text-black'
                                  : 'bg-white text-black'
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <span className="leading-4">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-5 font-bold text-white transition hover:bg-zinc-800 ${checkoutButtonClassName}`}
                  >
                    {checkoutLabel}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
