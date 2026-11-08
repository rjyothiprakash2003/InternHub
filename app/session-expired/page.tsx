import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SessionExpiredPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Session expired</h1>
        <p className="mt-3 text-slate-600">Sign in again to continue your internship journey.</p>
        <Button asChild className="mt-8" variant="primary"><Link href="/login">Login</Link></Button>
      </div>
    </PublicShell>
  );
}
