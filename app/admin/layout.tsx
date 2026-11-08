import Link from "next/link";
import { InternHubLogo } from "@/components/brand/logo";
import { requireAdmin } from "@/lib/auth";

const links = [
  ["Dashboard", "/admin"],
  ["Students", "/admin/students"],
  ["Internships", "/admin/internships"],
  ["Domains", "/admin/domains"],
  ["Applications", "/admin/applications"],
  ["Payments", "/admin/payments"],
  ["Offers", "/admin/offers"],
  ["Certificates", "/admin/certificates"],
  ["Discounts", "/admin/discounts"],
  ["Testimonials", "/admin/testimonials"],
  ["FAQs", "/admin/faqs"],
  ["Content", "/admin/content"],
  ["Notifications", "/admin/notifications"],
  ["Analytics", "/admin/analytics"],
  ["Settings", "/admin/settings"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="bg-[#071529] text-white">
          <div className="px-5 py-5">
            <InternHubLogo inverted />
            <p className="mt-3 text-xs text-white/60">Admin · {session.name}</p>
          </div>
          <nav className="grid px-3 pb-8">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
                {label}
              </Link>
            ))}
            <form action="/api/auth/logout" method="post">
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/50">Logout</button>
            </form>
          </nav>
        </aside>
        <div className="px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
