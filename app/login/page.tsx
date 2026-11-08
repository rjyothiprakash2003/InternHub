import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata = { title: "Login or Register" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--ih-canvas)]" />}>
      <AuthPanel />
    </Suspense>
  );
}
