import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function AdminNotificationsPage() {
  const items = await prisma.notification.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Notifications</h1>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl bg-white px-4 py-3">{item.title} · {item.user.email} · {formatDateTime(item.createdAt)}</li>
        ))}
      </ul>
    </div>
  );
}
