import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplicationFailedPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Application failed</h1>
        <p className="mt-3 text-slate-600">We could not complete this application. Check required fields and try again.</p>
        <Button asChild className="mt-8" variant="primary"><Link href="/internships">Back to internships</Link></Button>
      </div>
    </PublicShell>
  );
}
