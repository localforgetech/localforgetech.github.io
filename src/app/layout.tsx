import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BRAND } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LocalForge Tech — Custom software studio in Jind, Haryana",
    template: "%s · LocalForge Tech",
  },
  description:
    "LocalForge Tech designs and builds custom mobile apps, high-performance websites and workflow automation for businesses in Jind, Haryana and across India.",
  keywords: [
    "software development Jind",
    "mobile app development Haryana",
    "website design Jind",
    "business automation India",
    "LocalForge Tech",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    title: "LocalForge Tech — Custom software studio in Jind, Haryana",
    description:
      "Custom mobile apps, high-performance websites and workflow automation for local businesses.",
    type: "website",
    locale: "en_IN",
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalForge Tech — Custom software studio",
    description:
      "Custom mobile apps, high-performance websites and workflow automation for local businesses.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
        {/* WARNING FOR AGENT: DO NOT REMOVE THIS SCRIPT */}
        <Script src="https://cdn.jsdelivr.net/gh/IdeavoAI/ideavo-scripts@latest/scripts/ideavo.min.js" />
      </body>
    </html>
  );
}
