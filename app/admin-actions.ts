"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export async function upsertDomainAction(formData: FormData) {
  const { user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const data = {
    name,
    slug: slugify(name),
    icon: String(formData.get("icon") ?? "Globe"),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    skills: JSON.stringify(String(formData.get("skills") ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
    isActive: formData.get("isActive") === "on",
  };
  if (id) {
    await prisma.domain.update({ where: { id }, data });
  } else {
    await prisma.domain.create({ data });
    await writeAudit({ actorId: user.id, action: "DOMAIN_CREATED", metadata: { name } });
  }
  revalidatePath("/admin/domains");
}

export async function deleteDomainAction(id: string) {
  const { user } = await requireAdmin();
  await prisma.domain.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  await writeAudit({ actorId: user.id, action: "DOMAIN_DELETED", entityId: id });
  revalidatePath("/admin/domains");
}

export async function upsertInternshipAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const data = {
    title,
    slug: slugify(title),
    domainId: String(formData.get("domainId")),
    level: String(formData.get("level") ?? "BEGINNER"),
    mode: String(formData.get("mode") ?? "ONLINE"),
    description: String(formData.get("description") ?? ""),
    skills: JSON.stringify(String(formData.get("skills") ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };
  if (id) await prisma.internship.update({ where: { id }, data });
  else await prisma.internship.create({ data });
  revalidatePath("/admin/internships");
}

export async function upsertDiscountAction(formData: FormData) {
  const { user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    name: String(formData.get("name")),
    couponCode: String(formData.get("couponCode")).toUpperCase(),
    type: String(formData.get("type") ?? "PERCENT"),
    percent: Number(formData.get("percent") ?? 0),
    maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
    minAmount: Number(formData.get("minAmount") ?? 0),
    isActive: formData.get("isActive") === "on",
  };
  if (id) await prisma.discount.update({ where: { id }, data });
  else await prisma.discount.create({ data });
  await writeAudit({ actorId: user.id, action: "DISCOUNT_CHANGED", metadata: data });
  revalidatePath("/admin/discounts");
}

export async function upsertFaqAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    question: String(formData.get("question")),
    answer: String(formData.get("answer")),
    isActive: formData.get("isActive") === "on",
  };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  revalidatePath("/admin/faqs");
}

export async function upsertTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    name: String(formData.get("name")),
    college: String(formData.get("college")),
    duration: String(formData.get("duration")),
    quote: String(formData.get("quote")),
    rating: Number(formData.get("rating") ?? 5),
    isSample: formData.get("isSample") === "on",
    isActive: formData.get("isActive") === "on",
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/admin/testimonials");
}

export async function saveContentAction(formData: FormData) {
  const { user } = await requireAdmin();
  for (const [key, value] of formData.entries()) {
    if (key === "kind") continue;
    const str = String(value);
    if (formData.get("kind") === "setting") {
      await prisma.systemSetting.upsert({ where: { key }, update: { value: str }, create: { key, value: str } });
    } else {
      await prisma.websiteContent.upsert({ where: { key }, update: { value: str }, create: { key, value: str } });
    }
  }
  await writeAudit({ actorId: user.id, action: "CONTENT_UPDATED" });
  revalidatePath("/admin/content");
}

export async function setStudentActiveAction(id: string, isActive: boolean) {
  const { user } = await requireAdmin();
  await prisma.user.update({ where: { id }, data: { isActive } });
  await writeAudit({ actorId: user.id, action: isActive ? "STUDENT_ACTIVATED" : "STUDENT_SUSPENDED", entityId: id });
  revalidatePath("/admin/students");
}

export async function updatePricingAction(formData: FormData) {
  const { user } = await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.pricingPlan.update({
    where: { id },
    data: {
      originalPrice: Number(formData.get("originalPrice")),
      promotionalPrice: Number(formData.get("promotionalPrice")),
      discountPercent: Number(formData.get("discountPercent")),
      isActive: formData.get("isActive") === "on",
    },
  });
  await writeAudit({ actorId: user.id, action: "PRICING_CHANGED", entityId: id });
  revalidatePath("/admin/internships");
}
