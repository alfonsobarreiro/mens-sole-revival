import type { Metadata } from "next";

// Internal design tool — never index.
export const metadata: Metadata = {
  title: "Imagery treatments",
  robots: { index: false, follow: false, nocache: true },
};

export default function ImageryTreatmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
