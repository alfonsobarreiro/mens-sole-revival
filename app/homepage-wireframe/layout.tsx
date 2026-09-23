import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Lo-Fi Wireframe | Men's Sole Revival",
  description: "Case study artifact: lo-fi wireframe showing layout structure before visual design.",
  robots: { index: false, follow: false },
};

export default function WireframeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoring surface only: a 404 on the live site, the same rule as /case-study.
  if (process.env.VERCEL_ENV === "production") notFound();
  return <div>{children}</div>;
}
