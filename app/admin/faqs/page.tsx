import { prisma } from "@/lib/db";
import { upsertFaqAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="text-3xl font-semibold">FAQs</h1>
      <ul className="mt-4 space-y-2 text-sm">
        {faqs.map((faq) => <li key={faq.id} className="rounded-2xl bg-white px-4 py-3">{faq.question}</li>)}
      </ul>
      <form action={upsertFaqAction} className="mt-6 max-w-lg space-y-3 rounded-3xl bg-white p-5">
        <Label>Question</Label><Input name="question" required />
        <Label>Answer</Label><Textarea name="answer" required />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
        <Button type="submit">Save FAQ</Button>
      </form>
    </div>
  );
}
