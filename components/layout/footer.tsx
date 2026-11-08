import Link from "next/link";
import { InternHubLogo } from "@/components/brand/logo";
import { prisma } from "@/lib/db";

export async function Footer() {
  const settings = await prisma.systemSetting.findMany({
    where: { key: { in: ["tagline", "support_email", "social_linkedin", "social_instagram", "social_x"] } },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <footer className="bg-[#071529] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <InternHubLogo inverted />
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
            {map.tagline ?? "Learn. Intern. Build Your Future."}
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/55">
            Structured internships, transparent pricing, and professional documentation for students.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/internships", "Internships"],
              ["/domains", "Domains"],
              ["/pricing", "Pricing"],
              ["/how-it-works", "How It Works"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link className="hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">Student</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {[
              ["/login", "Login"],
              ["/login?tab=register", "Register"],
              ["/dashboard", "Dashboard"],
              ["/dashboard/documents", "Documents"],
              ["/contact", "Support"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link className="hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">Legal</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {[
              ["/legal/terms", "Terms & Conditions"],
              ["/legal/privacy", "Privacy Policy"],
              ["/legal/refund", "Refund Policy"],
              ["/legal/internship-terms", "Internship Terms"],
              ["/legal/certificate-disclaimer", "Certificate Disclaimer"],
              ["/legal/payment-terms", "Payment Terms"],
              ["/legal/student-agreement", "Student Agreement"],
              ["/verify/certificate", "Certificate Verification"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link className="hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 InternHub. All rights reserved.</p>
          <p>Support: {map.support_email ?? "support@internhub.example"}</p>
        </div>
      </div>
    </footer>
  );
}
