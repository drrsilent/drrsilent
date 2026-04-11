'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { use } from 'react';
import ProductModelCanvas from '../../components/Product/ProductModelCanvas';
import { getLocalizedProductCards, shopCategories } from '../../data/products';
import { formatPrice } from '../../lib/currency';
import { getCategoryLabel, getDictionary } from '../../lib/translations';
import { flyToCart } from '../../lib/fly-to-cart';
import { useCartStore } from '../../store/useCartStore';
import { useLocaleStore } from '../../store/useLocaleStore';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string }>;
}) {
  const { category, collection } = use(searchParams);
  const addToCart = useCartStore((state) => state.addToCart);
  const locale = useLocaleStore((state) => state.locale);
  const dict = getDictionary(locale).common;
  const isArabic = locale === 'ar';
  const labelClassName = isArabic
    ? 'text-[12px] tracking-[0.04em]'
    : 'text-[10px] font-mono uppercase tracking-[0.28em]';
  const buttonClassName = isArabic
    ? 'text-[13px] tracking-normal'
    : 'text-[10px] font-bold uppercase tracking-[0.16em] md:tracking-[0.22em]';
  const quickAddClassName = isArabic
    ? 'text-[11px] tracking-normal'
    : 'text-[8px] font-bold uppercase tracking-[0.12em] md:text-[10px] md:tracking-[0.25em]';
  const productTitleClassName = isArabic
    ? 'text-[14px] tracking-normal'
    : 'text-[9px] font-bold uppercase tracking-[0.08em] md:text-[11px] md:tracking-[0.22em]';
  const productCards = getLocalizedProductCards(locale);
  const activeCategory = shopCategories.find((item) => item.slug === category);

  const collectionProducts =
    collection === 'sale'
      ? productCards.slice(0, 6)
      : collection === 'eid-sale'
        ? productCards.filter((product) => product.category !== 't-shirts')
        : productCards;

  const visibleProducts = activeCategory
    ? collectionProducts.filter((product) => product.category === activeCategory.slug)
    : collectionProducts;

  const collectionLabel =
    collection === 'sale'
      ? 'Sale'
      : collection === 'eid-sale'
        ? 'Eid Sale'
        : activeCategory
          ? getCategoryLabel(locale, activeCategory.slug)
          : dict.fullCollection;

  const heading =
    collection === 'sale'
      ? 'Sale'
      : collection === 'eid-sale'
        ? 'Eid Sale'
        : activeCategory
          ? getCategoryLabel(locale, activeCategory.slug)
          : dict.shopAllTitle;

  const description =
    collection === 'sale'
      ? 'Browse selected DXLR pieces curated for the current sale edit.'
      : collection === 'eid-sale'
        ? 'Explore the seasonal Eid Sale selection with the same quick add flow and direct product pages.'
        : activeCategory
          ? locale === 'ar'
            ? `تصفّح قسم ${getCategoryLabel(locale, activeCategory.slug)} مع نفس الإضافة السريعة وصفحات المنتجات المباشرة.`
            : `Browse the ${getCategoryLabel(locale, activeCategory.slug).toLowerCase()} edit with the same quick add flow and direct product pages.`
          : dict.shopAllDescription;

  return (
    <main
      className="min-h-screen bg-[var(--surface)] px-3 pb-20 pt-22 text-black md:px-6 md:pt-32"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl"
      >
        <motion.div
          variants={itemVariants}
          className="mb-5 rounded-[24px] border border-[var(--line)] bg-white px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:mb-8 md:rounded-[32px] md:px-7 md:py-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/"
                className={`mb-4 inline-flex items-center gap-2 text-[var(--foreground-soft)] transition hover:text-black ${buttonClassName}`}
              >
                <ArrowLeft size={14} />
                {dict.backHome}
              </Link>

              <p className={`mb-3 text-[var(--foreground-soft)] ${labelClassName}`}>
                {collectionLabel}
              </p>
              <h1 className="text-[34px] font-semibold tracking-[-0.06em] sm:text-4xl md:text-6xl">
                {heading}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--foreground-soft)] md:mt-4 md:max-w-2xl md:leading-7">
                {description}
              </p>
            </div>

            <div className={`inline-flex self-start rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground-soft)] shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:self-auto md:px-5 md:py-3 ${buttonClassName}`}>
              {visibleProducts.length} {dict.pieces}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-5 -mx-1 overflow-x-auto px-1 pb-2 md:mb-8 md:overflow-visible md:px-0 md:pb-0"
        >
          <div className="flex min-w-max gap-2 md:min-w-0 md:flex-wrap md:gap-3">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Link
                href="/shop"
                className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition ${buttonClassName} ${
                  !activeCategory
                    ? 'border-black bg-black text-white'
                    : 'border-[var(--line)] bg-white text-black hover:border-black'
                }`}
              >
                {dict.all}
              </Link>
            </motion.div>

            {shopCategories.map((item) => (
              <motion.div key={item.slug} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
                <Link
                  href={`/shop?category=${item.slug}`}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition ${buttonClassName} ${
                    activeCategory?.slug === item.slug
                      ? 'border-black bg-black text-white'
                      : 'border-[var(--line)] bg-white text-black hover:border-black'
                  }`}
                >
                  {getCategoryLabel(locale, item.slug)}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.section
          variants={containerVariants}
          className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(240px,320px))] md:justify-center md:gap-6"
        >
          {visibleProducts.map((product) => (
            <motion.article
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group flex w-full min-w-0 flex-col"
            >
              <div className="relative mb-2.5 aspect-[4/5] overflow-hidden rounded-[18px] border border-[var(--line)] bg-[linear-gradient(180deg,#f7f4ee,#ebe4d7)] shadow-[0_14px_30px_rgba(0,0,0,0.06)] md:mb-4 md:max-w-[320px] md:rounded-[28px] md:shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <ProductModelCanvas model={product.model} interactive={false} />
                </motion.div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const card = event.currentTarget.closest('article');

                    addToCart({ ...product, size: 'L', quantity: 1 });
                    flyToCart({
                      imageSrc: product.image,
                      sourceRect: card?.getBoundingClientRect(),
                    });
                  }}
                  className={`absolute bottom-2 left-2 right-2 z-20 inline-flex items-center justify-center gap-1 rounded-full border border-white/70 bg-white/95 py-2 text-black opacity-100 shadow-[0_14px_30px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:bg-[var(--surface-muted)] md:bottom-4 md:left-4 md:right-4 md:translate-y-3 md:gap-2 md:py-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${quickAddClassName}`}
                >
                  <ShoppingBag size={14} />
                  {dict.quickAdd}
                </button>

                <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {product.title}</span>
                </Link>
              </div>

              <h2 className={`text-black ${productTitleClassName}`}>
                {product.title}
              </h2>
              <p className="mt-1 text-[11px] font-mono text-[var(--foreground-soft)]">
                {formatPrice(product.price, locale)}
              </p>
            </motion.article>
          ))}
        </motion.section>

        {visibleProducts.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-dashed border-black/10 bg-white px-6 py-16 text-center"
          >
            <p className={`text-zinc-500 ${labelClassName}`}>
              {dict.noPiecesYet}
            </p>
            <p className="mt-3 text-sm text-zinc-600">{dict.noPiecesHint}</p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
