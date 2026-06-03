import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { type } from "@/components/typography";
import {
  verdictConfig,
  categoryLabel,
  staticReviews,
  type Review,
} from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews · Men's Sole Revival",
  description:
    "Honest, evidence-based product reviews for men's foot health. We test the gear, break down the science, and tell you what's actually worth buying.",
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
        <div className="mt-5 flex items-center gap-3">
          {review.rating != null && (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-brand-900">{review.rating}</span>
              <span className="text-xs text-neutral-400">/10</span>
            </div>
          )}
          {review.retailPriceUsd != null && (
            <span className="text-xs text-neutral-500">~${review.retailPriceUsd}</span>
          )}
        </div>

        {/* Read Review CTA — promoted from inline text to filled primary
            pill per Cate's review ("Read Review feels important enough that
            it should visually behave more like a primary action"). */}
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center gap-1.5 bg-brand-900 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition group-hover:bg-brand-700">
            Read Review
            <span aria-hidden>→</span>
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

      <AssessmentEntryStrip />

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
              Every review starts with the mechanism: how the product is supposed to work,
              and what the evidence actually says. Then we test it. Verdict categories are
              Recommended, Conditional (works, but with caveats), and Skip. No product
              escapes a clear call.
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              If there's an affiliate link, it's labeled. It doesn't change the verdict.
              We don't review products we wouldn't actually recommend.
            </p>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
