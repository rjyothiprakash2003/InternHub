import { prisma } from "@/lib/db";
import { generateOfferLetterAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default async function AdminOffersPage() {
  const [offers, ready] = await Promise.all([
    prisma.offerLetter.findMany({ include: { application: true }, orderBy: { createdAt: "desc" } }),
    prisma.application.findMany({ where: { offerLetter: null, status: { in: ["PAYMENT_COMPLETED", "APPROVED"] } }, take: 20 }),
  ]);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Offer letters</h1>
      <ul className="mt-4 space-y-2 text-sm">
        {offers.map((o) => <li key={o.id} className="rounded-2xl bg-white px-4 py-3">{o.publicId} · {o.application.professionalName}</li>)}
      </ul>
      <h2 className="mt-8 font-semibold">Ready to generate</h2>
      <div className="mt-3 space-y-2">
        {ready.map((app) => (
          <form key={app.id} action={generateOfferLetterAction.bind(null, app.id)} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span>{app.publicId} · {app.professionalName}</span>
            <Button size="sm">Generate</Button>
          </form>
        ))}
      </div>
    </div>
  );
}
