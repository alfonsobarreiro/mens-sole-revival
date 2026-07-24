import type { Metadata } from "next";
import { Lora, DM_Sans, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { SITE_URL, organizationSchema, webSiteSchema } from "@/lib/site";
import "./globals.css";

// Microsoft Clarity — qualitative analytics (session replay, heatmaps).
// Set NEXT_PUBLIC_CLARITY_PROJECT_ID on Vercel to enable. Inert when missing.
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Men's Sole Revival",
    template: "%s | Men's Sole Revival",
  },
  description:
    "Foot care, footwear, and the daily habits that keep men moving well into their best decades.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        <JsonLd schema={[organizationSchema, webSiteSchema]} />
        {children}
        {/* Exit-intent popup — client component, self-suppresses on
            /newsletter, /assessment, and /foot-check routes. */}
        <ExitIntentPopup />
        <GoogleAnalytics gaId="G-QT90WR1MPD" />
        <Analytics />
        {clarityId && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
