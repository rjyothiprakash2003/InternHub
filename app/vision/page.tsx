import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { VISION_MILESTONES } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const metadata = { title: "Vision" };

export default async function VisionPage() {
  const vision = await prisma.websiteContent.findUnique({ where: { key: "vision" } });
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Vision" title="From education to employment with confidence" description={vision?.value} />
        <ol className="mt-10 space-y-6 border-l-2 border-[var(--ih-blue)] pl-6">
          {VISION_MILESTONES.map((item) => (
            <li key={item.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ih-blue)]">{item.year}</p>
              <h2 className="text-xl font-semibold text-[var(--ih-navy)]">{item.title}</h2>
              <p className="text-slate-600">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </PublicShell>
  );
}
