import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildGuideMetadata, buildGuideSchema } from "@/lib/guide-seo";

const SLUG = "foot-pain-from-standing-all-day";

export const metadata: Metadata = buildGuideMetadata(SLUG);

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={buildGuideSchema(SLUG)} />
      {children}
    </>
  );
}
