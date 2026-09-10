import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildRoutineMetadata, buildRoutineSchema } from "@/lib/guide-seo";

const SLUG = "strength";

export const metadata: Metadata = buildRoutineMetadata(SLUG);

export default function RoutineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={buildRoutineSchema(SLUG)} />
      {children}
    </>
  );
}
