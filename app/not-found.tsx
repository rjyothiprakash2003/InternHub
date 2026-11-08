import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ErrorView({ code, title, description }: { code: string; title: string; description: string }) {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ih-blue)]">{code}</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ih-navy)]">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
        <Button asChild className="mt-8" variant="primary"><Link href="/">Return home</Link></Button>
      </div>
    </PublicShell>
  );
}

export default function NotFound() {
  return <ErrorView code="404" title="Page not found" description="The page you requested is not part of InternHub." />;
}
