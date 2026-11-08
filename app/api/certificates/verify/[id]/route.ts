import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { publicId: id },
    include: {
      application: { include: { domain: true, user: true } },
    },
  });
  if (!cert) {
    return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
  }
  await prisma.certificateVerification.create({
    data: { certificateId: cert.id, result: cert.status === "VALID" ? "VERIFIED" : cert.status },
  });
  return NextResponse.json({
    status: cert.status === "VALID" ? "VERIFIED" : cert.status,
    certificateId: cert.publicId,
    studentName: cert.application.professionalName,
    domain: cert.application.domain.name,
    duration: cert.application.durationKey,
    startDate: cert.application.startDate,
    endDate: cert.application.endDate,
    issueDate: cert.issueDate,
  });
}
