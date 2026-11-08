import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PublicShell } from "@/components/layout/public-shell";
import { InternshipCard } from "@/components/catalog/cards";
import { parseJsonArray } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const domain = await prisma.domain.findUnique({ where: { slug } });
  return {
    title: domain ? `${domain.name} Internship` : "Internship",
    description: domain?.shortDescription,
  };
}

export default async function DomainInternshipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const domain = await prisma.domain.findUnique({
    where: { slug },
    include: { internships: { where: { isActive: true, deletedAt: null } } },
  });
  if (!domain) notFound();
  const plan = await prisma.pricingPlan.findFirst({ where: { isActive: true, durationKey: "3-months" }, include: { duration: true } });
  const internship = domain.internships[0];
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ih-blue)]">Domain</p>
        <h1 className="mt-2 text-4xl font-semibold text-[var(--ih-navy)]">{domain.name}</h1>
        <p className="mt-4 max-w-2xl text-slate-600">{domain.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {parseJsonArray(domain.skills).map((skill) => (
            <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{skill}</span>
          ))}
        </div>
        <div className="mt-10 max-w-md">
          {internship && plan ? <InternshipCard internship={{ ...internship, domain }} plan={plan} /> : <p>No active program in this domain yet.</p>}
        </div>
      </div>
    </PublicShell>
  );
}
