import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { DomainCard } from "@/components/catalog/cards";
import { prisma } from "@/lib/db";

export const metadata = { title: "Internship Domains" };

export default async function DomainsPage() {
  const domains = await prisma.domain.findMany({
    where: { isActive: true, deletedAt: null },
    include: { internships: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="Domains"
          title="Choose a career direction"
          description="Domains are managed by administrators. Applications only accept approved domain dropdown values."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} programCount={domain.internships.length} />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
