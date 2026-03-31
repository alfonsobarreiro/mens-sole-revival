import type { Metadata } from "next";
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
  return (
    <div className={`${merriweather.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
