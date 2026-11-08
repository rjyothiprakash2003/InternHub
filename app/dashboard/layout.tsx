import Link from "next/link";
import { InternHubLogo } from "@/components/brand/logo";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";

const links = [
  ["Dashboard", "/dashboard"],
  ["Profile", "/dashboard/profile"],
  ["Applications", "/dashboard/applications"],
  ["Payments", "/dashboard/payments"],
  ["Progress", "/dashboard/progress"],
  ["Offer Letter", "/dashboard/offer-letter"],
  ["Certificates", "/dashboard/certificates"],
  ["Documents", "/dashboard/documents"],
  ["Notifications", "/dashboard/notifications"],
  ["Settings", "/dashboard/settings"],
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireStudent();
  const unread = await prisma.notification.count({ where: { userId: session.id, isRead: false } });
  return (
    <div className="min-h-screen bg-[var(--ih-canvas)]">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/">
              <InternHubLogo />
            </Link>
          </div>
          <nav className="grid gap-1 px-3 pb-6" aria-label="Student">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[var(--ih-navy)]">
                {label}
                {href === "/dashboard/notifications" && unread ? ` (${unread})` : ""}
              </Link>
            ))}
            <form action="/api/auth/logout" method="post">
              <button className="w-full rounded-2xl px-4 py-2.5 text-left text-sm font-medium text-slate-500">Logout</button>
            </form>
          </nav>
        </aside>
        <div>
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Student area</p>
              <p className="font-semibold text-[var(--ih-navy)]">{session.name}</p>
            </div>
            <Link href="/" className="text-sm text-[var(--ih-blue)]">Back to website</Link>
          </header>
          <div className="px-4 py-8 sm:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
