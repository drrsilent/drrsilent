'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { featuredProducts } from '../data/products';
import { flyToCart } from '../lib/fly-to-cart';
import { useCartStore } from '../store/useCartStore';

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
     

      <main className="min-h-screen bg-[#f5f5f2] text-black">
        <section ref={heroRef} className="relative h-[175vh] bg-black">
          <motion.div
            style={{ scale: heroScale, y: heroY }}
            className="sticky top-0 z-0 flex h-screen items-center justify-center overflow-hidden bg-black"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,169,125,0.22),transparent_28%),radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,#080808,rgba(0,0,0,1))]" />
              <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.04))]"
              />
              <div className="absolute inset-x-[10%] top-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <motion.div
              style={{ y: contentY }}
              className="relative z-10 flex flex-col items-center px-4 pt-12 text-center text-white"
            >
              <div className="mb-5 inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-white/72 backdrop-blur-sm">
                Summer Protocol 2026
              </div>

              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.48em] text-[var(--accent-soft)]">
                Cairo Edition
              </p>

              <h1 className="bg-[linear-gradient(180deg,#ffffff_0%,rgba(255,255,255,0.84)_100%)] bg-clip-text text-7xl font-extrabold leading-none tracking-[-0.1em] text-transparent md:text-[180px]">
                DXLR.
              </h1>

              <p className="mt-6 max-w-xl text-[11px] font-mono uppercase tracking-[0.42em] text-white/42">
                Quiet luxury streetwear with a sharper silhouette
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/product/v1-hoodie"
                  className="rounded-full border border-white/25 bg-white/[0.05] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:bg-white hover:text-black"
                >
                  Explore Collection
                </Link>

                <button
                  type="button"
                  onClick={scrollToLookbook}
                  className="rounded-full border border-white/25 bg-white/[0.05] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:bg-white hover:text-black"
                >
                  View Lookbook
                </button>
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-mono uppercase tracking-[0.32em] text-white/35">
                <span>Heavyweight Cotton</span>
                <span>Minimal Finish</span>
                <span>Daily Rotation</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          id="lookbook"
          ref={lookbookRef}
          style={{ y: productsY }}
          className="relative z-30 -mt-24 rounded-t-[36px] bg-[var(--surface)] px-6 pb-24 pt-14 shadow-[0_-26px_80px_rgba(0,0,0,0.08)]"
        >
          <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-soft)]">
                Featured Pieces
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] md:text-4xl">
                Built for everyday rotation.
              </h2>
            </div>

            <Link
              href="/shop"
              className="hidden rounded-full border border-[var(--line)] bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--foreground-soft)] shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:border-[var(--line-strong)] hover:text-black md:inline-block"
            >
              Shop All
            </Link>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            {featuredProducts.map((product) => (
              <article key={product.id} className="group flex flex-col">
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--surface-muted)] shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
                    className="absolute bottom-4 left-4 right-4 z-20 rounded-full border border-white/70 bg-white/95 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-[var(--surface-muted)]"
                  >
                    Quick Add
                  </button>

                  <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {product.title}</span>
                  </Link>
                </div>

                <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-black">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs font-mono text-[var(--foreground-soft)]">
                  {product.price} EGP
                </p>
              </article>
            ))}
          </div>
        </motion.section>
      </main>
    </>
  );
}
