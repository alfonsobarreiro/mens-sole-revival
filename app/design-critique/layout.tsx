import { notFound } from "next/navigation";

// Authoring surface only. Reachable on previews and locally; a 404 on the
// live site, the same rule as /case-study.
export default function DraftLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}
