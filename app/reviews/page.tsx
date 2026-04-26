import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Reviews — Men's Sole Revival",
  description:
    "Honest, evidence-based product reviews for men's foot health. We test the gear, break down the science, and tell you what's actually worth buying.",
};

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

export const verdictConfig = {
  recommended: { label: "Recommended",  color: "bg-emerald-600",  text: "text-emerald-700",  bg: "bg-emerald-50",  border: "border-emerald-200" },
  conditional:  { label: "Conditional",   color: "bg-amber-500",    text: "text-amber-700",    bg: "bg-amber-50",    border: "border-amber-200"   },
  skip:         { label: "Skip",          color: "bg-red-500",      text: "text-red-700",      bg: "bg-red-50",      border: "border-red-200"     },
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

// ── Static fallback ───────────────────────────────────────────────────────────
// Six real products covering the core foot-health categories.
// When Sanity is connected, replace with CMS data.

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

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getReviews(): Promise<Review[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticReviews;
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { reviewsQuery } = await import("@/sanity/lib/queries");
    const reviews = await client.fetch<Review[]>(reviewsQuery);
    return reviews?.length > 0 ? reviews : staticReviews;
  } catch (err) {
    console.error("[reviews] Sanity fetch failed, using static fallback:", err);
    return staticReviews;
  }
}

// ── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const verdict = review.verdict ? verdictConfig[review.verdict] : null;

  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group flex flex-col border border-neutral-200 bg-white transition hover:border-brand-300 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {review.imageUrl ? (
          <Image
            src={review.imageUrl}
            alt={review.productName}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">No image</span>
          </div>
        )}

        {/* Verdict badge */}
        {verdict && (
          <span className={`absolute top-3 left-3 ${verdict.color} px-3 py-1 text-xs font-bold uppercase tracking-wider text-white`}>
            {verdict.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category */}
        {review.category && (
          <span className="mb-3 inline-block self-start bg-neutral-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {categoryLabel(review.category)}
          </span>
        )}

        {/* Brand + Product */}
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">{review.brand}</p>
        <h2 className="mt-1 font-display text-xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600 md:text-2xl">
          {review.productName}
        </h2>

        {review.tagline && (
          <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">{review.tagline}</p>
        )}

        {/* Rating + Price row */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {review.rating != null && (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-brand-900">{review.rating}</span>
              <span className="text-xs text-neutral-400">/10</span>
            </div>
          )}
          {review.retailPriceUsd != null && (
            <span className="text-xs text-neutral-500">~${review.retailPriceUsd}</span>
          )}
          <span className="ml-auto text-xs font-semibold text-brand-500 group-hover:text-brand-700">
            Read review →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const recommended = reviews.filter((r) => r.verdict === "recommended");
  const others      = reviews.filter((r) => r.verdict !== "recommended");

  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex h-[45vh] flex-col overflow-hidden bg-brand-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pexels-8729236.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900/90 via-brand-900/50 to-transparent" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>Product Reviews</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                We test it.<br />You decide.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Honest, evidence-based reviews of the tools, creams, insoles, and
                footwear men over 40 actually ask about. No sponsored content,
                no vague "works for me" verdicts.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Recommended ── */}
      {recommended.length > 0 && (
        <section className="py-12 md:py-16">
          <Container>
            <p className={`${type.overline} mb-6 text-neutral-500`}>Recommended</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((r) => (
                <ReviewCard key={r._id ?? r.slug} review={r} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Conditional + Skip ── */}
      {others.length > 0 && (
        <section className={`py-12 md:py-16 ${recommended.length > 0 ? "border-t border-neutral-200 bg-neutral-50" : ""}`}>
          <Container>
            <p className={`${type.overline} mb-6 text-neutral-500`}>Worth Knowing</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r) => (
                <ReviewCard key={r._id ?? r.slug} review={r} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── About the reviews ── */}
      <section className="border-t border-neutral-200 py-14">
        <Container>
          <div className="max-w-2xl">
            <p className={`${type.overline} mb-4 text-neutral-500`}>How we review</p>
            <h2 className={`${type.displaySm} text-brand-900`}>Evidence first. Opinion second.</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Every review starts with the mechanism — how the product is supposed to work,
              and what the evidence actually says. Then we test it. Verdict categories are
              Recommended, Conditional (works, but with caveats), and Skip. No product
              escapes a clear call.
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              If there's an affiliate link, it's labeled. It doesn't change the verdict —
              we don't review products we wouldn't actually recommend.
            </p>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
