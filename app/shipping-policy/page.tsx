import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const shippingPoints = [
  'Orders are typically processed within 1 to 2 business days before dispatch.',
  'Cairo deliveries usually arrive faster, while nationwide shipping may take 2 to 5 business days depending on destination.',
  'A tracking update is shared once the shipment is handed to the courier.',
  'During drop periods, sale windows, or holidays, dispatch may take slightly longer than usual.',
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 pb-20 pt-28 text-black md:px-6 md:pt-32">
      <div className="mx-auto max-w-4xl rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-soft)] transition hover:text-black"
        >
          <ArrowLeft size={14} />
          Back Home
        </Link>

        <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-soft)]">
          Customer Care
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
          Shipping Policy
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-soft)] md:text-base">
          Delivery details for standard DXLR orders, sale periods, and seasonal drops.
        </p>

        <div className="mt-8 grid gap-4">
          {shippingPoints.map((point) => (
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
