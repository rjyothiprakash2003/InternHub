import { prisma } from "@/lib/db";
import { formatINR, titleCaseStatus } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({ include: { user: true, application: { include: { internship: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Payments</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500"><tr><th className="px-4 py-3">ID</th><th>Student</th><th>Amount</th><th>Status</th><th>Invoice</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.publicId}</td>
                <td>{p.user.email}</td>
                <td>{formatINR(p.amount)}</td>
                <td>{titleCaseStatus(p.status)}</td>
                <td>{p.invoiceNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
