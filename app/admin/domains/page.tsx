import { prisma } from "@/lib/db";
import { upsertDomainAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function AdminDomainsPage() {
  const domains = await prisma.domain.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-3xl bg-white p-5">
        <h1 className="text-2xl font-semibold">Domains</h1>
        <ul className="mt-4 space-y-2 text-sm">
          {domains.map((domain) => (
            <li key={domain.id} className="rounded-2xl bg-slate-50 px-4 py-3">{domain.name} · {domain.isActive ? "Active" : "Hidden"}</li>
          ))}
        </ul>
      </div>
      <form action={upsertDomainAction} className="space-y-3 rounded-3xl bg-white p-5">
        <h2 className="font-semibold">Add / update domain</h2>
        <Label>Name</Label><Input name="name" required />
        <Label>Short description</Label><Textarea name="shortDescription" />
        <Label>Skills (comma separated)</Label><Input name="skills" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
        <Button type="submit" variant="primary">Save domain</Button>
      </form>
    </div>
  );
}
