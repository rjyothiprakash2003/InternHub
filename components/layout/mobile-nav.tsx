"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { InternHubLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function MobileNav({
  links,
  isLoggedIn,
  isAdmin,
}: {
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="rounded-full p-2 text-white"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[60] bg-[#071529]">
          <div className="flex items-center justify-between px-4 py-5">
            <InternHubLogo inverted />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <nav className="grid gap-2 px-4" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="rounded-2xl px-4 py-3 text-white"
                onClick={() => setOpen(false)}
              >
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
            ) : (
              <div className="mt-4 grid gap-2">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild variant="primary">
                  <Link href="/login?tab=register" onClick={() => setOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
