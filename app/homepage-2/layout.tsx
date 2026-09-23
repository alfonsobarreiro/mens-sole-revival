import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Merriweather, Inter } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-clinical-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-clinical-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rejected Direction — Clinical Palette | Men's Sole Revival",
  description: "Case study artifact: the clinical/health-advisory direction that was evaluated and rejected.",
  robots: { index: false, follow: false },
};

export default function Homepage2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoring surface only: a 404 on the live site, the same rule as /case-study.
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className={`${merriweather.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
