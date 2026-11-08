import { requireStudent } from "@/lib/auth";

export default async function SettingsPage() {
  const { user } = await requireStudent();
  return (
    <div className="max-w-xl rounded-3xl bg-white p-6">
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Account settings</h1>
      <p className="mt-4 text-sm text-slate-600">Signed in as {user.email}</p>
      <p className="mt-2 text-sm text-slate-600">Password changes use the secure reset flow. Session cookies are HTTP-only.</p>
      <form action="/api/auth/logout" method="post" className="mt-6">
        <button className="rounded-full bg-[var(--ih-navy)] px-5 py-2 text-sm font-semibold text-white">Logout</button>
      </form>
    </div>
  );
}
