import Link from "next/link";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatINR, parseJsonArray } from "@/lib/utils";
import { calculatePrice } from "@/lib/pricing";

export function InternshipCard({
  internship,
  plan,
}: {
  internship: {
    title: string;
    slug: string;
    level: string;
    mode: string;
    skills: string;
    includes: string;
    domain: { name: string; slug: string };
  };
  plan: { originalPrice: number; promotionalPrice: number; discountPercent: number; duration: { label: string } };
}) {
  const price = calculatePrice({
    originalPrice: plan.originalPrice,
    promotionalPrice: plan.promotionalPrice,
  });
  const skills = parseJsonArray(internship.skills).slice(0, 8);
  const includes = parseJsonArray(internship.includes);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(7,21,41,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(7,21,41,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ih-blue)]">{internship.domain.name}</p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--ih-navy)]">{internship.title}</h3>
        </div>
        <Badge tone="slate">{internship.level}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Duration</dt>
          <dd>{plan.duration.label}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Mode</dt>
          <dd>{internship.mode}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            {skill}
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-1 text-sm text-slate-600">
        {includes.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <p className="text-sm text-slate-400 line-through">{formatINR(price.originalPrice)}</p>
        <p className="text-2xl font-semibold text-[var(--ih-navy)]">
          {formatINR(price.finalPrice)}{" "}
          <span className="text-sm font-medium text-emerald-600">{price.discountPercent}% OFF</span>
        </p>
        <p className="text-xs text-slate-500">Promotional final price</p>
        <Button asChild variant="primary" className="mt-4 w-full">
          <Link href={`/apply/${internship.slug}`}>Apply Now</Link>
        </Button>
      </div>
    </article>
  );
}

export function DomainCard({
  domain,
  programCount,
}: {
  domain: {
    slug: string;
    name: string;
    shortDescription: string;
    skills: string;
    durationHint: string;
  };
  programCount: number;
}) {
  const skills = parseJsonArray(domain.skills);
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-[var(--ih-navy)]">{domain.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{domain.shortDescription}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Skills covered</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
            {skill}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">Duration: {domain.durationHint}</p>
      <p className="text-sm text-slate-500">Available programs: {programCount}</p>
      <Button asChild className="mt-5 w-full" variant="secondary">
        <Link href={`/internships/${domain.slug}`}>View Internship</Link>
      </Button>
    </article>
  );
}

export function PriceCard({
  plan,
}: {
  plan: {
    originalPrice: number;
    promotionalPrice: number;
    discountPercent: number;
    duration: { key: string; label: string };
  };
}) {
  const price = calculatePrice({
    originalPrice: plan.originalPrice,
    promotionalPrice: plan.promotionalPrice,
  });
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--ih-navy)]">{plan.duration.label}</h3>
      <p className="mt-3 text-sm text-slate-400 line-through">{formatINR(price.originalPrice)}</p>
      <p className="text-4xl font-semibold tracking-tight text-[var(--ih-navy)]">{formatINR(price.finalPrice)}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-600">{price.discountPercent}% OFF</p>
      <p className="mt-1 text-xs text-slate-500">Promotional / final price</p>
      <Button asChild variant="primary" className="mt-5 w-full">
        <Link href={`/internships?duration=${plan.duration.key}`}>Apply Now</Link>
      </Button>
    </article>
  );
}
