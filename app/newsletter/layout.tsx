import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Get the Weekly Guide for Men's Foot Health Over 40",
  },
  description:
    "One evidence-based guide a week for men over 40. Foot pain, footwear fit, routines that stick. No spam. Unsubscribe any time.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: "Get the Weekly Guide for Men's Foot Health Over 40",
    description:
      "One evidence-based guide a week for men over 40. Foot pain, footwear fit, routines that stick.",
    url: `${SITE_URL}/newsletter`,
    type: "website",
    siteName: "Men's Sole Revival",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get the Weekly Guide for Men's Foot Health Over 40",
    description:
      "One evidence-based guide a week for men over 40. Foot pain, footwear fit, routines that stick.",
  },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
