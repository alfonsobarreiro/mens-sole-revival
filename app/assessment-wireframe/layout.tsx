import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Assessment Wireframe | Men's Sole Revival",
  description: "Case study artifact: lo-fi wireframe showing the multi-step assessment flow structure before visual design.",
  robots: { index: false, follow: false },
};

export default function AssessmentWireframeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoring surface only: a 404 on the live site, the same rule as /case-study.
  if (process.env.VERCEL_ENV === "production") notFound();
  return <div>{children}</div>;
}
