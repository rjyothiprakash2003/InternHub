import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { markPaymentSuccess } from "@/lib/payments";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const payment = await prisma.payment.findFirst({ where: { id: body.paymentId, userId: session.id } });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  if (process.env.PAYMENT_MODE === "razorpay") {
    if (!body.signature || !body.orderId || !body.providerPaymentId) {
      return NextResponse.json({ error: "Razorpay verification payload missing." }, { status: 400 });
    }
  }
  const updated = await markPaymentSuccess(payment.id, {
    orderId: body.orderId,
    paymentId: body.providerPaymentId,
    signature: body.signature,
  });
  return NextResponse.json({ payment: updated });
}
