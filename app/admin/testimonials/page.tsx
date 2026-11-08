import { prisma } from "@/lib/db";
import { upsertTestimonialAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Testimonials</h1>
      <p className="mt-2 text-sm text-amber-700">Keep sample stories labeled. Do not present unverified people as real students.</p>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((item) => <li key={item.id} className="rounded-2xl bg-white px-4 py-3">{item.name} · {item.college} {item.isSample ? "(sample)" : ""}</li>)}
      </ul>
      <form action={upsertTestimonialAction} className="mt-6 max-w-lg space-y-3 rounded-3xl bg-white p-5">
        <Label>Name</Label><Input name="name" required />
        <Label>College</Label><Input name="college" required />
        <Label>Duration</Label><Input name="duration" required />
        <Label>Quote</Label><Textarea name="quote" required />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isSample" defaultChecked /> Sample content</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
