"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { InternHubLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/disclosure";
import Link from "next/link";

export function AuthPanel() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [tab, setTab] = useState(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onLogin(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        remember: formData.get("remember") === "on",
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Unable to login.");
      return;
    }
    window.location.href = data.redirectTo;
  }

  async function onRegister(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        mobile: formData.get("mobile"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
        college: formData.get("college"),
        course: formData.get("course"),
        branch: formData.get("branch"),
        graduationYear: Number(formData.get("graduationYear")),
        city: formData.get("city"),
        state: formData.get("state"),
        terms: formData.get("terms") === "on",
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Unable to register.");
      return;
    }
    window.location.href = data.redirectTo;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-[linear-gradient(160deg,#071529,#163a6b)] p-10 text-white lg:flex">
        <Link href="/">
          <InternHubLogo inverted />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Student career platform</p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold">Build your internship journey in one place.</h1>
          <ul className="mt-8 space-y-3 text-white/75">
            <li>Explore structured internship domains</li>
            <li>Apply, pay, and track progress</li>
            <li>Receive offer letters and verifiable certificates</li>
          </ul>
        </div>
        <p className="text-sm text-white/60">Demo accounts are labeled in the README and are not real student identities.</p>
      </aside>
      <div className="flex items-center bg-[var(--ih-canvas)] px-4 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <InternHubLogo />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <TabsContent value="login" className="mt-6">
              <form action={onLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" autoComplete="email" required />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" name="password" type="password" autoComplete="current-password" required />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input type="checkbox" name="remember" defaultChecked /> Remember me
                  </label>
                  <Link href="/login/forgot" className="text-[var(--ih-blue)]">
                    Forgot password
                  </Link>
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={pending}>
                  {pending ? "Signing in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <form action={onRegister} className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" name="mobile" inputMode="numeric" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="college">College/University</Label>
                  <Input id="college" name="college" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input id="course" name="course" required />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch/Specialization</Label>
                    <Input id="branch" name="branch" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input id="graduationYear" name="graduationYear" type="number" min={2020} max={2035} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" required />
                  </div>
                </div>
                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input type="checkbox" name="terms" required className="mt-1" />
                  I agree to the <Link href="/legal/terms" className="text-[var(--ih-blue)]">Terms and Conditions</Link>
                </label>
                <FieldError />
                <Button type="submit" variant="primary" className="w-full" disabled={pending}>
                  {pending ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
