"use client";

import { useMemo, useState } from "react";
import { submitApplicationAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { PriceBreakdown } from "@/components/home/interactive";
import { calculatePrice } from "@/lib/pricing";
import { addMonths, addWeeks, format } from "date-fns";

type Duration = { key: string; label: string; unit: string; amount: number };
type Plan = { durationKey: string; originalPrice: number; promotionalPrice: number; discountPercent: number };
type Domain = { id: string; name: string };
type Internship = { id: string; title: string; domainId: string };

export function ApplicationForm({
  internships,
  domains,
  durations,
  plans,
  defaults,
}: {
  internships: Internship[];
  domains: Domain[];
  durations: Duration[];
  plans: Plan[];
  defaults: {
    internshipId?: string;
    domainId?: string;
    name: string;
    email: string;
    mobile: string;
    college: string;
    course: string;
    branch: string;
    graduationYear?: number;
  };
}) {
  const [durationKey, setDurationKey] = useState(durations[3]?.key ?? durations[0]?.key ?? "");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const duration = durations.find((item) => item.key === durationKey);
  const plan = plans.find((item) => item.durationKey === durationKey);
  const endDate = useMemo(() => {
    if (!duration) return "";
    const start = new Date(startDate);
    const end = duration.unit === "WEEKS" ? addWeeks(start, duration.amount) : addMonths(start, duration.amount);
    return format(end, "yyyy-MM-dd");
  }, [duration, startDate]);
  const price = plan
    ? calculatePrice({
        originalPrice: plan.originalPrice,
        promotionalPrice: coupon ? undefined : plan.promotionalPrice,
        couponPercent: coupon.toUpperCase() === "INTERN50" ? 50 : undefined,
      })
    : null;

  async function action(formData: FormData) {
    setError(null);
    const result = await submitApplicationAction(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="space-y-8">
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-semibold">Personal details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field name="professionalName" label="Full Name" defaultValue={defaults.name} required />
          <Field name="email" label="Email" type="email" defaultValue={defaults.email} required />
          <Field name="mobile" label="Mobile" defaultValue={defaults.mobile} required />
          <Field name="dateOfBirth" label="Date of Birth" type="date" />
          <Field name="college" label="College" defaultValue={defaults.college} required />
          <Field name="course" label="Course" defaultValue={defaults.course} required />
          <Field name="branch" label="Branch" defaultValue={defaults.branch} required />
          <Field name="graduationYear" label="Graduation Year" type="number" defaultValue={defaults.graduationYear?.toString()} />
        </div>
      </section>
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-semibold">Internship details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="domainId">Domain</Label>
            <select id="domainId" name="domainId" required defaultValue={defaults.domainId} className="h-11 w-full rounded-xl border px-3">
              <option value="">Select domain</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>{domain.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="internshipId">Internship Program</Label>
            <select id="internshipId" name="internshipId" required defaultValue={defaults.internshipId} className="h-11 w-full rounded-xl border px-3">
              {internships.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="durationKey">Duration</Label>
            <select id="durationKey" name="durationKey" value={durationKey} onChange={(e) => setDurationKey(e.target.value)} className="h-11 w-full rounded-xl border px-3">
              {durations.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
          </div>
          <Field name="startDate" label="Start Date" type="date" value={startDate} onChange={setStartDate} />
          <div>
            <Label>End Date</Label>
            <Input value={endDate} readOnly aria-readonly />
          </div>
          <div>
            <Label htmlFor="mode">Mode</Label>
            <select id="mode" name="mode" className="h-11 w-full rounded-xl border px-3" defaultValue="ONLINE">
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <div>
            <Label htmlFor="skillLevel">Current skill level</Label>
            <select id="skillLevel" name="skillLevel" className="h-11 w-full rounded-xl border px-3" defaultValue="BEGINNER">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="learningGoals">Learning goals</Label>
          <Textarea id="learningGoals" name="learningGoals" />
        </div>
        <div className="mt-4">
          <Label htmlFor="motivation">Why do you want to join this internship?</Label>
          <Textarea id="motivation" name="motivation" required />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field name="linkedinUrl" label="LinkedIn URL" />
          <Field name="githubUrl" label="GitHub URL" />
          <Field name="portfolioUrl" label="Portfolio URL" />
        </div>
        <div className="mt-4">
          <Label htmlFor="couponCode">Coupon</Label>
          <Input id="couponCode" name="couponCode" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="INTERN50" />
        </div>
        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" name="declaredAccurate" required className="mt-1" />
          I confirm that the information provided is accurate.
        </label>
      </section>
      {price ? (
        <PriceBreakdown
          originalPrice={price.originalPrice}
          discountPercent={price.discountPercent}
          discountAmount={price.discountAmount}
          totalAmount={price.totalAmount}
        />
      ) : null}
      <Button type="submit" variant="primary">Submit Application</Button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={value == null ? defaultValue : undefined}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </div>
  );
}
