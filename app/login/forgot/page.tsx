import { PublicShell } from "@/components/layout/public-shell";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Password reset</h1>
        <p className="mt-3 text-slate-600">Enter the email for your InternHub account. In production this sends the password_reset email template through Resend.</p>
        <form className="mt-6 space-y-3 rounded-3xl bg-white p-6">
          <input name="email" type="email" required placeholder="Email" className="h-11 w-full rounded-xl border px-3" />
          <button className="h-11 w-full rounded-full bg-[var(--ih-navy)] text-white">Send reset instructions</button>
        </form>
      </div>
    </PublicShell>
  );
}
