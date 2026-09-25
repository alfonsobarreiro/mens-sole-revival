import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildGuideMetadata, buildGuideSchema } from "@/lib/guide-seo";

const SLUG = "heel-spurs-explained";

export const metadata: Metadata = buildGuideMetadata(SLUG);

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={buildGuideSchema(SLUG)} />
      {children}
    </>
  );
}
