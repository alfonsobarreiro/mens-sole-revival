import type { Metadata } from "next";
import { Lora, DM_Sans, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Display typeface — used ONLY for large architectural section labels and hero headlines.
// Barlow Condensed ExtraBold gives the bold editorial punch of Vivobarefoot-style type
// without displacing Lora (warmth/editorial) or DM Sans (UI/clarity).
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Men's Sole Revival",
    template: "%s | Men's Sole Revival",
  },
  description:
    "Foot care, footwear, and the holistic habits that keep men moving well into their best decades.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
      <GoogleAnalytics gaId="G-QT90WR1MPD" />
      <Analytics />
    </html>
  );
}
