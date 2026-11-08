import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader, EmptyState } from "@/components/ui/empty-state";
import { InternshipCard } from "@/components/catalog/cards";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Internships" };

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; q?: string; duration?: string }>;
}) {
  const params = await searchParams;
  const internships = await prisma.internship.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      domain: params.domain ? { slug: params.domain } : undefined,
      title: params.q ? { contains: params.q } : undefined,
    },
    include: { domain: true },
    orderBy: { title: "asc" },
  });
  const plan = await prisma.pricingPlan.findFirst({
    where: { isActive: true, durationKey: params.duration ?? "3-months" },
    include: { duration: true },
  }) ?? await prisma.pricingPlan.findFirst({ where: { isActive: true }, include: { duration: true } });

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="Internships"
          title="Structured programs with transparent documentation"
          description="Filter by domain, then apply with a duration selected from approved admin rules."
        />
        <form className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search internships"
            className="h-11 flex-1 rounded-full border border-slate-200 px-4"
          />
          <button className="h-11 rounded-full bg-[var(--ih-navy)] px-5 text-sm font-semibold text-white">Search</button>
        </form>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plan
            ? internships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} plan={plan} />
              ))
            : null}
        </div>
        {internships.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="No internships found." description="Try another search or browse all domains." action={<Link href="/domains">View domains</Link>} />
          </div>
        ) : null}
      </div>
    </PublicShell>
  );
}
