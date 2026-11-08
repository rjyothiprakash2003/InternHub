import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { titleCaseStatus, formatINR, formatDate } from "@/lib/utils";
import { PriceBreakdown } from "@/components/home/interactive";
import { startPaymentAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { STUDENT_JOURNEY } from "@/lib/constants";

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireStudent();
  const application = await prisma.application.findFirst({
    where: { id, userId: user.id },
    include: { internship: true, domain: true, payments: true, offerLetter: true, certificate: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  });
  if (!application) notFound();
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl bg-white p-6">
        <p className="text-xs uppercase tracking-wider text-slate-400">{application.publicId}</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--ih-navy)]">{application.internship.title}</h1>
        <p className="mt-2 text-slate-600">{application.domain.name} · {application.durationKey} · {titleCaseStatus(application.status)}</p>
        <dl className="mt-6 grid gap-3 text-sm md:grid-cols-2">
          <div><dt className="text-slate-400">Start</dt><dd>{formatDate(application.startDate)}</dd></div>
          <div><dt className="text-slate-400">End</dt><dd>{formatDate(application.endDate)}</dd></div>
          <div><dt className="text-slate-400">College</dt><dd>{application.college}</dd></div>
          <div><dt className="text-slate-400">Mode</dt><dd>{application.mode}</dd></div>
        </dl>
        <ol className="mt-8 space-y-2 text-sm">
          {application.statusHistory.map((item) => (
            <li key={item.id}>{titleCaseStatus(item.toStatus)} · {formatDate(item.createdAt)}</li>
          ))}
        </ol>
        {!["PAYMENT_COMPLETED", "OFFER_LETTER_GENERATED", "INTERNSHIP_STARTED", "IN_PROGRESS", "COMPLETED", "CERTIFICATE_ELIGIBLE", "CERTIFICATE_GENERATED"].includes(application.status) ? (
          <form action={startPaymentAction.bind(null, application.id)} className="mt-6">
            <Button type="submit" variant="primary">Continue to payment</Button>
          </form>
        ) : null}
      </div>
      <PriceBreakdown
        originalPrice={application.originalPrice}
        discountPercent={application.discountPercent}
        discountAmount={application.discountAmount}
        totalAmount={application.finalAmount}
      />
    </div>
  );
}
