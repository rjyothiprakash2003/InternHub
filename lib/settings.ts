import { prisma } from "@/lib/db";

export async function getSetting(key: string, fallback = "") {
  const row = await prisma.systemSetting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function getSettings(keys: string[]) {
  const rows = await prisma.systemSetting.findMany({
    where: { key: { in: keys } },
  });
  return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, string>;
}

export async function getContent(key: string, fallback = "") {
  const row = await prisma.websiteContent.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export function isEnabled(value: string | undefined) {
  return value === "true" || value === "1";
}
