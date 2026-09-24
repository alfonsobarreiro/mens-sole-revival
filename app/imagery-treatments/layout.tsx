import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Internal design tool — never index.
export const metadata: Metadata = {
  title: "Imagery treatments",
  robots: { index: false, follow: false, nocache: true },
};

// Authoring surface only: reachable on previews and locally, a 404 on the
// live site, the same rule as the other drafts.
export default function ImageryTreatmentsLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <>{children}</>;
}
