"use client";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ih-canvas)] px-4">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">500</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ih-navy)]">Something went wrong</h1>
        <p className="mt-3 text-slate-600">Please try again. If a payment or application failed, your dashboard will show the current status.</p>
        <a href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-[var(--ih-navy)] px-5 text-sm font-semibold text-white">
          Return home
        </a>
      </div>
    </div>
  );
}
