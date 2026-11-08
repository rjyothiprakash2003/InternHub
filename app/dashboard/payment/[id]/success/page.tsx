import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireStudent();
  const payment = await prisma.payment.findFirst({ where: { id, userId: user.id } });
  if (!payment) notFound();
  return (
    <div className="rounded-3xl bg-white p-10 text-center">
      <h1 className="text-3xl font-semibold text-emerald-700">Payment successful</h1>
      <p className="mt-3 text-slate-600">Transaction {payment.publicId} · Invoice {payment.invoiceNumber}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="primary"><Link href="/dashboard/applications">View application</Link></Button>
        <Button asChild variant="secondary"><Link href="/dashboard/payments">Payment history</Link></Button>
      </div>
    </div>
  );
}
