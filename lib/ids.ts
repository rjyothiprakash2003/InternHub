import { prisma } from "@/lib/db";

const PREFIX: Record<string, string> = {
  APP: "INH-APP",
  OFR: "INH-OFR",
  CERT: "INH-CERT",
  PAY: "INH-PAY",
  INV: "INH-INV",
  STU: "INH-STU",
};

export async function nextPublicId(kind: keyof typeof PREFIX, year = new Date().getFullYear()) {
  const key = `${kind}-${year}`;
  const row = await prisma.idSequence.upsert({
    where: { key },
    update: { value: { increment: 1 } },
    create: { key, value: 1 },
  });
  const serial = String(row.value).padStart(6, "0");
  return `${PREFIX[kind]}-${year}-${serial}`;
}
