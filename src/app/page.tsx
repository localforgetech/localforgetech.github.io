import {
  ArrowRight,
  Check,
  Clock,
  Code2,
  Compass,
  Database,
  Globe2,
  Hammer,
  KeyRound,
  LifeBuoy,
  MapPin,
  MessageCircle,
  PenTool,
  Phone,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BrandLockup, BrandMark } from "@/components/site/brand-mark";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { SiteHeader } from "@/components/site/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BUDGET_OPTIONS, BRAND, formatINR } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Custom software, websites & apps in Jind",
  description:
    "LocalForge Tech builds custom mobile apps, high-performance websites and workflow automation for businesses in Jind, Haryana and across India.",
};

const TRUST_POINTS = [
  { icon: MapPin, label: "Built in Jind", note: "Local team, in-person meetings" },
  { icon: ShieldCheck, label: "Fixed-scope quotes", note: "Know the cost before we start" },
  { icon: Code2, label: "You own the code", note: "Code and data stay yours" },
  { icon: LifeBuoy, label: "Support after launch", note: "We stay on after go-live" },
];

const SERVICES = [
  {
    icon: Smartphone,
    title: "Custom mobile apps",
    description:
      "Android and iOS apps for gyms, retail stores and service businesses — built around the way your customers already interact with you.",
    points: [
      "Member attendance and activity tracking",
      "Bookings, reminders and push notifications",
      "Secure in-app logins and member profiles",
    ],
  },
  {
    icon: Globe2,
    title: "High-performance websites",
    description:
      "Fast, mobile-first websites that make it easy for customers to find you on Google and start a conversation in one tap.",
    points: [
      "SEO and local search foundations",
      "Quick-loading, responsive pages",
      "WhatsApp and enquiry capture built in",
    ],
  },
  {
    icon: Workflow,
    title: "Automation dashboards",
    description:
      "Replace registers and spreadsheets with internal tools that keep your team in sync and your records in one place.",
    points: [
      "Automated billing and invoices",
      "Lead pipeline and client records",
      "Live reporting for day-to-day decisions",
    ],
  },
];

const PROCESS = [
  {
    step: "01",
    icon: Compass,
    title: "Discover",
    description:
      "We talk through your workflow, the problem you want solved and what success looks like. You get a clear scope and a fixed quote.",
  },
  {
    step: "02",
    icon: PenTool,
    title: "Design",
    description:
      "We map the screens and flows before writing code, so you can see and approve how the product will work.",
  },
  {
    step: "03",
    icon: Hammer,
    title: "Build",
    description:
      "We build in short, reviewable stages and share progress as we go. You can test each piece as it comes together.",
  },
  {
    step: "04",
    icon: LifeBuoy,
    title: "Launch & support",
    description:
      "We deploy, hand over the code and stay available for fixes and improvements after go-live.",
  },
];

const REASONS = [
  {
    icon: ShieldCheck,
    title: "End-to-end data protection",
    description:
      "Business and customer data is handled with modern encryption and sensible access controls.",
  },
  {
    icon: Code2,
    title: "Clean, sanitised code",
    description:
      "Inputs are validated and code is reviewed, so the software stays stable and secure in daily use.",
  },
  {
    icon: KeyRound,
    title: "Restricted admin access",
    description:
      "Internal tools and records sit behind authenticated, role-limited access — not open links.",
  },
  {
    icon: Database,
    title: "You own your data",
    description:
      "Your code and records stay yours, with exports available whenever you need them.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: 15000,
    tagline: "Landing page or basic website",
    features: [
      "Single-page or small multi-page site",
      "Mobile-first, responsive design",
      "Contact form and WhatsApp button",
      "Basic SEO setup",
    ],
    highlighted: false,
  },
  {
    name: "Studio",
    price: 35000,
    tagline: "Custom app or standard portal",
    features: [
      "Everything in Starter",
      "Custom mobile app or web portal",
      "User logins and role-based access",
      "30 days of post-launch support",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    price: 75000,
    tagline: "Advanced platform and automation",
    features: [
      "Everything in Studio",
      "Billing, invoicing and automation",
      "Admin dashboard and reporting",
      "Priority support and maintenance",
    ],
    highlighted: false,
  },
];

const FAQS = [
  {
    q: "How long does a project take?",
    a: "A landing page usually takes 1–2 weeks. A custom app or portal typically takes 4–8 weeks depending on scope. We agree on a clear timeline before any work begins.",
  },
  {
    q: "Do I own the code and my data?",
    a: "Yes. The code, designs and data we create for you belong to you. We can export your data at any time and hand over the source code at the end of the project.",
  },
  {
    q: "What do you need from me to start?",
    a: "A short description of how your business works today, any existing content or branding, and one point of contact on your side. We handle the rest.",
  },
  {
    q: "Do you support the software after launch?",
    a: "Yes. Every project includes a support window after go-live, and we offer ongoing maintenance if you would like us to keep improving and hosting it.",
  },
  {
    q: "Do you work with businesses outside Jind?",
    a: "We are based in Jind and work with clients across Haryana and the rest of India. Meetings can happen in person or over a call, whichever is easier for you.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
          />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.08] px-3 py-1 text-xs font-medium text-cyan-300">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                Software studio · Jind, Haryana
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Custom software that{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  fits how your business works.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                LocalForge Tech designs mobile apps, fast websites and internal
                dashboards for gyms, schools, clinics and shops in Jind and
                across Haryana — shaped around the way you already work.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6 font-semibold">
                  <a href="#enquiry">
                    Start a project <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/15 bg-white/[0.02] px-6 font-semibold"
                >
                  <a href="#services">Explore services</a>
                </Button>
              </div>
              <p className="mt-6 text-xs text-slate-500">
                Fixed-scope quotes · Direct founder access · Support in Hindi
                and English
              </p>
            </div>

            {/* Capability visual */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] bg-cyan-500/10 blur-3xl"
              />
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-3 shadow-2xl shadow-black/40">
                <div className="rounded-2xl border border-white/10 bg-[#0a1220] p-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-rose-400/70" />
                      <span className="size-2.5 rounded-full bg-amber-400/70" />
                      <span className="size-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      What we build
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {SERVICES.map((service) => (
                      <div
                        key={service.title}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                          <service.icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {service.title}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {service.points[0]}
                          </p>
                        </div>
                        <Check className="ml-auto size-4 shrink-0 text-emerald-400" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] px-3 py-2.5">
                    <span className="text-[11px] font-medium text-slate-300">
                      Design → Build → Launch
                    </span>
                    <span className="font-mono text-[10px] text-cyan-300">
                      localforgetech
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-white/[0.08] bg-white/[0.02]">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-px px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {TRUST_POINTS.map((point) => (
              <div
                key={point.label}
                className="flex items-start gap-3 py-5 sm:px-2"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-cyan-300">
                  <point.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {point.label}
                  </p>
                  <p className="text-xs text-slate-400">{point.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="What we build"
              title="Software for the work you do every day"
              description="We focus on three things and do them well: apps your customers use, websites that bring in enquiries, and internal tools that save your team time."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <div
                  key={service.title}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-cyan-500/30 hover:bg-white/[0.04]"
                >
                  <span className="grid size-12 place-items-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300 transition-transform group-hover:-translate-y-0.5">
                    <service.icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {service.description}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-5">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section
          id="process"
          className="scroll-mt-20 border-y border-white/[0.08] bg-white/[0.02] py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="How we work"
              title="A clear process, from first call to launch"
              description="No black boxes. You know what is happening at every stage and what comes next."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-white/10 bg-[#0a1220] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                      <item.icon className="size-5" />
                    </span>
                    <span className="font-mono text-xs text-slate-600">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section id="why" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Why LocalForge"
              title="Built with security and ownership in mind"
              description="Your software should protect your business, not create new risks. These are the standards we hold every project to."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {REASONS.map((reason) => (
                <div
                  key={reason.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                    <reason.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {reason.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="scroll-mt-20 border-y border-white/[0.08] bg-white/[0.02] py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Starting points"
              title="Transparent pricing, quoted up front"
              description="Every project is scoped individually, but these are the ranges we usually work in. You get a fixed quote after a short discovery call."
              align="center"
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={
                    plan.highlighted
                      ? "relative flex flex-col rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-500/[0.12] to-white/[0.02] p-6 shadow-xl shadow-cyan-500/5"
                      : "relative flex flex-col rounded-2xl border border-white/10 bg-[#0a1220] p-6"
                  }
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-6 rounded-full border border-cyan-400/40 bg-[#0a1220] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                      Most requested
                    </span>
                  )}
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                    {plan.name}
                  </h3>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-white">
                      {formatINR(plan.price)}
                    </span>
                    <span className="text-sm text-slate-400">+</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{plan.tagline}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/[0.08] pt-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.highlighted ? "default" : "outline"}
                    className={
                      plan.highlighted
                        ? "mt-6 w-full font-semibold"
                        : "mt-6 w-full border-white/15 bg-transparent font-semibold"
                    }
                  >
                    <a href="#enquiry">Enquire about {plan.name}</a>
                  </Button>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-400">
              Need something bigger? Full custom ecosystems start at{" "}
              <span className="font-semibold text-white">
                {formatINR(120000)}
              </span>
              . Tell us what you have in mind and we will scope it with you.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions we hear before every project"
              description="Still unsure about something? Send us a message on WhatsApp — we are happy to talk it through."
            />
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-400">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Enquiry */}
        <section
          id="enquiry"
          className="scroll-mt-20 border-t border-white/[0.08] bg-white/[0.02] py-20 sm:py-28"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Start your project
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Tell us what you need built
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                Share a few details and we will get back to you on WhatsApp to
                understand your requirements and prepare a fixed quote.
              </p>

              <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-[#0a1220] p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Visit us</p>
                    <p className="text-sm text-slate-400">{BRAND.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Call or WhatsApp
                    </p>
                    <a
                      href={`tel:+${BRAND.phone}`}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {BRAND.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">Hours</p>
                    <p className="text-sm text-slate-400">{BRAND.hours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {BUDGET_OPTIONS.slice(0, 3).map((option) => (
                  <span
                    key={option.value}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-400"
                  >
                    from {formatINR(option.value)}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0a1220] p-6 shadow-2xl shadow-black/30 sm:p-8">
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#060a12]">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <BrandLockup />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                A software studio in Jind building apps, websites and automation
                for local businesses across Haryana.
              </p>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
              >
                <MessageCircle className="size-4" /> Chat on WhatsApp
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Explore
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#services" className="hover:text-cyan-300">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#process" className="hover:text-cyan-300">
                    Process
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-cyan-300">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cyan-300">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Contact
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" />
                  {BRAND.address}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-slate-500" />
                  <a
                    href={`tel:+${BRAND.phone}`}
                    className="hover:text-cyan-300"
                  >
                    {BRAND.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-slate-500" />
                  {BRAND.hours}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <BrandMark className="size-7 rounded-lg text-[11px]" />
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/crm"
                className="inline-flex items-center gap-1.5 text-slate-500 transition-colors hover:text-cyan-300"
              >
                <KeyRound className="size-3.5" /> CRM portal
              </Link>
              <a
                href="#enquiry"
                className="text-slate-500 transition-colors hover:text-cyan-300"
              >
                Start a project
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
