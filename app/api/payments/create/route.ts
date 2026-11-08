import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createPaymentRecord } from "@/lib/payments";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const application = await prisma.application.findFirst({
    where: { id: body.applicationId, userId: session.id },
  });
  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  const payment = await createPaymentRecord({
    userId: session.id,
    applicationId: application.id,
    amount: application.finalAmount,
  });
  return NextResponse.json({ payment });
}
