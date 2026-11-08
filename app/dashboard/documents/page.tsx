import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DocumentsPage() {
  const { user } = await requireStudent();
  const documents = await prisma.document.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  if (!documents.length) return <EmptyState title="No documents yet." />;
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Documents</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {documents.map((doc) => (
          <article key={doc.id} className="rounded-3xl bg-white p-5">
            <h2 className="font-semibold">{doc.title}</h2>
            <p className="text-sm text-slate-500">{doc.type} · {doc.status}</p>
            <p className="text-sm text-slate-500">ID: {doc.verificationId ?? "—"}</p>
            <p className="text-sm text-slate-500">Issued: {doc.issueDate ? formatDate(doc.issueDate) : "—"}</p>
            {doc.type === "OFFER_LETTER" ? <Link className="mt-3 inline-block text-sm text-[var(--ih-blue)]" href="/dashboard/offer-letter">Preview</Link> : null}
            {doc.type === "CERTIFICATE" ? <Link className="mt-3 inline-block text-sm text-[var(--ih-blue)]" href="/dashboard/certificates">Preview</Link> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
