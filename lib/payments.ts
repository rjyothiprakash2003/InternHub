import { prisma } from "@/lib/db";
import { nextPublicId } from "@/lib/ids";

export type CreatePaymentInput = {
  userId: string;
  applicationId: string;
  amount: number;
};

export async function createPaymentRecord(input: CreatePaymentInput) {
  const publicId = await nextPublicId("PAY");
  const invoiceNumber = await nextPublicId("INV");
  return prisma.payment.create({
    data: {
      publicId,
      invoiceNumber,
      userId: input.userId,
      applicationId: input.applicationId,
      amount: input.amount,
      status: "PENDING",
      provider: process.env.PAYMENT_MODE === "razorpay" ? "RAZORPAY" : "RAZORPAY_READY",
    },
  });
}

/**
 * Server-side payment verification.
 * Demo mode marks success after an explicit server action.
 * Razorpay mode is architecture-ready: verify signature before marking SUCCESS.
 */
export async function markPaymentSuccess(paymentId: string, providerRefs?: {
  orderId?: string;
  paymentId?: string;
  signature?: string;
}) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "SUCCESS",
      paidAt: new Date(),
      providerOrderId: providerRefs?.orderId,
      providerPaymentId: providerRefs?.paymentId,
      providerSignature: providerRefs?.signature,
    },
  });
}
