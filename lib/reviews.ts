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
}

export const verdictConfig = {
  recommended: { label: "Recommended", color: "bg-emerald-600", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  conditional: { label: "Conditional",  color: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  skip:        { label: "Skip",         color: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     },
} as const;

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
  },
  {
    productName: "Gold Bond Medicated Foot Powder",
    brand: "Gold Bond",
    slug: "gold-bond-medicated-foot-powder",
    category: "powder",
    verdict: "conditional",
    rating: 6.5,
    tagline: "Classic for a reason — but the formula trade-offs are worth understanding before you reach for it.",
    retailPriceUsd: 9,
    publishedAt: "2026-03-15",
    imageUrl: "/images/pexels-11873696.jpg",
  },
  {
    productName: "Yoga Toes GEM Toe Separators",
    brand: "Yoga Toes",
    slug: "yoga-toes-gem-separators",
    category: "alignment",
    verdict: "conditional",
    rating: 7,
    tagline: "Legitimate tool for toe alignment — but the wearing schedule matters as much as the product.",
    retailPriceUsd: 30,
    publishedAt: "2026-03-18",
    imageUrl: "/images/pexels-35206081.jpg",
  },
  {
    productName: "KURU ATOM Sneakers",
    brand: "KURU",
    slug: "kuru-atom-sneakers",
    category: "footwear",
    verdict: "recommended",
    rating: 8,
    tagline: "The rare casual shoe actually designed around foot anatomy — not fashion.",
    retailPriceUsd: 145,
    publishedAt: "2026-03-22",
    imageUrl: "/images/pexels-12031206.jpg",
  },
];
