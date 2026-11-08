import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { contactAction } from "@/app/actions";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = Object.fromEntries(
    (await prisma.systemSetting.findMany({
      where: { key: { in: ["support_email", "business_email"] } },
    })).map((row) => [row.key, row.value]),
  );
  return (
    <PublicShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <PageHeader eyebrow="Contact" title="Talk to InternHub support" description="Use this form for product questions. Private administrator identities are not published." />
          <form action={contactAction} className="mt-8 space-y-4 rounded-3xl bg-white p-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input id="mobile" name="mobile" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required />
            </div>
            <Button type="submit" variant="primary">Send message</Button>
          </form>
        </div>
        <aside className="rounded-3xl bg-white p-6">
          <h2 className="font-semibold text-[var(--ih-navy)]">Support</h2>
          <p className="mt-2 text-sm text-slate-600">{settings.support_email}</p>
          <p className="mt-1 text-sm text-slate-600">{settings.business_email}</p>
          <Link href="/faq" className="mt-6 inline-block text-sm font-semibold text-[var(--ih-blue)]">
            Browse FAQs
          </Link>
        </aside>
      </div>
    </PublicShell>
  );
}
