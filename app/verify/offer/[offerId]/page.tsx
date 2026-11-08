import { PublicShell } from "@/components/layout/public-shell";
import { prisma } from "@/lib/db";
import { OfferLetterPreview } from "@/components/documents/previews";
import { generateQrDataUrl, verificationUrl } from "@/lib/qr";

export default async function OfferVerifyPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  const offer = await prisma.offerLetter.findUnique({
    where: { publicId: decodeURIComponent(offerId) },
    include: { application: { include: { domain: true } } },
  });
  if (!offer) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold">Document Not Found</h1>
        </div>
      </PublicShell>
    );
  }
  const qr = await generateQrDataUrl(offer.verificationUrl || verificationUrl("offer", offer.publicId));
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12">
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
      </div>
    </PublicShell>
  );
}
