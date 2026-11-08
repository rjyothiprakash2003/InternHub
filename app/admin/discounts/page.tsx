import { prisma } from "@/lib/db";
import { upsertDiscountAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-2">
        {discounts.map((d) => (
          <li key={d.id} className="rounded-2xl bg-white px-4 py-3 text-sm">{d.couponCode} · {d.name} · {d.percent}% · {d.isActive ? "Active" : "Inactive"} · uses {d.usedCount}/{d.maxUses ?? "∞"}</li>
        ))}
      </ul>
      <form action={upsertDiscountAction} className="space-y-3 rounded-3xl bg-white p-5">
        <h2 className="font-semibold">Create discount</h2>
        <Label>Name</Label><Input name="name" required />
        <Label>Coupon code</Label><Input name="couponCode" required />
        <Label>Percent</Label><Input name="percent" type="number" defaultValue={50} />
        <Label>Max uses</Label><Input name="maxUses" type="number" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
        <Button type="submit" variant="primary">Save</Button>
      </form>
    </div>
  );
}
