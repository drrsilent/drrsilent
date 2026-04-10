'use client';

import { AnimatePresence, motion, useMotionTemplate, useSpring } from 'framer-motion';
import Image from 'next/image';
import { ScanSearch, X } from 'lucide-react';
import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

type ProductImageViewerProps = {
  image: string;
  title: string;
  isArabic: boolean;
  imageFrameRef: RefObject<HTMLDivElement | null>;
};

const springConfig = {
  stiffness: 180,
  damping: 20,
  mass: 0.6,
};

export default function ProductImageViewer({
  image,
  title,
  isArabic,
  imageFrameRef,
}: ProductImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const glareX = useSpring(50, springConfig);
  const glareY = useSpring(28, springConfig);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.32), transparent 34%)`;

  const lensLabel = isArabic ? 'عرض 3D' : '3D view';
  const dragHint = isArabic ? 'حرّك المؤشر أو اسحب لمعاينة القطعة.' : 'Move around to inspect the garment.';
  const closeLabel = isArabic ? 'إغلاق المعاينة' : 'Close preview';
  const previewTag = isArabic ? 'معاينة 3D' : '3D preview';

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(28);
  };

  const updateTilt = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    rotateY.set((x - 0.5) * 18);
    rotateX.set((0.5 - y) * 16);
    glareX.set(x * 100);
    glareY.set(y * 100);
  };

  return (
    <>
      <div
        ref={imageFrameRef}
        className="group relative h-full min-h-[320px] overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#f6f3eb,#e7e0d4)] shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:min-h-[440px] md:min-h-[720px] md:rounded-[32px] md:shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.06))]" />

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-10">
          <Image
            src={image}
            alt={title}
            fill
            preload
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-contain p-5 drop-shadow-[0_24px_45px_rgba(0,0,0,0.22)] md:p-12"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-[16%] bottom-5 h-9 rounded-full bg-black/18 blur-2xl md:bottom-10 md:h-12" />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={lensLabel}
          className={`absolute top-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/55 px-3 py-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:border-white hover:bg-black/75 md:top-5 md:px-4 md:py-2.5 ${isArabic ? 'left-3 md:left-5' : 'right-3 md:right-5'}`}
        >
          <ScanSearch size={16} />
          <span className={isArabic ? 'text-[12px] font-semibold tracking-normal' : 'text-[10px] font-bold uppercase tracking-[0.18em]'}>
            {lensLabel}
          </span>
        </button>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.08))]" />
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[120] bg-black/72 backdrop-blur-md"
                  onClick={() => {
                    setIsOpen(false);
                    resetTilt();
                  }}
                >
                  <div className="flex min-h-full items-center justify-center px-4 py-8 md:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(event) => event.stopPropagation()}
                      className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#10100e,#090908)] p-4 text-white shadow-[0_40px_120px_rgba(0,0,0,0.42)] md:rounded-[36px] md:p-7"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4 md:mb-6">
                        <div>
                          <p className={isArabic ? 'text-[12px] text-white/60' : 'text-[10px] font-mono uppercase tracking-[0.32em] text-white/50'}>
                            {previewTag}
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] md:text-4xl">
                            {title}
                          </h3>
                          <p className="mt-2 text-sm text-white/62 md:text-base">
                            {dragHint}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            resetTilt();
                          }}
                          aria-label={closeLabel}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/6 text-white transition hover:bg-white/12"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(185,154,107,0.14),transparent_34%),linear-gradient(180deg,#181714,#0f0f0d)] p-4 md:rounded-[30px] md:p-8">
                        <div className="absolute inset-x-[14%] bottom-5 h-10 rounded-full bg-black/60 blur-3xl md:bottom-10 md:h-12" />

                        <div
                          className="relative mx-auto aspect-[4/5] w-full max-w-[560px] [perspective:1600px]"
                          onPointerMove={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            updateTilt(event.clientX, event.clientY, rect);
                          }}
                          onPointerLeave={resetTilt}
                          onTouchMove={(event) => {
                            const touch = event.touches[0];
                            if (!touch) {
                              return;
                            }
                            const rect = event.currentTarget.getBoundingClientRect();
                            updateTilt(touch.clientX, touch.clientY, rect);
                          }}
                          onTouchEnd={resetTilt}
                        >
                          <motion.div
                            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                            className="absolute inset-0 will-change-transform"
                          >
                            <div className="absolute inset-[7%] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#f4f1e8,#dfd6c6)] [transform:translateZ(-18px)]" />
                            <div className="absolute inset-[5%] rounded-[30px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.08))] shadow-[0_30px_80px_rgba(0,0,0,0.3)] [transform:translateZ(12px)]" />

                            <motion.div
                              style={{ backgroundImage: glareBackground, transformStyle: 'preserve-3d' }}
                              className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/10 [transform:translateZ(42px)]"
                            >
                              <Image
                                src={image}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 92vw, 50vw"
                                className="object-contain p-8 drop-shadow-[0_30px_52px_rgba(0,0,0,0.28)] md:p-12"
                              />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)_35%,rgba(0,0,0,0.12))]" />
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
