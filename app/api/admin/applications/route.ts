import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const applications = await prisma.application.findMany({
    include: { user: true, internship: true, domain: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ applications });
}
