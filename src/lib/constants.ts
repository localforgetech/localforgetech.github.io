export const BRAND = {
  name: "LocalForge Tech",
  tagline: "Custom software, built locally in Jind.",
  phoneDisplay: "+91 95186 16117",
  phone: "919518616117",
  whatsapp: "919518616117",
  address: "Huda Market, Jind, Haryana 126102",
  location: "Jind, Haryana",
  hours: "Mon–Sat, 10:00–19:00 IST",
} as const;

export const LEAD_STATUSES = [
  "New Lead",
  "Contacted",
  "Meeting Scheduled",
  "Proposal Sent",
  "Closed Won",
  "Closed Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const INDUSTRIES = [
  "Education",
  "Healthcare",
  "Retail",
  "Gym & Fitness",
  "Real Estate",
  "Services",
  "Hospitality",
  "Other",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const SOURCES = [
  "Cold Visit",
  "Instagram DM",
  "WhatsApp Outreach",
  "Referral",
  "LinkedIn",
  "Google Business",
  "Website Enquiry",
] as const;

export const LOG_TYPES = [
  "Call",
  "WhatsApp",
  "Email",
  "In-Person Meeting",
  "Site Visit",
  "Demo",
  "Other",
] as const;

export const BUDGET_OPTIONS = [
  { value: 10000, label: "₹10,000 — Landing page / basic website" },
  { value: 25000, label: "₹25,000 — Custom app / standard portal" },
  { value: 50000, label: "₹50,000 — Advanced platform & automation" },
  { value: 80000, label: "₹80,000+ — Full custom ecosystem" },
] as const;

export const STATUS_STYLES: Record<
  LeadStatus,
  { dot: string; badge: string; column: string }
> = {
  "New Lead": {
    dot: "bg-sky-400",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    column: "border-sky-500/30",
  },
  Contacted: {
    dot: "bg-blue-400",
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    column: "border-blue-500/30",
  },
  "Meeting Scheduled": {
    dot: "bg-amber-400",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    column: "border-amber-500/30",
  },
  "Proposal Sent": {
    dot: "bg-violet-400",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    column: "border-violet-500/30",
  },
  "Closed Won": {
    dot: "bg-emerald-400",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    column: "border-emerald-500/30",
  },
  "Closed Lost": {
    dot: "bg-rose-400",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    column: "border-rose-500/30",
  },
};

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappLink(phone: string, businessName: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("91") ? digits : `91${digits}`;
  const message = encodeURIComponent(
    `Hello ${businessName}, this is LocalForge Tech regarding your software project.`,
  );
  return `https://wa.me/${withCountry}?text=${message}`;
}
