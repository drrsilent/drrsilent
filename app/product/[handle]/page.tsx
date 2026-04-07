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
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
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
  const imageY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1]);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f5f2] px-6 pb-20 pt-36 text-black">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl rounded-[32px] border border-black/10 bg-white p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
            Product Not Found
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            This drop is not available.
          </h1>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition hover:bg-zinc-800"
          >
            <ArrowLeft size={14} />
            Back Home
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f2] px-4 pb-20 pt-24 text-black md:px-6 md:pt-28">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-7xl"
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-soft)] transition hover:text-black"
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
            className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-[#e9e9e3] shadow-[0_24px_80px_rgba(0,0,0,0.12)] md:min-h-[720px]"
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
            className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_20px_80px_rgba(0,0,0,0.06)] md:p-8"
          >
            <motion.p
              variants={itemVariants}
              className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500"
            >
              DXLR Product
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl"
            >
              {product.title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-xl font-mono text-zinc-600"
            >
              {product.price} EGP
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-sm leading-7 text-zinc-600"
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
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
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
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
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
              className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-5 text-[10px] font-bold uppercase tracking-[0.28em] text-white transition hover:bg-zinc-800"
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
