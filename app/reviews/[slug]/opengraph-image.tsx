/**
 * Dynamic OG image for any /reviews/[slug] page. Renders product name +
 * brand + verdict from staticReviews. If the slug doesn't match a known
 * review (Sanity-only entries, typos), falls back to a generic review
 * card. No Sanity fetch on the edge — staticReviews covers the core
 * catalog and gives Sanity-only items a graceful fallback rather than
 * breaking the OG endpoint.
 */
import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { staticReviews, verdictConfig } from "@/lib/reviews";

export const runtime = "edge";
export const alt = "Product Review — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = staticReviews.find((r) => r.slug === slug);

  if (!review) {
    return renderMsrOg({
      overline: "Review",
      title: "Honest, evidence-based product reviews.",
      meta: "We test it. You decide.",
    });
  }

  const verdictLabel = review.verdict
    ? verdictConfig[review.verdict].label.toUpperCase()
    : "REVIEWED";

  return renderMsrOg({
    overline: `${verdictLabel} · ${review.brand}`,
    title: review.productName,
    meta: review.tagline ? truncate(review.tagline, 96) : "Reviewed by Men's Sole Revival",
  });
}
