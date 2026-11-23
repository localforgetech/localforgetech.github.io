"use client";

import { Lock, Menu, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BrandLockup } from "@/components/site/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-white/10 bg-[#070b14]/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          aria-label={`${BRAND.name} home`}
        >
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/crm"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-cyan-300"
          >
            <Lock className="size-3.5" /> CRM
          </Link>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <MessageCircle className="size-3.5" /> WhatsApp
          </a>
          <Button asChild size="sm" className="h-9 px-4 font-semibold">
            <a href="#enquiry">Start a project</a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-9 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-white/10 bg-[#0a1120]">
            <SheetHeader>
              <SheetTitle className="text-left">
                <BrandLockup />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1 px-4">
              {NAV.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link
                  href="/crm"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-cyan-300"
                >
                  <Lock className="size-4" /> CRM portal
                </Link>
              </SheetClose>
            </nav>
            <div className="mt-4 flex flex-col gap-2 px-4">
              <SheetClose asChild>
                <Button asChild className="w-full font-semibold">
                  <a href="#enquiry">Start a project</a>
                </Button>
              </SheetClose>
              <Button
                asChild
                variant="outline"
                className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              >
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" /> WhatsApp us
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
