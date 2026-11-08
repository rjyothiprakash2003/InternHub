import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">403</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ih-navy)]">Access denied</h1>
        <p className="mt-3 text-slate-600">Students cannot open admin pages. If this is your administrator account, sign in with an admin role.</p>
        <Button asChild className="mt-8" variant="primary"><Link href="/dashboard">Go to student dashboard</Link></Button>
      </div>
    </PublicShell>
  );
}
