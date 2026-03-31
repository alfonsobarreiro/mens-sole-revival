import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-salesy-heading",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-salesy-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rejected Direction — Salesy / High-Pressure | Men's Sole Revival",
  description: "Case study artifact: the high-pressure sales direction that was evaluated and rejected.",
  robots: { index: false, follow: false },
};

export default function Homepage3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${oswald.variable} ${roboto.variable}`}>
      {children}
    </div>
  );
}
