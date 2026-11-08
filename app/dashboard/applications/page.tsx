import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { titleCaseStatus, formatINR } from "@/lib/utils";

export default async function ApplicationsPage() {
  const { user } = await requireStudent();
  const applications = await prisma.application.findMany({
    where: { userId: user.id, deletedAt: null },
    include: { internship: true, domain: true },
    orderBy: { createdAt: "desc" },
  });
  if (!applications.length) {
    return <EmptyState title="You haven't applied for any internship yet." action={<Link href="/internships">Explore Internships</Link>} />;
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">My applications</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Internship</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="px-4 py-3">
                  <Link className="font-medium text-[var(--ih-blue)]" href={`/dashboard/applications/${app.id}`}>{app.publicId}</Link>
                </td>
                <td className="px-4 py-3">{app.internship.title}</td>
                <td className="px-4 py-3">{app.durationKey}</td>
                <td className="px-4 py-3">{formatINR(app.finalAmount)}</td>
                <td className="px-4 py-3">{titleCaseStatus(app.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
