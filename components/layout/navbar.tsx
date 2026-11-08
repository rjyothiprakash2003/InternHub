import { InternHubLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/internships", label: "Internships" },
  { href: "/domains", label: "Domains" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/benefits", label: "Benefits" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const session = await getSession();
  const unread = session
    ? await prisma.notification.count({ where: { userId: session.id, isRead: false } })
    : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071529]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="InternHub home">
          <InternHubLogo inverted />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/75 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <>
              {session.role === "ADMIN" ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">Dashboard{unread ? ` (${unread})` : ""}</Link>
                </Button>
              )}
              <form action="/api/auth/logout" method="post">
                <Button variant="secondary" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/login?tab=register">Register</Link>
              </Button>
            </>
          )}
        </div>
        <MobileNav
          links={publicLinks}
          isLoggedIn={Boolean(session)}
          isAdmin={session?.role === "ADMIN"}
        />
      </div>
    </header>
  );
}
