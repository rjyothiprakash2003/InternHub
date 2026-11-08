export const APP_NAME = "InternHub";
export const TAGLINE = "Learn. Intern. Build Your Future.";
export const SUPPORTING_LINE =
  "Industry-ready internships designed to turn students into confident professionals.";

export const APPLICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAYMENT_COMPLETED",
  "OFFER_LETTER_GENERATED",
  "INTERNSHIP_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CERTIFICATE_ELIGIBLE",
  "CERTIFICATE_GENERATED",
  "REJECTED",
  "CANCELLED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STUDENT_JOURNEY = [
  { key: "SUBMITTED", label: "Applied" },
  { key: "PAYMENT_COMPLETED", label: "Payment Completed" },
  { key: "OFFER_LETTER_GENERATED", label: "Offer Letter Generated" },
  { key: "INTERNSHIP_STARTED", label: "Internship Started" },
  { key: "IN_PROGRESS", label: "Internship In Progress" },
  { key: "COMPLETED", label: "Internship Completed" },
  { key: "CERTIFICATE_GENERATED", label: "Certificate Generated" },
] as const;

export const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const MODES = ["ONLINE", "HYBRID", "OFFLINE"] as const;

export const DEFAULT_INCLUDES = [
  "Internship Certificate",
  "Offer Letter",
  "Project Experience",
  "Performance Evaluation",
  "Internship Documentation",
];

export const TRUST_ITEMS = [
  {
    title: "Structured Internship Programs",
    description: "Each program follows a defined learning path with projects, milestones, and documentation.",
    icon: "Layers3",
  },
  {
    title: "Professional Documentation",
    description: "Offer letters, completion certificates, and receipts are generated from verified records.",
    icon: "FileBadge",
  },
  {
    title: "Student-Friendly Pricing",
    description: "Promotional duration-based pricing is configured by administrators, not hardcoded in the UI.",
    icon: "BadgeIndianRupee",
  },
  {
    title: "Multiple Career Domains",
    description: "Explore technology, analytics, design, business, and more from a single platform.",
    icon: "Network",
  },
  {
    title: "Flexible Duration",
    description: "Choose 4 weeks to 6 months. End dates are calculated from approved duration rules.",
    icon: "CalendarRange",
  },
  {
    title: "Online Learning Support",
    description: "Complete internships remotely with structured tasks and progress tracking.",
    icon: "MonitorPlay",
  },
  {
    title: "Application Tracking",
    description: "Follow every stage from application to certificate from your student dashboard.",
    icon: "Route",
  },
  {
    title: "Certificate Verification",
    description: "Public QR verification confirms whether a document is valid, revoked, or not found.",
    icon: "ShieldCheck",
  },
] as const;

export const BENEFITS = [
  {
    title: "Practical Experience",
    description: "Work through structured internship tasks that simulate real project delivery, not just theory.",
    icon: "Briefcase",
  },
  {
    title: "Industry-Oriented Projects",
    description: "Build portfolio-ready artifacts aligned to the domain you select during application.",
    icon: "FolderKanban",
  },
  {
    title: "Professional Certificate",
    description: "Receive a completion certificate only after internship requirements are marked complete.",
    icon: "Award",
  },
  {
    title: "Internship Offer Letter",
    description: "Verified applications can receive an offer letter populated from your submitted details.",
    icon: "MailCheck",
  },
  {
    title: "Resume Enhancement",
    description: "Documented internship experience helps you present a clearer career narrative.",
    icon: "FileText",
  },
  {
    title: "Portfolio Building",
    description: "Use completed projects, skills, and documents to strengthen applications and interviews.",
    icon: "Images",
  },
  {
    title: "Flexible Duration",
    description: "Pick a duration that fits your academic calendar. The platform calculates end dates automatically.",
    icon: "Clock3",
  },
  {
    title: "Multiple Domains",
    description: "Choose from a managed catalog of internship domains rather than free-text entries.",
    icon: "Boxes",
  },
  {
    title: "Application Tracking",
    description: "See payment, offer letter, progress, and certificate status without chasing email threads.",
    icon: "ListChecks",
  },
  {
    title: "Affordable Pricing",
    description: "Transparent original, discount, and payable amounts are calculated by the pricing engine.",
    icon: "Wallet",
  },
  {
    title: "Structured Learning",
    description: "Programs include skills, outcomes, and documentation so the experience stays consistent.",
    icon: "BookOpenCheck",
  },
  {
    title: "Career Confidence",
    description: "Move from exploration to application, payment, internship, and verified documentation in one place.",
    icon: "Sparkles",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create Account",
    description: "Register with academic details and sign in from the same page.",
  },
  {
    step: 2,
    title: "Choose Internship",
    description: "Explore domains and select a program that matches your career direction.",
  },
  {
    step: 3,
    title: "Complete Application",
    description: "Provide personal, academic, and internship details. Domain and duration are dropdowns only.",
  },
  {
    step: 4,
    title: "Make Payment",
    description: "Review original price, discount, tax, and payable amount before checkout.",
  },
  {
    step: 5,
    title: "Complete Internship",
    description: "Track milestones from offer letter through internship progress.",
  },
  {
    step: 6,
    title: "Receive Certificate",
    description: "After completion is verified, download your certificate and share the verification link.",
  },
] as const;

export const MISSION_CARDS = [
  {
    title: "Accessibility",
    description: "Internship programs should be reachable for students from different educational backgrounds.",
  },
  {
    title: "Practical Learning",
    description: "Experience is organized around projects, skills, and documented outcomes.",
  },
  {
    title: "Career Readiness",
    description: "The platform is designed to help students move from coursework toward professional confidence.",
  },
  {
    title: "Professional Growth",
    description: "Offer letters, progress tracking, and certificates support a complete internship journey.",
  },
] as const;

export const VISION_MILESTONES = [
  { year: "Now", title: "Structured internships", detail: "A transparent catalog of domains, durations, and pricing." },
  { year: "Next", title: "Trusted documentation", detail: "Offer letters and certificates generated from verified records." },
  { year: "Ahead", title: "Career transition", detail: "A platform students can rely on between education and employment." },
] as const;

export const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
