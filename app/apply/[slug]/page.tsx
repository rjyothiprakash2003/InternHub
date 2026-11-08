import { prisma } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { ApplicationForm } from "@/components/apply/application-form";
import { notFound } from "next/navigation";

export const metadata = { title: "Internship Application" };

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user } = await requireStudent();
  const internship = await prisma.internship.findFirst({
    where: { slug, isActive: true, deletedAt: null },
    include: { domain: true },
  });
  if (!internship) notFound();
  const [internships, domains, durations, plans, profile] = await Promise.all([
    prisma.internship.findMany({ where: { isActive: true, deletedAt: null }, select: { id: true, title: true, domainId: true } }),
    prisma.domain.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { name: "asc" } }),
    prisma.durationRule.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.pricingPlan.findMany({ where: { isActive: true } }),
    prisma.studentProfile.findUnique({ where: { userId: user.id } }),
  ]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Apply for {internship.title}</h1>
      <p className="mt-2 text-slate-600">Domain and duration must be selected from approved lists. End date is calculated automatically.</p>
      <div className="mt-8">
        <ApplicationForm
          internships={internships}
          domains={domains}
          durations={durations}
          plans={plans}
          defaults={{
            internshipId: internship.id,
            domainId: internship.domainId,
            name: user.name,
            email: user.email,
            mobile: user.mobile ?? "",
            college: profile?.college ?? "",
            course: profile?.course ?? "",
            branch: profile?.branch ?? "",
            graduationYear: profile?.graduationYear ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
