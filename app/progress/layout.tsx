import type { Metadata } from "next";

// /progress carries personal magic-link entry — no crawl.
export const metadata: Metadata = {
  title: "Your progress",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
