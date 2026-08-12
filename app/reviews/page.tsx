import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { type } from "@/components/typography";
import {
  verdictConfig,
  verdictToTagVariant,
  categoryLabel,
  staticReviews,
  type Review,
} from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews · Men's Sole Revival",
  description:
    "Honest, evidence-based product reviews for men's foot health. Every review starts with the mechanism, then the test, then a verdict.",
};

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
// Routes through DS Card + Tag primitives. The whole card is a single Link,
// so the previous "Read Review →" pseudo-button is dropped (redundant chrome
// nested inside a Link is an a11y smell).

function ReviewCard({ review }: { review: Review }) {
  const verdict = review.verdict ? verdictConfig[review.verdict] : null;

  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group block transition"
    >
      <Card
        variant="elevated"
        className="flex flex-col overflow-hidden transition group-hover:border-ink"
      >
        {/* Image — muted-photo per DS Foundations Imagery */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {review.imageUrl ? (
            <Image
              src={review.imageUrl}
              alt={review.productName}
              fill
              className="muted-photo object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <span className={`${type.small} text-neutral-400`}>No image</span>
            </div>
          )}

          {/* Verdict badge — DS Tag with weight-based verdict variant */}
          {review.verdict && verdict && (
            <Tag
              variant={verdictToTagVariant(review.verdict)}
              className="absolute top-3 left-3"
            >
              {verdict.label}
            </Tag>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          {/* Category chip — DS Tag muted */}
          {review.category && (
            <Tag variant="muted" className="mb-3 self-start">
              {categoryLabel(review.category)}
            </Tag>
          )}

          {/* Brand kicker — DS Tag accent-kicker (sanctioned accent-700 use) */}
          <Tag variant="accent-kicker" className="self-start !px-0">
            {review.brand}
          </Tag>

          {/* Product name — Lora Medium 500 mixed case, on DS scale */}
          <h2
            className={`mt-1 ${type.h3} text-ink transition group-hover:text-accent-700`}
          >
            {review.productName}
          </h2>

          {review.tagline && (
            <p className={`${type.body} mt-2 flex-1 text-neutral-600`}>
              {review.tagline}
            </p>
          )}

          {/* Rating + price */}
          <div className="mt-4 flex items-baseline gap-3">
            {review.rating != null && (
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-[1.25rem] font-medium text-ink tabular-nums">
                  {review.rating}
                </span>
                <span className={`${type.small} text-neutral-500`}>/10</span>
              </div>
            )}
            {review.retailPriceUsd != null && (
              <span className={`${type.small} text-neutral-500`}>
                ~${review.retailPriceUsd}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const recommended = reviews.filter((r) => r.verdict === "recommended");
  const others = reviews.filter((r) => r.verdict !== "recommended");

  return (
    <SiteLayout>
      {/* ── Hero ────────────────────────────────────────────────────────────
          Full-bleed photo with the DS dual-scrim (vertical grounding +
          horizontal text-edge protection), muted-photo LUT, and ink tokens
          (no legacy brand-*). Copy rewritten in Alfonso's voice — states
          the mechanic (what we do), not the aphorism ("We test it / You
          decide" was AI-tell rule-of-two). */}
      <section className="relative flex h-[45vh] flex-col overflow-hidden bg-ink">
        <Image
          src="/images/pexels-8729236.jpg"
          alt=""
          fill
          className="muted-photo object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/30" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-16 md:pb-24">
              {/* Inline classes (not composed from type.overline) so the
                  baked-in text-neutral-500 doesn't override text-accent-300 —
                  DS Foundations Imagery token-cascade gotcha. */}
              <p className="text-xs font-medium tracking-[0.01em] text-accent-300">Product Reviews</p>
              <h1 className={`mt-3 ${type.displayHero} text-inverse`}>
                Honest reviews of the tools men over 40 actually ask about.
              </h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.5] text-inverse">
                No sponsored content, no vague "works for me" verdicts. Every
                review starts with the mechanism, then the test, then a call.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <AssessmentEntryStrip />

      {/* ── Recommended ── */}
      {recommended.length > 0 && (
        <section className="py-16 md:py-24">
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

      {/* ── Worth knowing ── */}
      {others.length > 0 && (
        <section
          className={`py-16 md:py-24 ${
            recommended.length > 0 ? "border-t border-neutral-200 bg-neutral-100" : ""
          }`}
        >
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

      {/* ── How we review ────────────────────────────────────────────────────
          Copy rewritten from AI-tell aphorism triads ("Evidence first.
          Opinion second." / "No product escapes a clear call.") into
          declarative sentences that describe the mechanic. */}
      <section className="border-t border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className={`${type.overline} mb-4 text-neutral-500`}>How we review</p>
            <h2 className={`${type.h2} text-ink`}>
              Mechanism, test, verdict.
            </h2>
            <p className={`${type.lead} mt-4 text-neutral-600`}>
              Every review starts with how the product is supposed to work
              and what the evidence actually says. Then we test it. Verdict
              categories are Recommended, Conditional (works, but with
              caveats), and Skip. Every review lands on one.
            </p>
            <p className={`${type.body} mt-3 text-neutral-600`}>
              Affiliate links are labeled when present. They do not change
              the verdict. Products we would not recommend do not get a
              review.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
