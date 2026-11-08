import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { completeDemoPaymentAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { PriceBreakdown } from "@/components/home/interactive";

export const metadata = { title: "Payment" };

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireStudent();
  const payment = await prisma.payment.findFirst({
    where: { id, userId: user.id },
    include: { application: { include: { internship: true, domain: true } } },
  });
  if (!payment) notFound();
  const app = payment.application;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-6">
        <h1 className="text-2xl font-semibold text-[var(--ih-navy)]">Checkout</h1>
        <p className="mt-2 text-sm text-slate-500">Card details are never stored by InternHub. Razorpay can be connected later via environment variables.</p>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Internship</dt><dd>{app.internship.title}</dd></div>
          <div className="flex justify-between"><dt>Domain</dt><dd>{app.domain.name}</dd></div>
          <div className="flex justify-between"><dt>Duration</dt><dd>{app.durationKey}</dd></div>
          <div className="flex justify-between"><dt>Coupon</dt><dd>{app.couponCode ?? "—"}</dd></div>
          <div className="flex justify-between"><dt>Email</dt><dd>{app.email}</dd></div>
          <div className="flex justify-between"><dt>Mobile</dt><dd>{app.mobile}</dd></div>
        </dl>
        {payment.status === "PENDING" ? (
          <form action={completeDemoPaymentAction.bind(null, payment.id)} className="mt-8">
            <Button type="submit" variant="primary" className="w-full">Pay {formatINR(payment.amount)} (Demo Razorpay)</Button>
          </form>
        ) : (
          <p className="mt-8 font-semibold text-emerald-700">Payment {payment.status}</p>
        )}
      </div>
      <PriceBreakdown
        originalPrice={app.originalPrice}
        discountPercent={app.discountPercent}
        discountAmount={app.discountAmount}
        totalAmount={app.finalAmount}
      />
    </div>
  );
}
