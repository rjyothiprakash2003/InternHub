import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/auth-constants";

export { SESSION_COOKIE } from "@/lib/auth-constants";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not configured.");
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser, remember = true) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(remember ? `${SESSION_DAYS}d` : "12h")
    .sign(secret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? SESSION_DAYS * 24 * 60 * 60 : undefined,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.id || !payload.email || !payload.role || !payload.name) return null;
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findFirst({
    where: { id: session.id, isActive: true, deletedAt: null },
  });
  if (!user) redirect("/login");
  return { session, user };
}

export async function requireStudent() {
  const result = await requireUser();
  if (result.session.role !== "STUDENT") redirect("/admin");
  return result;
}

export async function requireAdmin() {
  const result = await requireUser();
  if (result.session.role !== "ADMIN") redirect("/403");
  return result;
}
