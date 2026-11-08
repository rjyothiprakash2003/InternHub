import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeProfileCompletion } from "@/lib/profile-completion";
import { STUDENT_JOURNEY } from "@/lib/constants";
import { titleCaseStatus } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Student Dashboard" };

export default async function StudentDashboardPage() {
  const { user } = await requireStudent();
  const [profile, applications, payments, certificates, documents, notifications] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: user.id } }),
    prisma.application.findMany({ where: { userId: user.id, deletedAt: null }, include: { domain: true, internship: true }, orderBy: { createdAt: "desc" } }),
    prisma.payment.findMany({ where: { userId: user.id } }),
    prisma.certificate.findMany({ where: { application: { userId: user.id } } }),
    prisma.document.findMany({ where: { userId: user.id } }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const completion = computeProfileCompletion(user.name, profile);
  const active = applications.find((app) => !["COMPLETED", "CERTIFICATE_GENERATED", "REJECTED", "CANCELLED"].includes(app.status));

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Welcome, {user.name}</h1>
      <p className="mt-2 text-slate-600">Profile {completion.percent}% complete · {completion.stage}</p>
      <div className="mt-2 h-2 max-w-md overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-[linear-gradient(90deg,#2F6FED,#6E4BFF)]" style={{ width: `${completion.percent}%` }} />
      </div>
      {completion.missing.length ? (
        <p className="mt-3 text-sm text-amber-700">Add: {completion.missing.join(", ")}</p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Active Internship", active?.internship.title ?? "None", "/dashboard/progress"],
          ["Applications", String(applications.length), "/dashboard/applications"],
          ["Completed Internships", String(applications.filter((a) => a.status === "CERTIFICATE_GENERATED" || a.status === "COMPLETED").length), "/dashboard/progress"],
          ["Certificates", String(certificates.length), "/dashboard/certificates"],
          ["Payments", String(payments.length), "/dashboard/payments"],
          ["Documents", String(documents.length), "/dashboard/documents"],
        ].map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ih-navy)]">{value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-3xl bg-white p-6">
        <h2 className="font-semibold text-[var(--ih-navy)]">Application status tracker</h2>
        {active ? (
          <ol className="mt-6 grid gap-3 md:grid-cols-4">
            {STUDENT_JOURNEY.map((step) => {
              const currentIndex = STUDENT_JOURNEY.findIndex((item) => item.key === active.status);
              const stepIndex = STUDENT_JOURNEY.findIndex((item) => item.key === step.key);
              const done = currentIndex >= stepIndex && currentIndex !== -1;
              return (
                <li key={step.key} className={`rounded-2xl px-3 py-3 text-sm ${done ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"}`}>
                  {step.label}
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="mt-4">
            <EmptyState title="You haven't applied for any internship yet." action={<Link href="/internships">Explore Internships</Link>} />
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6">
        <h2 className="font-semibold">Upcoming milestones</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {active ? (
            <>
              <li>Current status: {titleCaseStatus(active.status)}</li>
              <li>Start date: {active.startDate.toDateString()}</li>
              <li>End date: {active.endDate.toDateString()}</li>
            </>
          ) : (
            <li>Complete your profile, then submit an application.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
