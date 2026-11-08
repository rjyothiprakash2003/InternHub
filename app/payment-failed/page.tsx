import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Payment failed</h1>
        <p className="mt-3 text-slate-600">No card details were stored. You can retry checkout from your application.</p>
        <Button asChild className="mt-8" variant="primary"><Link href="/dashboard/applications">View applications</Link></Button>
      </div>
    </PublicShell>
  );
}
