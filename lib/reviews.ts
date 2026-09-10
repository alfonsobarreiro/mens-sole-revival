/**
 * Shared review data + helpers. Lives in lib/ (not under app/) so both
 * server pages (reviews/page.tsx, reviews/[slug]/page.tsx) and client
 * pages (assessment/page.tsx) and components (EcosystemFooter.tsx) can
 * import without dragging server-only exports across the boundary.
 */

export interface Review {
  _id?: string;
  productName: string;
  brand: string;
  slug: string;
  category?: string;
  verdict?: "recommended" | "conditional" | "skip";
  rating?: number;
  tagline?: string;
  retailPriceUsd?: number;
  publishedAt?: string;
  imageUrl?: string;
  /** SEO Bundle — CTR-optimized SERP title (Sep 2026). Optional. If
   *  absent, generateMetadata falls back to "{productName} Review: {tagline}".
   *  Add year signal + intent hook ("worth it in 2026", "for men over 40",
   *  "podiatrist-tested"). Kept separate from tagline so editorial UI copy
   *  stays clean while SERP copy earns the click. */
  seoTitle?: string;
  /** SEO Bundle — CTR-optimized meta description (140–160 chars). Optional. */
  seoDescription?: string;
}

// Verdict metadata — label only. Presentation is delegated to the DS Tag
// primitive via verdictToTagVariant() so verdicts stay on the sanctioned
// Foundations Color palette (no raw emerald/amber/red palette leaks).
export const verdictConfig = {
  recommended: { label: "Recommended" },
  conditional: { label: "Conditional" },
  skip:        { label: "Skip" },
} as const;

export type VerdictKey = keyof typeof verdictConfig;

// Maps a verdict key to the DS Tag variant that renders it. Weight-based
// hierarchy: solid ink → outline → accent-callout (DS Foundations Color
// has no success/warn/danger tokens).
export function verdictToTagVariant(
  key: VerdictKey,
): "verdict-recommended" | "verdict-conditional" | "verdict-skip" {
  return `verdict-${key}` as const;
}

export function categoryLabel(cat?: string): string {
  const map: Record<string, string> = {
    insoles:    "Insoles & Orthotics",
    antifungal: "Antifungal & Nail Care",
    creams:     "Creams & Moisturizers",
    powder:     "Powder & Deodorant",
    tools:      "Tools & Accessories",
    footwear:   "Footwear",
    alignment:  "Toe Alignment",
  };
  return cat ? (map[cat] ?? cat) : "";
}

// Six real products covering the core foot-health categories.
// When Sanity is connected, these fall back if the CMS query is empty.
export const staticReviews: Review[] = [
  {
    productName: "Superfeet BLUE Insoles",
    brand: "Superfeet",
    slug: "superfeet-blue-insoles",
    category: "insoles",
    verdict: "recommended",
    rating: 8.5,
    tagline: "The most reliable OTC insole for men who stand or walk all day.",
    retailPriceUsd: 55,
    publishedAt: "2026-03-01",
    imageUrl: "/images/pexels-8729236.jpg",
    seoTitle: "Superfeet BLUE Review (2026): Worth It for Men Over 40?",
    seoDescription:
      "Six months in the Superfeet BLUE. Where it works, where it doesn't, and who should skip it. Independent test, evidence-based, no affiliate spin.",
  },
  {
    productName: "Lamisil AT Antifungal Cream",
    brand: "Lamisil",
    slug: "lamisil-at-antifungal-cream",
    category: "antifungal",
    verdict: "recommended",
    rating: 8,
    tagline: "The OTC antifungal with the best clinical track record for athlete's foot.",
    retailPriceUsd: 18,
    publishedAt: "2026-03-05",
    imageUrl: "/images/pexels-10904211.jpg",
    seoTitle: "Lamisil AT Cream Review (2026): Does Terbinafine Actually Work?",
    seoDescription:
      "Full Lamisil AT review with the clinical evidence, the correct application, and the mistake that makes it fail. What terbinafine treats and what it doesn't.",
  },
  {
    productName: "Gehwol Fusskraft Soft Feet Cream",
    brand: "Gehwol",
    slug: "gehwol-fusskraft-soft-feet-cream",
    category: "creams",
    verdict: "recommended",
    rating: 9,
    tagline: "The German heel cream most podiatrists quietly recommend and most men have never heard of.",
    retailPriceUsd: 22,
    publishedAt: "2026-03-10",
    imageUrl: "/images/pexels-29145634.jpg",
    seoTitle: "Gehwol Fusskraft Review (2026): Is the German Foot Cream Worth $22?",
    seoDescription:
      "The urea + lactic acid combo in Gehwol Fusskraft is the reason podiatrists quietly recommend it. Full independent review, side-by-side vs OTC alternatives.",
  },
  {
    productName: "Gold Bond Medicated Foot Powder",
    brand: "Gold Bond",
    slug: "gold-bond-medicated-foot-powder",
    category: "powder",
    verdict: "conditional",
    rating: 6.5,
    tagline: "Classic for a reason, but the formula trade-offs are worth understanding before you reach for it.",
    retailPriceUsd: 9,
    publishedAt: "2026-03-15",
    imageUrl: "/images/pexels-11873696.jpg",
    seoTitle: "Gold Bond Foot Powder Review (2026): Talc Concerns and What Works Better",
    seoDescription:
      "Full independent review of Gold Bond Medicated Foot Powder. When it wins, when it loses, and the talc-free alternative men over 40 should consider first.",
  },
  {
    productName: "Yoga Toes GEM Toe Separators",
    brand: "Yoga Toes",
    slug: "yoga-toes-gem-separators",
    category: "alignment",
    verdict: "conditional",
    rating: 7,
    tagline: "Legitimate tool for toe alignment, but the wearing schedule matters as much as the product.",
    retailPriceUsd: 30,
    publishedAt: "2026-03-18",
    imageUrl: "/images/pexels-35206081.jpg",
    seoTitle: "Yoga Toes GEM Review (2026): Do Toe Separators Actually Work?",
    seoDescription:
      "The real evidence behind Yoga Toes GEM: what changes, what doesn't, and the wearing schedule that separates the men who see results from the men who quit.",
  },
  {
    productName: "KURU ATOM Sneakers",
    brand: "KURU",
    slug: "kuru-atom-sneakers",
    category: "footwear",
    verdict: "recommended",
    rating: 8,
    tagline: "The rare casual shoe designed around foot anatomy rather than fashion.",
    retailPriceUsd: 145,
    seoTitle: "KURU ATOM Review (2026): Are They Worth $145 for Foot Pain?",
    seoDescription:
      "Independent KURU ATOM review after 6 months of daily wear. Where the KURUSOLE heel design earns the price and where it doesn't. For men over 40 with heel pain.",
    publishedAt: "2026-03-22",
    imageUrl: "/images/pexels-12031206.jpg",
  },
];
