import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { MISSION_CARDS } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const metadata = { title: "Mission" };

export default async function MissionPage() {
  const mission = await prisma.websiteContent.findUnique({ where: { key: "mission" } });
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Mission" title="Accessible, structured, career-focused internships" description={mission?.value} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {MISSION_CARDS.map((card) => (
            <article key={card.title} className="rounded-3xl bg-white p-6">
              <h2 className="font-semibold text-[var(--ih-navy)]">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
