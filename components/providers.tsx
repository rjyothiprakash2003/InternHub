"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "rounded-2xl border border-slate-200 shadow-lg",
      }}
    />
  );
}
