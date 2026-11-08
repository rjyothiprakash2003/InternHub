import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const internships = await prisma.internship.findMany({
    where: { isActive: true, deletedAt: null },
    include: { domain: true },
    orderBy: { title: "asc" },
  });
  return NextResponse.json({ internships });
}
