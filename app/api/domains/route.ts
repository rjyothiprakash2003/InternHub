import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const domains = await prisma.domain.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ domains });
}
