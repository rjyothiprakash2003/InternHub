import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";

export const metadata = { title: "About InternHub" };

export default async function AboutPage() {
  const content = Object.fromEntries((await prisma.websiteContent.findMany()).map((row) => [row.key, row.value]));
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="About" title="Who we are" description={content.about_who} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            ["What we do", content.about_what],
            ["Why InternHub exists", content.about_why],
            ["Our mission", content.mission],
            ["Our vision", content.vision],
          ].map(([title, body]) => (
            <section key={title} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--ih-navy)]">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{body}</p>
            </section>
          ))}
        </div>
        <section className="mt-8 rounded-3xl bg-white p-6">
          <h2 className="text-xl font-semibold text-[var(--ih-navy)]">Our values</h2>
          <ul className="mt-4 grid gap-3 text-slate-600 md:grid-cols-2">
            <li>Student-first approach</li>
            <li>Practical learning</li>
            <li>Accessibility</li>
            <li>Professional growth</li>
            <li>Trust and transparency</li>
          </ul>
        </section>
      </div>
    </PublicShell>
  );
}
