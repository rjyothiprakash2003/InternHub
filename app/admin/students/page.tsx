import { prisma } from "@/lib/db";
import { setStudentActiveAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";

export default async function AdminStudentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      deletedAt: null,
      OR: q ? [{ name: { contains: q } }, { email: { contains: q } }] : undefined,
    },
    include: { studentProfile: true, applications: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Students</h1>
      <form className="mt-4">
        <input name="q" defaultValue={q} placeholder="Search students" className="h-11 w-full max-w-md rounded-full border px-4" />
      </form>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500"><tr><th className="px-4 py-3">Name</th><th>Email</th><th>College</th><th>Apps</th><th>Status</th><th /></tr></thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="px-4 py-3">{student.name}</td>
                <td>{student.email}</td>
                <td>{student.studentProfile?.college}</td>
                <td>{student.applications.length}</td>
                <td>{student.isActive ? "Active" : "Suspended"}</td>
                <td className="px-4 py-3">
                  <form action={setStudentActiveAction.bind(null, student.id, !student.isActive)}>
                    <Button size="sm" variant="secondary">{student.isActive ? "Suspend" : "Activate"}</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
