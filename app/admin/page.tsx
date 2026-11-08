import { prisma } from "@/lib/db";
import { SimpleBars } from "@/components/admin/charts";
import { formatINR } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminHome() {
  const [students, applications, payments, certificates, domains] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", deletedAt: null } }),
    prisma.application.findMany({ include: { domain: true } }),
    prisma.payment.findMany(),
    prisma.certificate.count(),
    prisma.domain.findMany({ include: { applications: true } }),
  ]);
  const paid = payments.filter((p) => p.status === "SUCCESS");
  const revenue = paid.reduce((sum, p) => sum + p.amount, 0);
  const pending = applications.filter((a) => ["SUBMITTED", "UNDER_REVIEW", "PAYMENT_PENDING"].includes(a.status)).length;
  const conversion = applications.length ? Math.round((paid.length / applications.length) * 100) : 0;
  const domainPopularity = domains.map((d) => ({ name: d.name.split(" ")[0], value: d.applications.length }));
  const statusData = Object.entries(
    applications.reduce<Record<string, number>>((acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name: name.replaceAll("_", " "), value }));

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Operations overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Students", students],
          ["Applications", applications.length],
          ["Paid Applications", paid.length],
          ["Revenue", formatINR(revenue)],
          ["Certificates Issued", certificates],
          ["Pending Applications", pending],
          ["Conversion Rate", `${conversion}%`],
          ["Refunds", payments.filter((p) => p.refundStatus !== "NONE").length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ih-navy)]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-5">
          <h2 className="mb-4 font-semibold">Domain popularity</h2>
          <SimpleBars data={domainPopularity.slice(0, 8)} />
        </section>
        <section className="rounded-3xl bg-white p-5">
          <h2 className="mb-4 font-semibold">Application status</h2>
          <SimpleBars data={statusData} />
        </section>
      </div>
    </div>
  );
}
