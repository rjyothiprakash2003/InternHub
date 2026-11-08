import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const applications = await prisma.application.findMany({
    where: { userId: session.id, deletedAt: null },
    include: { internship: true, domain: true, payments: true, offerLetter: true, certificate: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ applications });
}
