import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, buildItemList } from "@/lib/breadcrumb";
import { articleList } from "@/lib/ecosystem";

// Server layout so the client guides-index page gets a real title/description
// and a self-canonical. The canonical collapses all ?symptom= and ?q= faceted
// variants onto /guides, preventing duplicate-content indexing.
export const metadata: Metadata = {
  title: { absolute: "Foot-Health Guides for Men Over 40" },
  description:
    "Evidence-based guides on foot pain, toenail fungus, cracked heels, toe alignment, and footwear fit, organized by symptom. Start with what's bothering you.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Foot-Health Guides for Men Over 40",
    description:
      "Evidence-based guides organized by symptom: pain, nails, skin, alignment, and footwear fit.",
    url: "/guides",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foot-Health Guides for Men Over 40",
    description:
      "Evidence-based guides organized by symptom for men over 40.",
  },
};

// SEO Bundle 4: BreadcrumbList + ItemList JSON-LD for guides index hub.
// Establishes /guides as a canonical hub over N guide leaves; unlocks
// sitelinks eligibility and breadcrumb SERP trails.
const guidesSchema = [
  buildBreadcrumb([{ name: "Guides", path: "/guides" }]),
  buildItemList(
    "Foot-Health Guides for Men Over 40",
    articleList.map((a) => ({
      name: a.title,
      path: `/guides/${a.slug}`,
      description: `${a.category} · ${a.readTime} read`,
    })),
  ),
];

export default function GuidesIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={guidesSchema} />
      {children}
    </>
  );
}
