import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { isEnabled } from "@/lib/settings";
import Link from "next/link";

export const metadata = { title: "Offers" };

export default async function OffersPage() {
  const settings = Object.fromEntries((await prisma.systemSetting.findMany()).map((row) => [row.key, row.value]));
  return (
    <PublicShell>
      <section className="bg-[linear-gradient(135deg,#071529,#6e4bff)] py-20 text-center text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{settings.promo_kicker}</p>
        <h1 className="mt-3 text-4xl font-semibold">Your Career Journey Starts Here</h1>
        <p className="mt-4 text-3xl font-semibold">50% OFF</p>
        <p className="mx-auto mt-3 max-w-xl text-white/75">{settings.promo_subtext}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/internships">{isEnabled(settings.promo_enabled) ? settings.promo_cta : "Explore Internships"}</Link>
          </Button>
          <span className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-[var(--ih-navy)]">
            {settings.starting_price_label}
          </span>
        </div>
      </section>
    </PublicShell>
  );
}
