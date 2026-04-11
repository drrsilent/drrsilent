'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { RotateCw, ScanSearch, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';

type ProductImageViewerProps = {
  image: string;
  title: string;
  isArabic: boolean;
  imageFrameRef: RefObject<HTMLDivElement | null>;
  views?: string[];
};

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
  const spinProgress = frameCount > 1 ? (activeIndex / (frameCount - 1)) * 100 : 0;
  const lensLabel = isArabic ? 'عرض 360' : '360 view';
  const dragHint = isArabic
    ? 'اسحب المنتج يمين أو شمال وشوفه من كل زاوية.'
    : 'Drag the product left or right to spin every angle.';
  const closeLabel = isArabic ? 'إغلاق المعاينة' : 'Close preview';
  const previewTag = isArabic ? 'معاينة المنتج 360 درجة' : '360 product spin';
  const frameLabel = isArabic ? 'زاوية' : 'angle';

  const rotateFrame = (direction: number) => {
    if (frameCount <= 1) {
      return;
    }

    setActiveIndex((current) => (current + direction + frameCount * 100) % frameCount);
  };

  const resetDrag = () => {
    dragStartXRef.current = null;
    dragStepRef.current = 0;
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = event.clientX;
    dragStepRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null || frameCount <= 1) {
      return;
    }

    const pixelsPerFrame = frameCount > 12 ? 8 : 14;
    const step = Math.trunc((event.clientX - dragStartXRef.current) / pixelsPerFrame);

    if (step === dragStepRef.current) {
      return;
    }

    rotateFrame(step - dragStepRef.current);
    dragStepRef.current = step;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    resetDrag();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const moveBy = (direction: number) => {
      if (frameCount <= 1) {
        return;
      }

      setActiveIndex((current) => (current + direction + frameCount * 100) % frameCount);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }

      if (event.key === 'ArrowRight') {
        moveBy(isArabic ? -1 : 1);
      }

      if (event.key === 'ArrowLeft') {
        moveBy(isArabic ? 1 : -1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [frameCount, isArabic, isOpen]);

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
                  className="fixed inset-0 z-[120] overflow-y-auto bg-black/62 px-3 py-5 backdrop-blur-md md:px-8 md:py-8"
                  onClick={() => {
                    setIsOpen(false);
                    resetDrag();
                  }}
                >
                  <div className="flex min-h-full items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 18, scale: 0.96 }}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(event) => event.stopPropagation()}
                      className="relative w-full max-w-[920px] overflow-hidden rounded-[30px] border border-white/75 bg-[#f6f4ef] text-black shadow-[0_38px_120px_rgba(0,0,0,0.42)] md:rounded-[42px]"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-black/8 px-4 py-4 md:px-7 md:py-6">
                        <div>
                          <p className={isArabic ? 'text-[12px] text-black/48' : 'text-[10px] font-mono uppercase tracking-[0.32em] text-black/45'}>
                            {previewTag}
                          </p>
                          <h3 className="mt-1 text-xl font-semibold tracking-[-0.04em] md:text-3xl">
                            {title}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            resetDrag();
                          }}
                          aria-label={closeLabel}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition hover:bg-black hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="px-3 pb-5 pt-4 md:px-10 md:pb-9 md:pt-7">
                        <div
                          className="relative mx-auto aspect-square w-full max-w-[690px] cursor-ew-resize touch-none select-none overflow-hidden rounded-[28px] bg-white active:cursor-grabbing md:rounded-[38px]"
                          onPointerDown={startDrag}
                          onPointerMove={moveDrag}
                          onPointerUp={endDrag}
                          onPointerCancel={endDrag}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(255,255,255,0)_35%),linear-gradient(180deg,#ffffff,#f5f3ee)]" />
                          <div className="pointer-events-none absolute inset-x-[22%] bottom-[13%] h-10 rounded-full bg-black/16 blur-2xl md:h-14" />

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeImage}
                              initial={{ opacity: 0.72, scale: 0.985, x: isArabic ? -12 : 12 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0.72, scale: 1.01, x: isArabic ? 12 : -12 }}
                              transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                              className="absolute inset-0"
                            >
                              <Image
                                src={activeImage}
                                alt={`${title} ${frameLabel} ${activeIndex + 1}`}
                                fill
                                sizes="(max-width: 768px) 92vw, 620px"
                                draggable={false}
                                className="object-contain p-8 drop-shadow-[0_28px_38px_rgba(0,0,0,0.16)] md:p-14"
                              />
                            </motion.div>
                          </AnimatePresence>

                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_36%,rgba(0,0,0,0.03))]" />

                          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/82 px-3 py-2 text-[11px] font-semibold text-black shadow-[0_12px_28px_rgba(0,0,0,0.06)] backdrop-blur-md md:left-5 md:top-5">
                            <RotateCw size={14} />
                            360°
                          </div>
                        </div>

                        <div className="mx-auto mt-4 max-w-[690px] rounded-[22px] border border-black/8 bg-white/72 px-4 py-3 shadow-[0_16px_42px_rgba(0,0,0,0.05)] backdrop-blur-md md:mt-5 md:px-5 md:py-4">
                          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] text-black/55 md:text-xs">
                            <span>{dragHint}</span>
                            <span className="font-mono">
                              {activeIndex + 1}/{frameCount}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
                            <motion.div
                              animate={{ width: `${spinProgress}%` }}
                              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-black"
                            />
                          </div>
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
