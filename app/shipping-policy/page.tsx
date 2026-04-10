'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';

const shippingContent = {
  en: {
    backHome: 'Back Home',
    section: 'Customer Care',
    title: 'Shipping Policy',
    description: 'Delivery details for standard DXLR orders, sale periods, and seasonal drops.',
    points: [
      'Orders are typically processed within 1 to 2 business days before dispatch.',
      'Cairo deliveries usually arrive faster, while nationwide shipping may take 2 to 5 business days depending on destination.',
      'A tracking update is shared once the shipment is handed to the courier.',
      'During drop periods, sale windows, or holidays, dispatch may take slightly longer than usual.',
    ],
  },
  ar: {
    backHome: 'العودة للرئيسية',
    section: 'خدمة العملاء',
    title: 'سياسة الشحن',
    description: 'كل ما تحتاج معرفته عن شحن طلبات DXLR العادية وفترات الدروب والمواسم.',
    points: [
      'يتم تجهيز الطلبات غالبًا خلال يوم إلى يومي عمل قبل تسليمها لشركة الشحن.',
      'التوصيل داخل القاهرة يكون أسرع عادة، بينما قد يستغرق الشحن لباقي المحافظات من يومين إلى خمسة أيام عمل حسب الوجهة.',
      'سيتم إرسال تحديث التتبع بمجرد تسليم الشحنة إلى شركة الشحن.',
      'خلال فترات الدروب أو التخفيضات أو الإجازات قد يستغرق تجهيز الطلب وقتًا أطول قليلًا من المعتاد.',
    ],
  },
} as const;

export default function ShippingPolicyPage() {
  const locale = useLocaleStore((state) => state.locale);
  const isArabic = locale === 'ar';
  const content = shippingContent[locale];

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
