import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { formatINR, formatDateTime, titleCaseStatus } from "@/lib/utils";

export default async function PaymentHistoryPage() {
  const { user } = await requireStudent();
  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    include: { application: { include: { internship: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!payments.length) return <EmptyState title="No payment history." />;
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Payment history</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Internship</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Refund</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="px-4 py-3">{payment.publicId}</td>
                <td className="px-4 py-3">{formatDateTime(payment.createdAt)}</td>
                <td className="px-4 py-3">{payment.application.internship.title}</td>
                <td className="px-4 py-3">{payment.application.durationKey}</td>
                <td className="px-4 py-3">{formatINR(payment.amount)}</td>
                <td className="px-4 py-3">{titleCaseStatus(payment.status)}</td>
                <td className="px-4 py-3">{payment.invoiceNumber}</td>
                <td className="px-4 py-3">{payment.refundStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
