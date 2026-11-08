import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export default async function NotificationsPage() {
  const { user } = await requireStudent();
  const items = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  if (!items.length) return <EmptyState title="No notifications." />;
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Notifications</h1>
      {items.map((item) => (
        <article key={item.id} className={`rounded-3xl p-5 ${item.isRead ? "bg-white" : "bg-blue-50"}`}>
          <h2 className="font-semibold">{item.title}</h2>
          <p className="text-sm text-slate-600">{item.body}</p>
          <p className="mt-2 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
        </article>
      ))}
    </div>
  );
}
