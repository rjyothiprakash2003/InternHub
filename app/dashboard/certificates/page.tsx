import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { CertificatePreview } from "@/components/documents/previews";
import { generateQrDataUrl } from "@/lib/qr";

export default async function CertificatesPage() {
  const { user } = await requireStudent();
  const cert = await prisma.certificate.findFirst({
    where: { application: { userId: user.id } },
    include: { application: { include: { domain: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!cert) return <EmptyState title="No certificates available." description="Certificates are issued only after internship completion is recorded." />;
  const qr = await generateQrDataUrl(cert.verificationUrl);
  return (
    <CertificatePreview
      data={{
        publicId: cert.publicId,
        studentName: cert.application.professionalName,
        college: cert.application.college,
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
  );
}
