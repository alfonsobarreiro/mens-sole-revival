import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Men’s Sole Revival",
    template: "%s · Men’s Sole Revival",
  },
  description:
    "Evidence-based foot care routines and starter kits for men over 40. No gimmicks. Just practical care that works.",
  keywords: [
    "men’s foot care",
    "foot pain",
    "toenail fungus",
    "toe alignment",
    "plantar fasciitis",
    "men over 40 health",
  ],
  openGraph: {
    title: "Men’s Sole Revival",
    description:
      "Practical, evidence-based foot care for men over 40. Start with a routine. Upgrade with a kit.",
    url: "https://mens-sole-revival.vercel.app",
    siteName: "Men’s Sole Revival",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
