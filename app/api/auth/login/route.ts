import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validation";
import { notify } from "@/lib/notifications";
import { sendTemplatedEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { writeAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`login:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid login." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || user.deletedAt || !user.isActive) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    parsed.data.remember ?? true,
  );
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAudit({ actorId: user.id, action: "LOGIN", ip, userAgent: request.headers.get("user-agent") });

  return NextResponse.json({
    ok: true,
    role: user.role,
    redirectTo: user.role === "ADMIN" ? "/admin" : "/dashboard",
  });
}
