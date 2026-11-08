"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, requireStudent } from "@/lib/auth";
import { applicationSchema, contactSchema, profileSchema } from "@/lib/validation";
import { calculateEndDate } from "@/lib/duration";
import { calculatePrice } from "@/lib/pricing";
import { nextPublicId } from "@/lib/ids";
import { notify } from "@/lib/notifications";
import { sendTemplatedEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";
import { createPaymentRecord, markPaymentSuccess } from "@/lib/payments";
import { verificationUrl } from "@/lib/qr";
import { parseJsonArray } from "@/lib/utils";

export async function updateProfileAction(formData: FormData): Promise<void> {
  const { user } = await requireStudent();
  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return;
  const data = parsed.data;
  await prisma.user.update({
    where: { id: user.id },
    data: { name: data.name, mobile: data.mobile, email: data.email.toLowerCase() },
  });
  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      college: data.college,
      collegeLocation: data.collegeLocation,
      course: data.course,
      branch: data.branch,
      currentYear: data.currentYear,
      graduationYear: data.graduationYear,
      studentIdNumber: data.studentIdNumber,
      technicalSkills: JSON.stringify(splitList(data.technicalSkills)),
      softSkills: JSON.stringify(splitList(data.softSkills)),
      programmingLanguages: JSON.stringify(splitList(data.programmingLanguages)),
      tools: JSON.stringify(splitList(data.tools)),
      preferredDomainId: data.preferredDomainId || null,
      preferredType: data.preferredType,
      preferredDurationKey: data.preferredDurationKey || null,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
      emergencyName: data.emergencyName,
      emergencyRelation: data.emergencyRelation,
      emergencyPhone: data.emergencyPhone,
    },
    create: {
      userId: user.id,
      college: data.college,
      course: data.course,
      branch: data.branch,
    },
  });
  revalidatePath("/dashboard/profile");
}

export async function submitApplicationAction(formData: FormData) {
  const { user } = await requireStudent();
  const raw = Object.fromEntries(formData.entries());
  const parsed = applicationSchema.safeParse({
    ...raw,
    declaredAccurate: raw.declaredAccurate === "on" || raw.declaredAccurate === "true",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid application." };
  }
  const data = parsed.data;
  const [internship, domain, duration, plan, settings] = await Promise.all([
    prisma.internship.findFirst({ where: { id: data.internshipId, isActive: true, deletedAt: null } }),
    prisma.domain.findFirst({ where: { id: data.domainId, isActive: true, deletedAt: null } }),
    prisma.durationRule.findFirst({ where: { key: data.durationKey, isActive: true } }),
    prisma.pricingPlan.findFirst({ where: { durationKey: data.durationKey, isActive: true } }),
    prisma.systemSetting.findMany({ where: { key: { in: ["tax_enabled", "tax_percent"] } } }),
  ]);
  if (!internship || !domain || !duration || !plan) {
    return { error: "Select a valid internship, domain, and duration." };
  }
  const startDate = new Date(data.startDate);
  const endDate = calculateEndDate(startDate, duration);
  const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const taxPercent = settingMap.tax_enabled === "true" ? Number(settingMap.tax_percent ?? 0) : 0;

  let couponPercent: number | null = null;
  let couponFixed: number | null = null;
  let couponCode: string | undefined;
  if (data.couponCode) {
    const coupon = await prisma.discount.findFirst({
      where: { couponCode: data.couponCode.trim().toUpperCase(), isActive: true },
    });
    if (!coupon) return { error: "Coupon code is not valid." };
    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) return { error: "Coupon is not active yet." };
    if (coupon.endDate && coupon.endDate < now) return { error: "Coupon has expired." };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { error: "Coupon usage limit reached." };
    const domains = parseJsonArray(coupon.eligibleDomains);
    const durations = parseJsonArray(coupon.eligibleDurations);
    if (domains.length && !domains.includes(domain.id) && !domains.includes(domain.slug)) {
      return { error: "Coupon is not eligible for this domain." };
    }
    if (durations.length && !durations.includes(duration.key)) {
      return { error: "Coupon is not eligible for this duration." };
    }
    couponPercent = coupon.percent;
    couponFixed = coupon.fixedAmount;
    couponCode = coupon.couponCode;
  }

  const price = calculatePrice({
    originalPrice: plan.originalPrice,
    promotionalPrice: couponCode ? undefined : plan.promotionalPrice,
    discountPercent: couponCode ? undefined : plan.discountPercent,
    couponPercent,
    couponFixed,
    taxPercent,
  });

  const publicId = await nextPublicId("APP");
  const application = await prisma.application.create({
    data: {
      publicId,
      userId: user.id,
      internshipId: internship.id,
      domainId: domain.id,
      durationKey: duration.key,
      startDate,
      endDate,
      mode: data.mode,
      status: "SUBMITTED",
      professionalName: data.professionalName,
      college: data.college,
      course: data.course,
      branch: data.branch,
      email: data.email,
      mobile: data.mobile,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      graduationYear: data.graduationYear,
      learningGoals: data.learningGoals,
      motivation: data.motivation,
      skillLevel: data.skillLevel,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
      declaredAccurate: true,
      originalPrice: price.originalPrice,
      discountPercent: price.discountPercent,
      discountAmount: price.discountAmount,
      couponCode,
      taxAmount: price.taxAmount,
      finalAmount: price.totalAmount,
      statusHistory: { create: { toStatus: "SUBMITTED", actorId: user.id, note: "Application submitted" } },
    },
  });

  if (couponCode) {
    const coupon = await prisma.discount.findUnique({ where: { couponCode } });
    if (coupon) {
      await prisma.discount.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      await prisma.couponRedemption.create({ data: { discountId: coupon.id, userId: user.id } });
    }
  }

  await notify(user.id, "APPLICATION_SUBMITTED", "Application submitted", `Application ${publicId} was received.`, `/dashboard/applications/${application.id}`);
  await sendTemplatedEmail({
    to: data.email,
    template: "application_confirmation",
    variables: {
      student_name: data.professionalName,
      internship_domain: domain.name,
      duration: duration.label,
    },
  });
  redirect(`/dashboard/applications/${application.id}`);
}

export async function startPaymentAction(applicationId: string): Promise<void> {
  const { user } = await requireStudent();
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId: user.id, deletedAt: null },
  });
  if (!application) return;
  const existing = await prisma.payment.findFirst({
    where: { applicationId, status: { in: ["PENDING", "SUCCESS"] } },
    orderBy: { createdAt: "desc" },
  });
  const payment = existing ?? (await createPaymentRecord({
    userId: user.id,
    applicationId,
    amount: application.finalAmount,
  }));
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "PAYMENT_PENDING" },
  });
  redirect(`/dashboard/payment/${payment.id}`);
}

export async function completeDemoPaymentAction(paymentId: string): Promise<void> {
  const { user } = await requireStudent();
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId: user.id },
    include: { application: { include: { domain: true } } },
  });
  if (!payment) return;
  if (process.env.PAYMENT_MODE === "razorpay") {
    return;
  }
  await markPaymentSuccess(payment.id, { paymentId: `demo_${payment.publicId}` });
  await prisma.application.update({
    where: { id: payment.applicationId },
    data: {
      status: "PAYMENT_COMPLETED",
      statusHistory: {
        create: { fromStatus: payment.application.status, toStatus: "PAYMENT_COMPLETED", actorId: user.id },
      },
    },
  });
  await notify(user.id, "PAYMENT_SUCCESSFUL", "Payment successful", `Transaction ${payment.publicId} is complete.`, "/dashboard/payments");
  await sendTemplatedEmail({
    to: payment.application.email,
    template: "payment_confirmation",
    variables: {
      student_name: payment.application.professionalName,
      internship_domain: payment.application.domain.name,
    },
  });
  redirect(`/dashboard/payment/${payment.id}/success`);
}

export async function contactAction(formData: FormData): Promise<void> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  await prisma.supportTicket.create({
    data: {
      userId: session?.id,
      name: parsed.data.name,
      email: parsed.data.email,
      mobile: parsed.data.mobile || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });
}

export async function updateApplicationStatusAction(applicationId: string, status: string, note?: string): Promise<void> {
  const { user } = await requireAdmin();
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) return;
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      statusHistory: {
        create: { fromStatus: application.status, toStatus: status, note, actorId: user.id },
      },
    },
  });
  await writeAudit({ actorId: user.id, action: "APPLICATION_STATUS", entityType: "Application", entityId: applicationId, metadata: { status } });
  await notify(application.userId, "APPLICATION_APPROVED", "Application updated", `Status is now ${status}.`, `/dashboard/applications/${applicationId}`);
  revalidatePath("/admin/applications");
}

export async function generateOfferLetterAction(applicationId: string): Promise<void> {
  const { user } = await requireAdmin();
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { offerLetter: true, domain: true },
  });
  if (!application) return;
  const required = [
    application.professionalName,
    application.college,
    application.course,
    application.branch,
    application.mobile,
    application.email,
    application.domainId,
    application.durationKey,
    application.startDate,
    application.endDate,
  ];
  if (required.some((value) => !value)) {
    return;
  }
  if (application.offerLetter) return;
  const publicId = await nextPublicId("OFR");
  const url = verificationUrl("offer", publicId);
  await prisma.offerLetter.create({
    data: {
      publicId,
      applicationId,
      verificationUrl: url,
      qrPayload: url,
    },
  });
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: "OFFER_LETTER_GENERATED",
      statusHistory: { create: { fromStatus: application.status, toStatus: "OFFER_LETTER_GENERATED", actorId: user.id } },
    },
  });
  await prisma.document.create({
    data: {
      userId: application.userId,
      applicationId,
      type: "OFFER_LETTER",
      title: "Internship Offer Letter",
      verificationId: publicId,
      issueDate: new Date(),
    },
  });
  await notify(application.userId, "OFFER_LETTER_GENERATED", "Offer letter ready", `Offer letter ${publicId} is available.`, "/dashboard/documents");
  await sendTemplatedEmail({
    to: application.email,
    template: "offer_letter",
    variables: { student_name: application.professionalName, offer_letter_id: publicId },
  });
  await writeAudit({ actorId: user.id, action: "OFFER_LETTER_GENERATED", entityType: "OfferLetter", entityId: publicId });
  revalidatePath("/admin/offers");
}

export async function generateCertificateAction(applicationId: string, grade?: string): Promise<void> {
  const { user } = await requireAdmin();
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { certificate: true, domain: true },
  });
  if (!application) return;
  const completable = ["COMPLETED", "CERTIFICATE_ELIGIBLE"].includes(application.status);
  if (!completable) {
    return;
  }
  const required = [application.professionalName, application.college, application.course, application.branch, application.email, application.mobile];
  if (required.some((value) => !value)) return;
  if (application.certificate) return;
  const publicId = await nextPublicId("CERT");
  const url = verificationUrl("certificate", publicId);
  await prisma.certificate.create({
    data: {
      publicId,
      applicationId,
      completionDate: new Date(),
      grade: grade || null,
      verificationUrl: url,
      qrPayload: url,
      status: "VALID",
    },
  });
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: "CERTIFICATE_GENERATED",
      statusHistory: { create: { fromStatus: application.status, toStatus: "CERTIFICATE_GENERATED", actorId: user.id } },
    },
  });
  await prisma.document.create({
    data: {
      userId: application.userId,
      applicationId,
      type: "CERTIFICATE",
      title: "Internship Completion Certificate",
      verificationId: publicId,
      issueDate: new Date(),
    },
  });
  await notify(application.userId, "CERTIFICATE_GENERATED", "Certificate available", `Certificate ${publicId} is ready.`, "/dashboard/certificates");
  await sendTemplatedEmail({
    to: application.email,
    template: "certificate_available",
    variables: { student_name: application.professionalName, certificate_id: publicId },
  });
  await writeAudit({ actorId: user.id, action: "CERTIFICATE_GENERATED", entityType: "Certificate", entityId: publicId });
  revalidatePath("/admin/certificates");
}

export async function revokeCertificateAction(certificateId: string, reason: string): Promise<void> {
  const { user } = await requireAdmin();
  await prisma.certificate.update({
    where: { id: certificateId },
    data: { status: "REVOKED", revokedAt: new Date(), revokeReason: reason },
  });
  await writeAudit({ actorId: user.id, action: "CERTIFICATE_REVOKED", entityType: "Certificate", entityId: certificateId, metadata: { reason } });
  revalidatePath("/admin/certificates");
}

export async function saveSettingAction(key: string, value: string): Promise<void> {
  const { user } = await requireAdmin();
  await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  await writeAudit({ actorId: user.id, action: "SETTING_CHANGED", metadata: { key } });
  revalidatePath("/admin/content");
}

function splitList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
