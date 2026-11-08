import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth-constants";

async function readRole(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return { role: String(payload.role), id: String(payload.id) };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readRole(request);

  if (pathname.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (session.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/login?tab=login", request.url));
    if (session.role !== "ADMIN") return NextResponse.redirect(new URL("/403", request.url));
  }

  if (pathname.startsWith("/apply")) {
    if (!session) return NextResponse.redirect(new URL("/login?tab=login", request.url));
    if (session.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/apply/:path*"],
};
