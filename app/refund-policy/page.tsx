'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';

const refundContent = {
  en: {
    backHome: 'Back Home',
    section: 'Customer Care',
    title: 'Refund Policy',
    description:
      'A simple return policy designed to keep the DXLR experience clear, calm, and easy.',
    points: [
      'Returns are accepted within 7 days from delivery if the item is unworn and in its original condition.',
      'Pieces must be returned with original packaging and tags still attached.',
      'Refunds are issued after the item passes quality review and are sent back through the original payment method when possible.',
      'Final-sale or promotional drops may be exchange-only unless stated otherwise.',
    ],
  },
  ar: {
    backHome: 'العودة للرئيسية',
    section: 'خدمة العملاء',
    title: 'سياسة الاسترجاع',
    description: 'سياسة استرجاع بسيطة وواضحة تحافظ على تجربة DXLR هادئة وسهلة.',
    points: [
      'يمكن طلب الاسترجاع خلال 7 أيام من تاريخ الاستلام بشرط أن تكون القطعة غير مستخدمة وبحالتها الأصلية.',
      'يجب إعادة القطع بنفس التغليف الأصلي مع وجود جميع التاجات والملصقات.',
      'يتم رد المبلغ بعد مراجعة حالة المنتج، ويعود عبر نفس وسيلة الدفع الأصلية كلما كان ذلك ممكنًا.',
      'القطع المخفضة أو الإصدارات الخاصة قد تكون للاستبدال فقط إذا تم توضيح ذلك وقت الشراء.',
    ],
  },
} as const;

export default function RefundPolicyPage() {
  const locale = useLocaleStore((state) => state.locale);
  const isArabic = locale === 'ar';
  const content = refundContent[locale];

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[var(--surface)] px-4 pb-20 pt-28 text-black md:px-6 md:pt-32"
    >
      <div className="mx-auto max-w-4xl rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-10">
        <Link
          href="/"
          className={`mb-6 inline-flex items-center gap-2 text-[10px] font-bold text-[var(--foreground-soft)] transition hover:text-black ${
            isArabic ? 'tracking-normal' : 'uppercase tracking-[0.28em]'
          }`}
        >
          <ArrowLeft size={14} className={isArabic ? 'rotate-180' : ''} />
          {content.backHome}
        </Link>

        <p
          className={`text-[10px] font-mono text-[var(--foreground-soft)] ${
            isArabic ? 'tracking-[0.14em]' : 'uppercase tracking-[0.35em]'
          }`}
        >
          {content.section}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
          {content.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-soft)] md:text-base">
          {content.description}
        </p>

        <div className="mt-8 grid gap-4">
          {content.points.map((point) => (
            <div
              key={point}
              className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-5 py-4 text-sm leading-7 text-[var(--foreground-soft)] md:text-base"
            >
              {point}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
