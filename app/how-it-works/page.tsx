import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { HOW_IT_WORKS } from "@/lib/constants";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Process" title="How InternHub works" description="A six-step path from account creation to verified certificate." />
        <ol className="mt-10 hidden grid-cols-6 gap-4 lg:grid">
          {HOW_IT_WORKS.map((step) => (
            <li key={step.step} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-[var(--ih-blue)]">Step {step.step}</p>
              <h2 className="mt-2 font-semibold text-[var(--ih-navy)]">{step.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
        <ol className="mt-8 space-y-4 lg:hidden">
          {HOW_IT_WORKS.map((step) => (
            <li key={step.step} className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-[var(--ih-blue)]">Step {step.step}</p>
              <h2 className="mt-2 font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </PublicShell>
  );
}
