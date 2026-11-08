import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { BENEFITS } from "@/lib/constants";

export const metadata = { title: "Benefits" };

export default function BenefitsPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Benefits" title="What students receive from InternHub" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-[var(--ih-navy)]">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
