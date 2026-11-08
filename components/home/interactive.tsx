"use client";

import { useEffect, useState } from "react";

export function Countdown({ endsAt }: { endsAt: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className="h-16 animate-pulse rounded-2xl bg-white/10" />;

  const end = new Date(endsAt);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const items = [
    ["Days", days],
    ["Hours", hours],
    ["Minutes", minutes],
    ["Seconds", seconds],
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2" aria-label="Promotion countdown">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-white/10 px-2 py-3 text-center">
          <div className="text-xl font-semibold text-white sm:text-2xl">{String(value).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/70">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function PriceBreakdown({
  originalPrice,
  discountPercent,
  discountAmount,
  totalAmount,
}: {
  originalPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="bg-[linear-gradient(135deg,#071529,#163a6b)] px-5 py-4 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Price breakdown</p>
        <p className="mt-1 text-2xl font-semibold">You Pay: ₹{totalAmount}</p>
      </div>
      <dl className="divide-y divide-slate-100 text-sm">
        <div className="flex items-center justify-between px-5 py-3">
          <dt>Original Price</dt>
          <dd className="font-medium">₹{originalPrice}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-emerald-700">
          <dt>{discountPercent}% OFF</dt>
          <dd className="font-medium">-₹{discountAmount}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-4 text-base font-semibold text-[var(--ih-navy)]">
          <dt>You Pay</dt>
          <dd>₹{totalAmount}</dd>
        </div>
      </dl>
    </div>
  );
}
