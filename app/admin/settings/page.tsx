import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 30, include: { actor: true } });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Settings & audit log</h1>
      <p className="mt-2 text-sm text-slate-600">Sensitive admin actions are recorded with actor, timestamp, and metadata.</p>
      <ul className="mt-6 space-y-2 text-sm">
        {logs.map((log) => (
          <li key={log.id} className="rounded-2xl bg-white px-4 py-3">
            {log.action} · {log.actor?.email ?? "system"} · {formatDateTime(log.createdAt)}
          </li>
        ))}
      </ul>
    </div>
  );
}
