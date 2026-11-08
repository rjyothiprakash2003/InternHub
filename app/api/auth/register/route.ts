import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { notify } from "@/lib/notifications";
import { sendTemplatedEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`register:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid registration." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(parsed.data.password),
      name: parsed.data.name,
      mobile: parsed.data.mobile,
      role: "STUDENT",
      studentProfile: {
        create: {
          college: parsed.data.college,
          course: parsed.data.course,
          branch: parsed.data.branch,
          graduationYear: parsed.data.graduationYear,
          city: parsed.data.city,
          state: parsed.data.state,
          country: "India",
        },
      },
    },
  });

  await createSession({ id: user.id, email: user.email, name: user.name, role: user.role }, true);
  await notify(user.id, "REGISTRATION", "Welcome to InternHub", "Your student account is ready. Complete your profile to apply.", "/dashboard/profile");
  await sendTemplatedEmail({
    to: user.email,
    template: "welcome",
    variables: { student_name: user.name },
  });

  return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
}
