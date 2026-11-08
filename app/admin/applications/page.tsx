import { prisma } from "@/lib/db";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { generateCertificateAction, generateOfferLetterAction, updateApplicationStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { titleCaseStatus } from "@/lib/utils";

async function statusForm(formData: FormData) {
  "use server";
  await updateApplicationStatusAction(String(formData.get("id")), String(formData.get("status")));
}

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    include: { user: true, internship: true, domain: true, offerLetter: true, certificate: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Applications</h1>
      <div className="mt-6 space-y-4">
        {applications.map((app) => (
          <article key={app.id} className="rounded-3xl bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{app.publicId} · {app.professionalName}</p>
                <p className="text-sm text-slate-500">{app.internship.title} · {app.domain.name} · {titleCaseStatus(app.status)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={generateOfferLetterAction.bind(null, app.id)}>
                  <Button size="sm" variant="secondary" disabled={Boolean(app.offerLetter)}>Generate offer</Button>
                </form>
                <form action={generateCertificateAction.bind(null, app.id, "Completed")}>
                  <Button size="sm" variant="secondary" disabled={Boolean(app.certificate)}>Generate certificate</Button>
                </form>
              </div>
            </div>
            <form action={statusForm} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={app.id} />
              <select name="status" defaultValue={app.status} className="h-10 rounded-xl border px-3 text-sm">
                {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
              <Button size="sm">Update status</Button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
