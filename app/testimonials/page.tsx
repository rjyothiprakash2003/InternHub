import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ where: { isActive: true }, include: { domain: true }, orderBy: { sortOrder: "asc" } });
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Testimonials" title="Student stories" description="These entries are CMS-managed sample stories unless an administrator replaces them with authorized content." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <blockquote key={item.id} className="rounded-3xl bg-white p-6">
              {item.isSample ? <p className="text-xs font-semibold uppercase text-amber-600">Sample CMS content</p> : null}
              <p className="mt-2 text-slate-700">“{item.quote}”</p>
              <footer className="mt-4 text-sm text-slate-500">
                {item.name} · {item.college} · {item.domain?.name} · {item.duration} · {item.rating}/5
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
