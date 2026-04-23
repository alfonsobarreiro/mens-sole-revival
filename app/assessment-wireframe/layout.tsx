import type { Metadata } from "next";

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
  return <div>{children}</div>;
}
