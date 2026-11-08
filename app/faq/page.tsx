import { PublicShell } from "@/components/layout/public-shell";
import { PageHeader } from "@/components/ui/empty-state";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/disclosure";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="FAQ" title="Answers before you apply" />
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-8 text-center text-sm text-slate-600">
          Need more help? <Link className="font-semibold text-[var(--ih-blue)]" href="/contact">Contact support</Link>
        </p>
      </div>
    </PublicShell>
  );
}
