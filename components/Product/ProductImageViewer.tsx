'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, RotateCw, ScanSearch, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, type RefObject } from 'react';

type ProductImageViewerProps = {
  image: string;
  title: string;
  isArabic: boolean;
  imageFrameRef: RefObject<HTMLDivElement | null>;
  views?: string[];
};

const angleLabels = ['12:00', '3:00', '6:00', '9:00'];

export default function ProductImageViewer({
  image,
  title,
  isArabic,
  imageFrameRef,
  views,
}: ProductImageViewerProps) {
  const frames = views?.length ? views : [image];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const dragStepRef = useRef(0);

  const frameCount = frames.length;
  const activeImage = frames[activeIndex] ?? image;
  const lensLabel = isArabic ? 'عرض 360' : '360 view';
  const dragHint = isArabic
    ? 'اسحب يمين أو شمال ولف المنتج 360 درجة.'
    : 'Drag left or right to spin the product 360 degrees.';
  const closeLabel = isArabic ? 'إغلاق المعاينة' : 'Close preview';
  const previewTag = isArabic ? 'معاينة 360 درجة' : '360 product viewer';
  const nextLabel = isArabic ? 'الزاوية التالية' : 'Next angle';
  const previousLabel = isArabic ? 'الزاوية السابقة' : 'Previous angle';

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

      if (event.key === 'ArrowRight') {
        setActiveIndex(
          (current) => (current + (isArabic ? -1 : 1) + frameCount * 10) % frameCount
        );
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex(
          (current) => (current + (isArabic ? 1 : -1) + frameCount * 10) % frameCount
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [frameCount, isArabic, isOpen]);

  const rotateFrame = (direction: number) => {
    setActiveIndex((current) => (current + direction + frameCount * 10) % frameCount);
  };

  const resetDrag = () => {
    dragStartXRef.current = null;
    dragStepRef.current = 0;
  };

  return (
    <>
      <div
        ref={imageFrameRef}
        className="group relative h-full min-h-[320px] overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#f8f6f0,#e9dfcf)] shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:min-h-[440px] md:min-h-[720px] md:rounded-[32px] md:shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.04))]" />

        <Image
          src={image}
          alt={title}
          fill
          preload
          sizes="(max-width: 768px) 100vw, 55vw"
          draggable={false}
          className="object-contain p-5 drop-shadow-[0_24px_45px_rgba(0,0,0,0.2)] md:p-12"
        />

        <div className="pointer-events-none absolute inset-x-[16%] bottom-5 h-9 rounded-full bg-black/16 blur-2xl md:bottom-10 md:h-12" />

        <button
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setIsOpen(true);
          }}
          aria-label={lensLabel}
          className={`absolute top-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/70 bg-black/58 px-3 py-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:border-white hover:bg-black/78 md:top-5 md:px-4 md:py-2.5 ${isArabic ? 'left-3 md:left-5' : 'right-3 md:right-5'}`}
        >
          <ScanSearch size={16} />
          <span className={isArabic ? 'text-[12px] font-semibold tracking-normal' : 'text-[10px] font-bold uppercase tracking-[0.18em]'}>
            {lensLabel}
          </span>
        </button>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.06))]" />
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[120] bg-black/78 backdrop-blur-md"
                  onClick={() => {
                    setIsOpen(false);
                    resetDrag();
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
                            resetDrag();
                          }}
                          aria-label={closeLabel}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/6 text-white transition hover:bg-white/12"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(185,154,107,0.14),transparent_34%),linear-gradient(180deg,#181714,#0f0f0d)] p-4 md:rounded-[30px] md:p-8">
                        <div className="absolute inset-x-[14%] bottom-8 h-10 rounded-full bg-black/60 blur-3xl md:bottom-14 md:h-12" />

                        <button
                          type="button"
                          aria-label={previousLabel}
                          onClick={() => rotateFrame(isArabic ? 1 : -1)}
                          className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 md:left-5 md:h-12 md:w-12"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          aria-label={nextLabel}
                          onClick={() => rotateFrame(isArabic ? -1 : 1)}
                          className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 md:right-5 md:h-12 md:w-12"
                        >
                          <ChevronRight size={18} />
                        </button>

                        <div
                          className="relative mx-auto aspect-[4/5] w-full max-w-[560px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
                          onPointerDown={(event) => {
                            dragStartXRef.current = event.clientX;
                            dragStepRef.current = 0;
                            event.currentTarget.setPointerCapture(event.pointerId);
                          }}
                          onPointerMove={(event) => {
                            if (dragStartXRef.current === null) {
                              return;
                            }

                            const step = Math.trunc((event.clientX - dragStartXRef.current) / 26);

                            if (step === dragStepRef.current) {
                              return;
                            }

                            rotateFrame(step - dragStepRef.current);
                            dragStepRef.current = step;
                          }}
                          onPointerUp={(event) => {
                            resetDrag();
                            event.currentTarget.releasePointerCapture(event.pointerId);
                          }}
                          onPointerCancel={resetDrag}
                        >
                          <div className="absolute inset-[5%] overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,#f6f2e8,#e5d8c4)] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.985, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.01, filter: 'blur(5px)' }}
                                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src={activeImage}
                                  alt={`${title} ${angleLabels[activeIndex] ?? activeIndex + 1}`}
                                  fill
                                  sizes="(max-width: 768px) 92vw, 50vw"
                                  draggable={false}
                                  className="object-contain p-6 drop-shadow-[0_30px_52px_rgba(0,0,0,0.24)] md:p-12"
                                />
                              </motion.div>
                            </AnimatePresence>
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_34%,rgba(0,0,0,0.08))]" />
                          </div>
                        </div>

                        <div className="relative z-20 mt-4 flex flex-wrap items-center justify-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] text-white/70">
                            <RotateCw size={13} />
                            360°
                          </span>
                          {frames.map((frame, index) => (
                            <button
                              key={frame}
                              type="button"
                              onClick={() => setActiveIndex(index)}
                              className={`rounded-full border px-3 py-2 text-[11px] transition ${
                                activeIndex === index
                                  ? 'border-white bg-white text-black'
                                  : 'border-white/12 bg-white/[0.05] text-white/68 hover:border-white/40 hover:text-white'
                              }`}
                            >
                              {angleLabels[index] ?? `${index + 1}`}
                            </button>
                          ))}
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
