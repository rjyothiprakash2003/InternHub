import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payments = await prisma.payment.findMany({ where: { userId: session.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ payments });
}
