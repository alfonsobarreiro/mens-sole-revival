import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildGuideMetadata, buildGuideSchema } from "@/lib/guide-seo";

const SLUG = "big-toe-and-your-whole-body";

export const metadata: Metadata = buildGuideMetadata(SLUG);

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={buildGuideSchema(SLUG)} />
      {children}
    </>
  );
}
