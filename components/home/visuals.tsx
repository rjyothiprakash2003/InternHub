export function HeroArt() {
  return (
    <svg viewBox="0 0 560 460" className="h-auto w-full" role="img" aria-label="Students growing through connected internship pathways">
      <defs>
        <linearGradient id="hero-a" x1="80" y1="40" x2="500" y2="420">
          <stop stopColor="#2F6FED" />
          <stop offset="1" stopColor="#6E4BFF" />
        </linearGradient>
      </defs>
      <rect x="36" y="28" width="488" height="404" rx="36" fill="#0B1F3A" />
      <circle cx="160" cy="150" r="54" fill="#12284A" />
      <circle cx="310" cy="120" r="36" fill="#163A6B" />
      <circle cx="400" cy="210" r="70" fill="#10233F" />
      <path d="M160 150h150M310 120l90 90M160 150l240 60" stroke="url(#hero-a)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="150" r="8" fill="#7CDBE8" />
      <circle cx="310" cy="120" r="8" fill="#2F6FED" />
      <circle cx="400" cy="210" r="8" fill="#6E4BFF" />
      <rect x="92" y="268" width="180" height="96" rx="18" fill="#132A4C" />
      <rect x="108" y="288" width="90" height="10" rx="5" fill="#7CDBE8" />
      <rect x="108" y="308" width="140" height="8" rx="4" fill="#2F6FED" opacity="0.7" />
      <rect x="108" y="324" width="112" height="8" rx="4" fill="#6E4BFF" opacity="0.7" />
      <rect x="300" y="286" width="148" height="118" rx="20" fill="#163A6B" />
      <path d="M328 372v-48l36-18 36 18v48" fill="none" stroke="#7CDBE8" strokeWidth="4" />
      <path d="M346 372v-22h36v22" fill="#2F6FED" />
    </svg>
  );
}

export function AccreditationPlaceholders({
  aicteEnabled,
  isoEnabled,
  aicteLabel,
  isoLabel,
}: {
  aicteEnabled: boolean;
  isoEnabled: boolean;
  aicteLabel: string;
  isoLabel: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{aicteLabel}</p>
        <p className="mt-2 text-sm text-slate-600">
          {aicteEnabled
            ? "Authorized AICTE-related information is enabled by administrators."
            : "This placeholder can display authorized AICTE-related information only after InternHub has the legal right to do so. InternHub does not claim AICTE approval or certification."}
        </p>
      </div>
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{isoLabel}</p>
        <p className="mt-2 text-sm text-slate-600">
          {isoEnabled
            ? "An authorized certification-body mark can be shown here when InternHub holds a valid license to display it."
            : "ISO corporate logos and unlicensed certification marks are not displayed. Administrators can enable an authorized mark only after verification."}
        </p>
      </div>
    </div>
  );
}
