import type { Metadata } from "next";

// Server layout so the client guides-index page gets a real title/description
// and a self-canonical. The canonical collapses all ?symptom= and ?q= faceted
// variants onto /guides, preventing duplicate-content indexing.
export const metadata: Metadata = {
  title: "Foot-Health Guides for Men Over 40",
  description:
    "Evidence-based guides on foot pain, toenail fungus, cracked heels, toe alignment, and footwear fit — organized by symptom. Start with what's bothering you.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Foot-Health Guides for Men Over 40",
    description:
      "Evidence-based guides organized by symptom: pain, nails, skin, alignment, and footwear fit.",
    url: "/guides",
    type: "website",
  },
};

export default function GuidesIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
