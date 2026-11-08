import { PublicShell } from "@/components/layout/public-shell";

const pages: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: "Terms & Conditions",
    body: [
      "InternHub provides structured internship programs, application processing, payment collection, and document generation.",
      "Students must provide accurate personal and academic information. False information may result in application rejection or document revocation.",
      "Certificates and offer letters represent InternHub internship services that were actually recorded and verified in the platform.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "InternHub collects account, profile, application, payment metadata, and document records needed to operate the platform.",
      "Passwords are stored as hashes. Card numbers and CVV are never stored.",
      "Student information is not published on public verification pages beyond what is required to confirm a document.",
    ],
  },
  refund: {
    title: "Refund Policy",
    body: [
      "Refund requests are reviewed by administrators according to application and payment status.",
      "Refund outcomes are recorded against the payment record. InternHub does not store card credentials.",
    ],
  },
  "internship-terms": {
    title: "Internship Terms",
    body: [
      "Internship duration, domain, and mode are selected from administrator-approved lists.",
      "Completion requirements must be satisfied before a certificate can be generated.",
    ],
  },
  "certificate-disclaimer": {
    title: "Certificate Disclaimer",
    body: [
      "InternHub certificates confirm completion of InternHub internship programs recorded in this platform.",
      "InternHub does not claim AICTE approval, government approval, university affiliation, ISO certification, or placement guarantees unless independently verified and enabled by an administrator.",
    ],
  },
  "payment-terms": {
    title: "Payment Terms",
    body: [
      "Payable amounts are calculated by the InternHub pricing engine from original price, discounts, coupons, and tax settings.",
      "Successful payment is verified server-side before an application is marked paid.",
    ],
  },
  "student-agreement": {
    title: "Student Agreement",
    body: [
      "By creating an account, students agree to provide accurate details, complete assigned internship requirements, and use generated documents honestly.",
    ],
  },
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-16">Page not found.</div>
      </PublicShell>
    );
  }
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-[var(--ih-navy)]">{page.title}</h1>
        {page.body.map((p) => (
          <p key={p} className="mt-4 leading-8 text-slate-600">{p}</p>
        ))}
      </article>
    </PublicShell>
  );
}
