import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { STUDENT_JOURNEY } from "@/lib/constants";
import { titleCaseStatus, formatDate } from "@/lib/utils";

export default async function ProgressPage() {
  const { user } = await requireStudent();
  const application = await prisma.application.findFirst({
    where: { userId: user.id, deletedAt: null },
    include: { internship: true },
    orderBy: { createdAt: "desc" },
  });
  if (!application) return <EmptyState title="No internship progress to show." />;
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Internship progress</h1>
      <p className="mt-2 text-slate-600">{application.internship.title} · {titleCaseStatus(application.status)}</p>
      <p className="text-sm text-slate-500">{formatDate(application.startDate)} — {formatDate(application.endDate)}</p>
      <ol className="mt-8 space-y-3">
        {STUDENT_JOURNEY.map((step, index) => (
          <li key={step.key} className="rounded-2xl bg-white px-4 py-3">
            {index + 1}. {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
