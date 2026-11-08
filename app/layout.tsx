import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/providers";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "InternHub — Learn. Intern. Build Your Future.",
    template: "%s | InternHub",
  },
  description:
    "InternHub is a student internship platform for exploring domains, applying to structured programs, completing payment, and receiving professional internship documentation.",
  openGraph: {
    title: "InternHub — Learn. Intern. Build Your Future.",
    description:
      "Structured internships, student-friendly pricing, offer letters, and verifiable certificates.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
