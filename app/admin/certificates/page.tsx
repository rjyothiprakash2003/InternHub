import { prisma } from "@/lib/db";
import { generateCertificateAction, revokeCertificateAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default async function AdminCertificatesPage() {
  const [certs, eligible] = await Promise.all([
    prisma.certificate.findMany({ include: { application: true }, orderBy: { createdAt: "desc" } }),
    prisma.application.findMany({ where: { certificate: null, status: { in: ["COMPLETED", "CERTIFICATE_ELIGIBLE"] } } }),
  ]);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Certificates</h1>
      <ul className="mt-4 space-y-3">
        {certs.map((cert) => (
          <li key={cert.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span>{cert.publicId} · {cert.status} · {cert.application.professionalName}</span>
            {cert.status === "VALID" ? (
              <form action={revokeCertificateAction.bind(null, cert.id, "Revoked by administrator")}>
                <Button size="sm" variant="danger">Revoke</Button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-semibold">Eligible for certificate</h2>
      {eligible.map((app) => (
        <form key={app.id} action={generateCertificateAction.bind(null, app.id, "Completed")} className="mt-2 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <span>{app.publicId}</span>
          <Button size="sm">Generate</Button>
        </form>
      ))}
    </div>
  );
}
