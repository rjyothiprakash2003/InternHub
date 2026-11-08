import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const domains = await prisma.domain.findMany({ where: { isActive: true, deletedAt: null }, select: { slug: true } });
  const staticRoutes = ["", "/about", "/internships", "/domains", "/how-it-works", "/benefits", "/pricing", "/offers", "/faq", "/contact", "/verify/certificate"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  return [
    ...staticRoutes,
    ...domains.map((domain) => ({ url: `${base}/internships/${domain.slug}`, lastModified: new Date() })),
  ];
}
