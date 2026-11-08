import { PublicShell } from "@/components/layout/public-shell";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

async function lookup(formData: FormData) {
  "use server";
  const id = String(formData.get("certificateId") ?? "").trim();
  redirect(`/verify/certificate/${encodeURIComponent(id)}`);
}

export const metadata = { title: "Certificate Verification" };

export default function VerifyIndexPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Certificate verification</h1>
        <p className="mt-3 text-slate-600">Enter a certificate ID or scan the QR code on the document. The URL contains only the document ID.</p>
        <form action={lookup} className="mt-8 rounded-3xl bg-white p-6">
          <Label htmlFor="certificateId">Certificate ID</Label>
          <Input id="certificateId" name="certificateId" placeholder="INH-CERT-2026-000001" required />
          <Button type="submit" className="mt-4" variant="primary">Verify</Button>
        </form>
      </div>
    </PublicShell>
  );
}
