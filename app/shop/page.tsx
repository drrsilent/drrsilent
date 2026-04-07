'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { use } from 'react';
import { productCards, shopCategories } from '../../data/products';
import { flyToCart } from '../../lib/fly-to-cart';
import { useCartStore } from '../../store/useCartStore';

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
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = use(searchParams);
  const addToCart = useCartStore((state) => state.addToCart);
  const activeCategory = shopCategories.find((item) => item.slug === category);
  const visibleProducts = activeCategory
    ? productCards.filter((product) => product.category === activeCategory.slug)
    : productCards;

  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 pb-20 pt-28 text-black md:px-6 md:pt-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 rounded-[32px] border border-[var(--line)] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:px-7 md:py-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/"
                className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-soft)] transition hover:text-black"
              >
                <ArrowLeft size={14} />
                Back Home
              </Link>

              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-soft)]">
                {activeCategory ? activeCategory.label : 'Full Collection'}
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
                {activeCategory ? activeCategory.label : 'Shop All'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-soft)]">
                {activeCategory
                  ? `Browse the ${activeCategory.label.toLowerCase()} edit with the same quick add flow and direct product pages.`
                  : 'Browse the complete DXLR lineup with the same quick add flow and direct product pages.'}
              </p>
            </div>

            <div className="inline-flex self-start rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-soft)] shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:self-auto">
              {visibleProducts.length} Pieces
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap gap-3"
        >
          <Link
            href="/shop"
            className={`rounded-full border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition ${
              !activeCategory
                ? 'border-black bg-black text-white'
                : 'border-[var(--line)] bg-white text-black hover:border-black'
            }`}
          >
            All
          </Link>

          {shopCategories.map((item) => (
            <Link
              key={item.slug}
              href={`/shop?category=${item.slug}`}
              className={`rounded-full border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition ${
                activeCategory?.slug === item.slug
                  ? 'border-black bg-black text-white'
                  : 'border-[var(--line)] bg-white text-black hover:border-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </motion.div>

        <motion.section
          variants={containerVariants}
          className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(240px,320px))]"
        >
          {visibleProducts.map((product) => (
            <motion.article
              key={product.id}
              variants={itemVariants}
              className="group flex w-full max-w-[320px] flex-col"
            >
              <div className="relative mb-4 aspect-[5/6] overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-muted)] shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const card = event.currentTarget.closest('article');
                    const image = card?.querySelector('img');

                    addToCart({ ...product, size: 'L', quantity: 1 });
                    flyToCart({
                      imageSrc: product.image,
                      sourceRect: image?.getBoundingClientRect(),
                    });
                  }}
                  className="absolute bottom-4 left-4 right-4 z-20 inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/95 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black opacity-100 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:bg-[var(--surface-muted)] md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  <ShoppingBag size={14} />
                  Quick Add
                </button>

                <Link
                  href={`/product/${product.id}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {product.title}</span>
                </Link>
              </div>

              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-black">
                {product.title}
              </h2>
              <p className="mt-1 text-xs font-mono text-[var(--foreground-soft)]">
                {product.price} EGP
              </p>
            </motion.article>
          ))}
        </motion.section>

        {visibleProducts.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-dashed border-black/10 bg-white px-6 py-16 text-center"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
              No Pieces Yet
            </p>
            <p className="mt-3 text-sm text-zinc-600">
              There are no products in this category right now.
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
