import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { PriceCard } from "@/components/catalog/cards";
import { prisma } from "@/lib/db";
import { calculatePrice } from "@/lib/pricing";
import { PriceBreakdown } from "@/components/home/interactive";

export const metadata = { title: "Pricing" };

export default async function PricingPage() {
  const plans = await prisma.pricingPlan.findMany({
    where: { isActive: true },
    include: { duration: true },
    orderBy: { duration: { sortOrder: "asc" } },
  });
  const example = plans.find((plan) => plan.durationKey === "3-months") ?? plans[0];
  const breakdown = example
    ? calculatePrice({ originalPrice: example.originalPrice, promotionalPrice: example.promotionalPrice })
    : null;

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="Pricing"
          title="50% OFF for new students"
          description="Prices are loaded from the admin pricing engine. Cards show promotional/final prices, not a second discount."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {plans.map((plan) => (
            <PriceCard key={plan.id} plan={plan} />
          ))}
        </div>
        {breakdown ? (
          <div className="mx-auto mt-12 max-w-md">
            <h2 className="mb-4 text-center text-xl font-semibold text-[var(--ih-navy)]">Example: 3 Months</h2>
            <PriceBreakdown
              originalPrice={breakdown.originalPrice}
              discountPercent={breakdown.discountPercent}
              discountAmount={breakdown.discountAmount}
              totalAmount={breakdown.totalAmount}
            />
          </div>
        ) : null}
      </div>
    </PublicShell>
  );
}
