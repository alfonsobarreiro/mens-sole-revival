import { notFound } from "next/navigation";

// Authoring surface only: the case study lives on the portfolio, never here.
// A layout gate covers the cover and every frame; the per-page check it
// replaces left frame-2 through frame-9 reachable on the live site.
export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
