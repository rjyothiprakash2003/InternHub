import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "horizontal" | "compact";
  className?: string;
  wordmarkClassName?: string;
  inverted?: boolean;
};

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-labelledby="internhub-mark-title"
    >
      <title id="internhub-mark-title">InternHub</title>
      <defs>
        <linearGradient id="ih-grad" x1="8" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F6FED" />
          <stop offset="1" stopColor="#6E4BFF" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="#071529" />
      <path
        d="M14 31.5c4.2-1.8 6.4-6.2 6.4-10.4V12.8h7.2v8.3c0 4.2 2.1 8.6 6.4 10.4"
        fill="none"
        stroke="url(#ih-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="16" r="3.1" fill="#7CDBE8" />
      <circle cx="14" cy="31.5" r="2.4" fill="#2F6FED" />
      <circle cx="34" cy="31.5" r="2.4" fill="#6E4BFF" />
      <path d="M24 19.4v14.2" stroke="#E8EEF9" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20.2 29.6 24 33.6l3.8-4" stroke="#7CDBE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InternHubLogo({
  variant = "horizontal",
  className,
  wordmarkClassName,
  inverted = false,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark className={cn(variant === "compact" ? "h-9 w-9" : "h-10 w-10")} />
      {variant === "horizontal" ? (
        <span className={cn("leading-none", wordmarkClassName)}>
          <span
            className={cn(
              "block font-semibold tracking-[-0.04em]",
              inverted ? "text-white" : "text-[var(--ih-navy)]",
            )}
            style={{ fontSize: "1.15rem" }}
          >
            Intern<span className="text-[var(--ih-blue)]">Hub</span>
          </span>
          <span
            className={cn(
              "mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em]",
              inverted ? "text-white/70" : "text-slate-500",
            )}
          >
            Learn. Intern. Build.
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function InternHubMark({ className }: { className?: string }) {
  return <Mark className={className} />;
}
