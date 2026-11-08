import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { OfferLetterPreview } from "@/components/documents/previews";
import { generateQrDataUrl } from "@/lib/qr";

export default async function OfferLetterPage() {
  const { user } = await requireStudent();
  const offer = await prisma.offerLetter.findFirst({
    where: { application: { userId: user.id } },
    include: { application: { include: { domain: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!offer) return <EmptyState title="No offer letter available yet." description="Offer letters are generated after approval and required data collection." />;
  const qr = await generateQrDataUrl(offer.verificationUrl);
  return (
    <OfferLetterPreview
      data={{
        publicId: offer.publicId,
        studentName: offer.application.professionalName,
        college: offer.application.college,
        course: offer.application.course,
        branch: offer.application.branch,
        domain: offer.application.domain.name,
        duration: offer.application.durationKey,
        startDate: offer.application.startDate,
        endDate: offer.application.endDate,
        issueDate: offer.issueDate,
        qrDataUrl: qr,
        verificationUrl: offer.verificationUrl,
      }}
    />
  );
}
