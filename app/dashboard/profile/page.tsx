import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProfileAction } from "@/app/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { computeProfileCompletion } from "@/lib/profile-completion";
import { parseJsonArray } from "@/lib/utils";

export const metadata = { title: "Student Profile" };

export default async function ProfilePage() {
  const { user } = await requireStudent();
  const [profile, domains, durations] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: user.id } }),
    prisma.domain.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.durationRule.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  const completion = computeProfileCompletion(user.name, profile);
  const join = (value?: string | null) => parseJsonArray(value).join(", ");

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">Student profile</h1>
      <p className="mt-2 text-slate-600">Profile {completion.percent}% complete</p>
      <form action={updateProfileAction} className="mt-8 space-y-8">
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-semibold">Personal information</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Full Name" name="name" defaultValue={user.name} />
            <Field label="Email" name="email" type="email" defaultValue={user.email} />
            <Field label="Mobile Number" name="mobile" defaultValue={user.mobile ?? ""} />
            <Field label="Date of Birth" name="dateOfBirth" type="date" defaultValue={profile?.dateOfBirth?.toISOString().slice(0, 10)} />
            <Field label="Gender" name="gender" defaultValue={profile?.gender ?? ""} />
            <Field label="Address" name="address" defaultValue={profile?.address ?? ""} />
            <Field label="City" name="city" defaultValue={profile?.city ?? ""} />
            <Field label="State" name="state" defaultValue={profile?.state ?? ""} />
            <Field label="Country" name="country" defaultValue={profile?.country ?? "India"} />
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-semibold">Academic information</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="College/University" name="college" defaultValue={profile?.college ?? ""} />
            <Field label="College Location" name="collegeLocation" defaultValue={profile?.collegeLocation ?? ""} />
            <Field label="Course" name="course" defaultValue={profile?.course ?? ""} />
            <Field label="Branch/Specialization" name="branch" defaultValue={profile?.branch ?? ""} />
            <Field label="Current Year" name="currentYear" defaultValue={profile?.currentYear ?? ""} />
            <Field label="Graduation Year" name="graduationYear" type="number" defaultValue={profile?.graduationYear?.toString()} />
            <Field label="Student ID/Roll Number" name="studentIdNumber" defaultValue={profile?.studentIdNumber ?? ""} />
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-semibold">Skills</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Technical Skills" name="technicalSkills" defaultValue={join(profile?.technicalSkills)} />
            <Field label="Soft Skills" name="softSkills" defaultValue={join(profile?.softSkills)} />
            <Field label="Programming Languages" name="programmingLanguages" defaultValue={join(profile?.programmingLanguages)} />
            <Field label="Tools/Technologies" name="tools" defaultValue={join(profile?.tools)} />
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-semibold">Career preferences</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="preferredDomainId">Preferred Domain</Label>
              <select id="preferredDomainId" name="preferredDomainId" defaultValue={profile?.preferredDomainId ?? ""} className="h-11 w-full rounded-xl border border-slate-200 px-3">
                <option value="">Select domain</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>{domain.name}</option>
                ))}
              </select>
            </div>
            <Field label="Preferred Internship Type" name="preferredType" defaultValue={profile?.preferredType ?? ""} />
            <div>
              <Label htmlFor="preferredDurationKey">Preferred Duration</Label>
              <select id="preferredDurationKey" name="preferredDurationKey" defaultValue={profile?.preferredDurationKey ?? ""} className="h-11 w-full rounded-xl border border-slate-200 px-3">
                <option value="">Select duration</option>
                {durations.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
            </div>
            <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={profile?.linkedinUrl ?? ""} />
            <Field label="GitHub URL" name="githubUrl" defaultValue={profile?.githubUrl ?? ""} />
            <Field label="Portfolio URL" name="portfolioUrl" defaultValue={profile?.portfolioUrl ?? ""} />
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-semibold">Emergency contact</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Emergency Contact Name" name="emergencyName" defaultValue={profile?.emergencyName ?? ""} />
            <Field label="Relationship" name="emergencyRelation" defaultValue={profile?.emergencyRelation ?? ""} />
            <Field label="Emergency Contact Number" name="emergencyPhone" defaultValue={profile?.emergencyPhone ?? ""} />
          </div>
        </section>
        <Button type="submit" variant="primary">Save profile</Button>
      </form>
    </div>
  );
}

function Field({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  );
}
