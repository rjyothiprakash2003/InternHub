import { PublicShell } from "@/components/layout/public-shell";
import { prisma } from "@/lib/db";
import { CertificatePreview } from "@/components/documents/previews";
import { generateQrDataUrl, verificationUrl } from "@/lib/qr";

export const metadata = { title: "Certificate Status" };

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { publicId: decodeURIComponent(certificateId) },
    include: { application: { include: { domain: true } } },
  });
  if (!cert) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Certificate Not Found</h1>
          <p className="mt-3 text-slate-600">No InternHub certificate matches this ID.</p>
        </div>
      </PublicShell>
    );
  }
  await prisma.certificateVerification.create({
    data: { certificateId: cert.id, result: cert.status === "VALID" ? "VERIFIED" : cert.status },
  });
  const qr = await generateQrDataUrl(cert.verificationUrl || verificationUrl("certificate", cert.publicId));
  const verified = cert.status === "VALID";
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className={`mb-8 rounded-3xl px-6 py-5 text-white ${verified ? "bg-emerald-700" : "bg-red-700"}`}>
          <p className="text-sm uppercase tracking-wider">{verified ? "Certificate Verified" : cert.status}</p>
          <h1 className="text-2xl font-semibold">{cert.application.professionalName}</h1>
          <p className="text-white/80">{cert.publicId}</p>
        </div>
        <CertificatePreview
          data={{
            publicId: cert.publicId,
            studentName: cert.application.professionalName,
            college: cert.application.college,
            course: cert.application.course,
            branch: cert.application.branch,
            domain: cert.application.domain.name,
            duration: cert.application.durationKey,
            startDate: cert.application.startDate,
            endDate: cert.application.endDate,
            issueDate: cert.issueDate,
            grade: cert.grade,
            qrDataUrl: qr,
            verificationUrl: cert.verificationUrl,
          }}
        />
      </div>
    </PublicShell>
  );
}
