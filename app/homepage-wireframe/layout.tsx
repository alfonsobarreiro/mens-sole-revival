import type { Metadata } from "next";

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
  return <div>{children}</div>;
}
