import { prisma } from "@/lib/db";
import { upsertInternshipAction, updatePricingAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function AdminInternshipsPage() {
  const [internships, domains, plans] = await Promise.all([
    prisma.internship.findMany({ where: { deletedAt: null }, include: { domain: true } }),
    prisma.domain.findMany({ where: { isActive: true, deletedAt: null } }),
    prisma.pricingPlan.findMany({ include: { duration: true }, orderBy: { duration: { sortOrder: "asc" } } }),
  ]);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Internships & pricing</h1>
      <div className="overflow-x-auto rounded-3xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500"><tr><th className="px-4 py-3">Title</th><th>Domain</th><th>Level</th><th>Active</th></tr></thead>
          <tbody>
            {internships.map((item) => (
              <tr key={item.id} className="border-t"><td className="px-4 py-3">{item.title}</td><td>{item.domain.name}</td><td>{item.level}</td><td>{item.isActive ? "Yes" : "No"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={upsertInternshipAction} className="grid gap-3 rounded-3xl bg-white p-5 md:grid-cols-2">
        <div className="md:col-span-2 font-semibold">Create internship</div>
        <div><Label>Title</Label><Input name="title" required /></div>
        <div>
          <Label>Domain</Label>
          <select name="domainId" className="h-11 w-full rounded-xl border px-3">
            {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Level</Label>
          <select name="level" className="h-11 w-full rounded-xl border px-3">
            <option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option>
          </select>
        </div>
        <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" /></div>
        <div className="md:col-span-2"><Label>Skills</Label><Input name="skills" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" /> Featured</label>
        <div className="md:col-span-2"><Button type="submit" variant="primary">Save internship</Button></div>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <form key={plan.id} action={updatePricingAction} className="rounded-3xl bg-white p-5 text-sm">
            <input type="hidden" name="id" value={plan.id} />
            <h3 className="font-semibold">{plan.duration.label}</h3>
            <Label>Original</Label><Input name="originalPrice" type="number" defaultValue={plan.originalPrice} />
            <Label>Promotional</Label><Input name="promotionalPrice" type="number" defaultValue={plan.promotionalPrice} />
            <Label>Discount %</Label><Input name="discountPercent" type="number" defaultValue={plan.discountPercent} />
            <label className="mt-2 flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={plan.isActive} /> Active</label>
            <Button className="mt-3" size="sm">Update price</Button>
          </form>
        ))}
      </div>
    </div>
  );
}
