import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { assessmentAppSchema } from "@/lib/site";
import { buildBreadcrumb } from "@/lib/breadcrumb";

// Server layout so the client assessment page gets metadata + WebApplication
// JSON-LD (the interactive tool is a "use client" component).
export const metadata: Metadata = {
  title: { absolute: "Free 5-Minute Men's Foot Health Assessment" },
  description:
    "A free 5-minute foot-health self-check for men. Flag nail, skin, pain, alignment, and footwear-fit issues and get specific guides, a routine, and podiatrist-visit prep.",
  alternates: { canonical: "/assessment" },
  openGraph: {
    title: "Free 5-Minute Men's Foot Health Assessment",
    description:
      "Find out where your feet stand in 5 minutes — then get a specific next step.",
    url: "/assessment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 5-Minute Men's Foot Health Assessment",
    description: "Find out where your feet stand in 5 minutes.",
  },
};

const assessmentBreadcrumb = buildBreadcrumb([
  { name: "Assessment", path: "/assessment" },
]);

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={[assessmentAppSchema, assessmentBreadcrumb]} />
      {children}
    </>
  );
}
