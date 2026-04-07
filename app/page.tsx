'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { AtSign, MessageCircle, PhoneCall } from 'lucide-react';
import { useRef } from 'react';
import { featuredProducts } from '../data/products';
import { flyToCart } from '../lib/fly-to-cart';
import { useCartStore } from '../store/useCartStore';

const heroGroupVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * index,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const lookbookRef = useRef<HTMLElement | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.12, 0.32]);

  const productsY = useTransform(scrollYProgress, [0.3, 1], [60, 0]);
  const scrollToLookbook = () => {
    lookbookRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
     

      <main className="min-h-screen bg-[var(--surface)] text-black">
        <section ref={heroRef} className="relative h-[155vh] bg-black md:h-[175vh]">
          <motion.div
            style={{ scale: heroScale, y: heroY }}
            className="sticky top-0 z-0 flex h-screen items-center justify-center overflow-hidden bg-black"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--hero-gold),transparent_28%),radial-gradient(circle_at_20%_30%,var(--hero-glow),transparent_26%),linear-gradient(180deg,#060606,rgba(0,0,0,1))]" />
              <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.04))]"
              />
              <motion.div
                animate={{
                  x: [0, 8, 0],
                  y: [0, -6, 0],
                  opacity: [0.22, 0.28, 0.22],
                }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute left-1/2 top-[18%] h-36 w-36 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--hero-gold),transparent_70%)] blur-3xl md:h-56 md:w-56"
              />
              <motion.div
                animate={{
                  x: [0, -8, 0],
                  y: [0, 6, 0],
                  opacity: [0.08, 0.14, 0.08],
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute right-[14%] top-[30%] h-28 w-28 rounded-full bg-white/10 blur-3xl md:h-40 md:w-40"
              />
              <div className="absolute inset-x-[10%] top-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <motion.div
              style={{ y: contentY }}
              variants={heroGroupVariants}
              initial="hidden"
              animate="show"
              className="relative z-10 flex flex-col items-center px-4 pt-12 text-center text-white"
            >
              <motion.div
                variants={heroItemVariants}
                className="mb-4 inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] text-white/72 backdrop-blur-sm md:mb-5 md:px-4 md:text-[10px] md:tracking-[0.32em]"
              >
                Summer Protocol 2026
              </motion.div>

              <motion.p
                variants={heroItemVariants}
                className="mb-3 text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--accent-soft)] md:text-[10px] md:tracking-[0.48em]"
              >
                Cairo Edition
              </motion.p>

              <motion.h1
                variants={heroItemVariants}
                className="bg-[linear-gradient(180deg,#ffffff_0%,rgba(255,255,255,0.84)_100%)] bg-clip-text text-[74px] font-extrabold leading-none tracking-[-0.09em] text-transparent sm:text-[88px] md:text-[180px]"
              >
                DXLR.
              </motion.h1>

              <motion.p
                variants={heroItemVariants}
                className="mt-5 max-w-[320px] text-[10px] font-mono uppercase tracking-[0.18em] text-white/58 sm:max-w-xl sm:text-[10px] sm:tracking-[0.3em] md:mt-6 md:text-[11px] md:tracking-[0.42em]"
              >
                Quiet luxury streetwear with a sharper silhouette
              </motion.p>

              <motion.div
                variants={heroItemVariants}
                className="mt-8 flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4 md:mt-10"
              >
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                  <Link
                    href="/shop"
                    className="block w-full rounded-full border border-white/20 bg-[rgba(185,154,107,0.12)] px-8 py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:bg-white hover:text-black sm:w-auto sm:text-[10px] sm:tracking-[0.3em]"
                  >
                    Explore Collection
                  </Link>
                </motion.div>

                <motion.button
                  type="button"
                  variants={heroItemVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={scrollToLookbook}
                  className="w-full rounded-full border border-white/20 bg-white/[0.05] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:bg-white hover:text-black sm:w-auto sm:text-[10px] sm:tracking-[0.3em]"
                >
                  View Lookbook
                </motion.button>
              </motion.div>

              <motion.div
                variants={heroItemVariants}
                className="mt-10 flex max-w-[320px] flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] font-mono uppercase tracking-[0.14em] text-white/38 sm:max-w-none sm:gap-x-8 sm:text-[10px] sm:tracking-[0.32em] md:mt-14"
              >
                <span>Heavyweight Cotton</span>
                <span>Minimal Finish</span>
                <span>Daily Rotation</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          id="lookbook"
          ref={lookbookRef}
          style={{ y: productsY }}
          className="relative z-30 -mt-16 rounded-t-[30px] bg-[var(--surface)] px-4 pb-20 pt-10 shadow-[0_-26px_80px_rgba(0,0,0,0.08)] md:-mt-24 md:rounded-t-[36px] md:px-6 md:pb-24 md:pt-14"
        >
          <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-soft)]">
                Featured Pieces
              </p>
              <h2 className="max-w-[260px] text-2xl font-semibold tracking-[-0.04em] md:max-w-none md:text-4xl">
                Built for everyday rotation.
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--line)] bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--foreground-soft)] shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:border-[var(--line-strong)] hover:text-black md:w-auto md:tracking-[0.25em]"
            >
              Shop All
            </Link>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.22 }}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="group flex flex-col"
              >
                <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:mb-4 md:rounded-[26px]">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <motion.div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.22),transparent_70%)] opacity-0"
                    whileHover={{ opacity: 0.55 }}
                    transition={{ duration: 0.45 }}
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const card = e.currentTarget.closest('article');
                      const image = card?.querySelector('img');

                      addToCart({ ...product, size: 'L', quantity: 1 });
                      flyToCart({
                        imageSrc: product.image,
                        sourceRect: image?.getBoundingClientRect(),
                      });
                    }}
                    className="absolute bottom-3 left-3 right-3 z-20 rounded-full border border-white/70 bg-white/95 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 opacity-100 md:bottom-4 md:left-4 md:right-4 md:translate-y-3 md:py-3 md:text-[10px] md:tracking-[0.25em] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-[var(--surface-muted)]"
                  >
                    Quick Add
                  </button>

                  <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {product.title}</span>
                  </Link>
                </div>

                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-black md:text-[11px] md:tracking-[0.24em]">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs font-mono text-[var(--foreground-soft)]">
                  {product.price} EGP
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-7xl rounded-[28px] border border-[var(--line)] bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.05)] md:mt-14 md:rounded-[36px] md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-soft)]">
                  Contact DXLR
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] md:text-4xl">
                  Reach out directly.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-soft)] md:text-base md:leading-7">
                  For orders, sizing help, or drop updates, contact DXLR directly
                  on phone, WhatsApp, or Instagram.
                </p>
              </div>

              <motion.a
                href="tel:+2001028589747"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition hover:bg-zinc-800"
              >
                Call Now
              </motion.a>
            </div>

            <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3">
              <motion.a
                href="tel:+2001028589747"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 transition hover:border-black/20 hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--foreground-soft)]">
                    Phone
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    +20 010 285 89747
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="https://wa.me/2001028589747"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 transition hover:border-black/20 hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--foreground-soft)]">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    Chat Directly
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="https://www.instagram.com/x1k3.1/"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 transition hover:border-black/20 hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                  <AtSign size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--foreground-soft)]">
                    Instagram
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    @x1k3.1
                  </p>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </>
  );
}
