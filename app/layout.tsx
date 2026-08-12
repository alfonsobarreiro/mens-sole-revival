import type { Metadata } from "next";
import { Lora, Archivo, Barlow_Condensed } from "next/font/google";
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
    <html lang="en" className={`${lora.variable} ${archivo.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-bg-page antialiased" suppressHydrationWarning>
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
