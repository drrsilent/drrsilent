'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { use, useRef, useState } from 'react';
import { products } from '../../../data/products';
import { flyToCart } from '../../../lib/fly-to-cart';
import { useCartStore } from '../../../store/useCartStore';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  const product = products[handle];
  const heroRef = useRef<HTMLDivElement | null>(null);
  const productImageRef = useRef<HTMLDivElement | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? 'M');

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.03, 1.015, 1]);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f5f2] px-4 pb-20 pt-28 text-black md:px-6 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl rounded-[28px] border border-black/10 bg-white p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.08)] md:rounded-[32px] md:p-10"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
            Product Not Found
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            This drop is not available.
          </h1>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 md:tracking-[0.25em]"
          >
            <ArrowLeft size={14} />
            Back Home
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f2] px-4 pb-16 pt-22 text-black md:px-6 md:pb-20 md:pt-28">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-7xl"
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/"
          className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--foreground-soft)] transition hover:text-black md:mb-6 md:tracking-[0.28em]"
          >
            <ArrowLeft size={14} />
            Back to Collection
          </Link>
        </motion.div>

        <section
          ref={heroRef}
          className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.div
            ref={productImageRef}
            variants={itemVariants}
            className="relative min-h-[360px] overflow-hidden rounded-[26px] bg-[#e9e9e3] shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:min-h-[440px] md:min-h-[720px] md:rounded-[32px]"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0"
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                preload
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-[26px] border border-black/10 bg-white p-5 shadow-[0_20px_80px_rgba(0,0,0,0.06)] md:rounded-[32px] md:p-8"
          >
            <motion.p
              variants={itemVariants}
              className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500"
            >
              DXLR Product
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl md:text-6xl"
            >
              {product.title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg font-mono text-zinc-600 md:text-xl"
            >
              {product.price} EGP
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-xl text-sm leading-6 text-zinc-600 md:mt-6 md:leading-7"
            >
              {product.description}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">
                Select Size
              </p>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;

                  return (
                    <motion.button
                      key={size}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition md:px-5 md:py-3 md:text-[11px] md:tracking-[0.2em] ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.14)]'
                          : 'border-black/10 bg-[#f5f5f2] text-black hover:border-black'
                      }`}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => {
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  size: selectedSize,
                  quantity: 1,
                });
                flyToCart({
                  imageSrc: product.image,
                  sourceRect: productImageRef.current?.getBoundingClientRect(),
                });
              }}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 md:mt-10 md:py-5 md:tracking-[0.28em]"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </motion.button>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}
