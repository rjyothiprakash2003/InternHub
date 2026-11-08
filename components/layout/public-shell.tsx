import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--ih-canvas)]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
