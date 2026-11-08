import Link from "next/link";
import { prisma } from "@/lib/db";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { DomainCard, InternshipCard, PriceCard } from "@/components/catalog/cards";
import { Countdown } from "@/components/home/interactive";
import { AccreditationPlaceholders, HeroArt } from "@/components/home/visuals";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/disclosure";
import {
  BENEFITS,
  HOW_IT_WORKS,
  MISSION_CARDS,
  TRUST_ITEMS,
  VISION_MILESTONES,
} from "@/lib/constants";
import { isEnabled } from "@/lib/settings";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default async function HomePage() {
  const [settingsRows, domains, internships, plans, faqs, testimonials, contentRows] = await Promise.all([
    prisma.systemSetting.findMany(),
    prisma.domain.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: "asc" }, take: 12, include: { internships: true } }),
    prisma.internship.findMany({ where: { isActive: true, isFeatured: true, deletedAt: null }, include: { domain: true }, take: 8 }),
    prisma.pricingPlan.findMany({ where: { isActive: true }, include: { duration: true }, orderBy: { duration: { sortOrder: "asc" } } }),
    prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { isActive: true }, include: { domain: true }, orderBy: { sortOrder: "asc" } }),
    prisma.websiteContent.findMany(),
  ]);
  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]));
  const content = Object.fromEntries(contentRows.map((s) => [s.key, s.value]));
  const defaultPlan = plans[3] ?? plans[0];

  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#071529_0%,#0d2748_55%,#163a6b_100%)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              {settings.tagline ?? "Learn. Intern. Build Your Future."}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {settings.hero_headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75">{settings.hero_subtext}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/internships">Explore Internships</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/internships">View Programs</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
              <span>Offer letter</span>
              <span>Completion certificate</span>
              <span>QR verification</span>
              <span>Student dashboard</span>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      {isEnabled(settings.promo_enabled) ? (
        <section className="bg-[#0b1f3a] py-10">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{settings.promo_kicker}</p>
              <h2 className="mt-2 text-3xl font-semibold">{settings.promo_headline}</h2>
              <p className="mt-3 text-white/70">{settings.promo_subtext}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild variant="primary">
                  <Link href="/pricing">{settings.promo_cta ?? "Claim Your Internship"}</Link>
                </Button>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ih-navy)]">
                  {settings.starting_price_label}
                </span>
              </div>
            </div>
            {settings.promo_countdown_end ? <Countdown endsAt={settings.promo_countdown_end} /> : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ih-blue)]">Trust</p>
        <h2 className="mt-2 text-3xl font-semibold text-[var(--ih-navy)]">A professional internship journey, documented clearly</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-[var(--ih-navy)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <AccreditationPlaceholders
            aicteEnabled={isEnabled(settings.aicte_badge_enabled)}
            isoEnabled={isEnabled(settings.iso_badge_enabled)}
            aicteLabel={settings.aicte_label ?? "AICTE Information"}
            isoLabel={settings.iso_label ?? "Certification / Quality Information"}
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ih-blue)]">Domains</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--ih-navy)]">Explore internship domains</h2>
            </div>
            <Link href="/domains" className="hidden items-center gap-1 text-sm font-semibold text-[var(--ih-blue)] sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} programCount={domain.internships.length} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold text-[var(--ih-navy)]">Popular internships</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {internships.map((internship) =>
            defaultPlan ? <InternshipCard key={internship.id} internship={internship} plan={defaultPlan} /> : null,
          )}
        </div>
      </section>

      <section className="bg-[#071529] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold">How InternHub works</h2>
          <ol className="mt-10 hidden gap-4 lg:grid lg:grid-cols-6">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.step} className="relative rounded-3xl bg-white/5 p-5">
                <span className="text-sm font-semibold text-cyan-300">Step {step.step}</span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/70">{step.description}</p>
              </li>
            ))}
          </ol>
          <ol className="mt-8 space-y-4 lg:hidden">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.step} className="rounded-3xl bg-white/5 p-5">
                <span className="text-sm font-semibold text-cyan-300">Step {step.step}</span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/70">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold text-[var(--ih-navy)]">Benefits for students</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-[var(--ih-navy)]">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ih-blue)]">Mission</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--ih-navy)]">Why InternHub exists</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{content.mission}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {MISSION_CARDS.map((card) => (
                <div key={card.title} className="rounded-2xl bg-[var(--ih-canvas)] p-4">
                  <h3 className="font-semibold text-[var(--ih-navy)]">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ih-blue)]">Vision</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--ih-navy)]">A trusted student career platform</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{content.vision}</p>
            <ol className="mt-6 space-y-4 border-l border-slate-200 pl-6">
              {VISION_MILESTONES.map((item) => (
                <li key={item.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ih-blue)]">{item.year}</p>
                  <h3 className="font-semibold text-[var(--ih-navy)]">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold text-[var(--ih-navy)]">Why InternHub</h2>
        <ul className="mt-6 grid gap-3 text-slate-700 md:grid-cols-2">
          {[
            "One account for internships, payments, documents, and verification",
            "Admin-configurable pricing, discounts, domains, and website content",
            "No fabricated approvals, placements, or partnership claims",
            "Certificates issued only after completion is recorded",
          ].map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl bg-white p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-[var(--ih-navy)]">Promotional pricing</h2>
            <Link href="/pricing" className="text-sm font-semibold text-[var(--ih-blue)]">
              Full pricing
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-500">These amounts are promotional final prices configured by admin, not a second 50% off.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {plans.map((plan) => (
              <PriceCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold text-[var(--ih-navy)]">Student journey</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Home → Explore → Domain → Program → Duration → Register → Profile → Apply → Review → Price → Discount → Payment → Offer letter → Internship → Certificate → Verify
        </p>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold text-[var(--ih-navy)]">Student stories</h2>
          <p className="mt-2 text-sm text-amber-700">Sample CMS content for demonstration. These are not real affiliations or verified student identities.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote key={item.id} className="rounded-3xl border border-slate-200 p-6">
                <p className="text-slate-700">“{item.quote}”</p>
                <footer className="mt-4 text-sm text-slate-500">
                  {item.name} · {item.college} · {item.domain?.name} · {item.duration}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-semibold text-[var(--ih-navy)]">FAQ</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="bg-[linear-gradient(135deg,#071529,#2f6fed)] py-16 text-center text-white">
        <h2 className="text-3xl font-semibold">Start your internship with InternHub</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/75">Create a student account, choose a domain, and follow a documented path from application to certificate.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/login?tab=register">Create Student Account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/verify/certificate">Verify Certificate</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}
