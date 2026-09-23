import type { Metadata } from "next";
import { Lora, Archivo, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import AnalyticsTags from "@/components/AnalyticsTags";
import JsonLd from "@/components/JsonLd";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, organizationSchema, webSiteSchema } from "@/lib/site";
import "./globals.css";

// Microsoft Clarity — qualitative analytics (session replay, heatmaps).
// Set NEXT_PUBLIC_CLARITY_PROJECT_ID on Vercel to enable. Inert when missing.
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

// Analytics tags fire only on the production deployment, so local runs and
// preview builds stay out of the Google Analytics property. Vercel Analytics
// separates environments on its own and is left unconditional.
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

// DS: Lora carries headings + wordmark, Archivo carries everything else.
// Kept Barlow Condensed as --font-display for back-compat with components
// that still reference it; new components should use --font-heading (Lora).
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Men's Sole Revival",
  },
  description: SITE_DESCRIPTION,
  // Site-wide OG + Twitter defaults — SEO Bundle 3 (2026-08-14).
  // Per-route metadata merges on top, so this is a safety net for any
  // route that doesn't set its own openGraph/twitter blocks.
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${archivo.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-bg-page antialiased" suppressHydrationWarning>
        <JsonLd schema={[organizationSchema, webSiteSchema]} />
        {children}
        {/* Exit-intent popup — client component, self-suppresses on
            /newsletter, /assessment, and /foot-check routes. */}
        <ExitIntentPopup />
        {/* GA + Clarity: production only, and never on /progress or /admin. */}
        <AnalyticsTags enabled={isProduction} gaId="G-QT90WR1MPD" clarityId={clarityId} />
        <Analytics />
      </body>
    </html>
  );
}
