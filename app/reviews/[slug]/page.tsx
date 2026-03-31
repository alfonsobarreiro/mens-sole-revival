import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";
import { verdictConfig, categoryLabel, staticReviews, type Review } from "@/app/reviews/page";

// ── Extended type for detail page ─────────────────────────────────────────────

interface ReviewDetail extends Review {
  summary?: string;
  pros?: string[];
  cons?: string[];
  whyItWorks?: string;
  whoItsFor?: string;
  affiliateUrl?: string;
  affiliateLabel?: string;
  gallery?: string[];
}

// ── Static fallback catalog ───────────────────────────────────────────────────

const staticReviewDetails: ReviewDetail[] = [
  {
    ...staticReviews[0], // Superfeet BLUE
    summary:
      "Superfeet BLUE is the benchmark OTC insole for a reason — it combines a semi-rigid heel cup with a high-density foam layer in a way that supports the midfoot without overcorrecting. It works across footwear types and holds its structure longer than most competitors at twice the price.",
    pros: [
      "Semi-rigid heel cup provides genuine arch support — not just cushioning",
      "Holds structural shape for 12+ months of daily use",
      "Fits most standard footwear without heavy trimming",
      "Available in 7 sizes with consistent fit across the range",
    ],
    cons: [
      "No cushioning layer — men with significant heel pain may need an additional pad",
      "Takes 2–3 days of break-in before the arch position feels natural",
    ],
    whyItWorks:
      "The BLUE insole works because it supports the subtalar joint — the hinge point between the heel and foot — in a neutral position. Most foot pain in men over 40 originates from this joint collapsing inward (overpronation). A semi-rigid shell under the arch stops that collapse without forcing an overcorrected position.",
    whoItsFor:
      "Men over 40 who spend 4+ hours on their feet daily and experience arch fatigue, mild plantar fasciitis, or general foot tiredness. Not a substitute for custom orthotics if you have a diagnosed structural issue.",
    affiliateUrl: "https://www.amazon.com/s?k=superfeet+blue+insoles",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[1], // Lamisil AT
    summary:
      "Lamisil AT (terbinafine 1%) has the strongest clinical evidence of any OTC antifungal for athlete's foot — it outperforms clotrimazole and miconazole in head-to-head studies. The catch: it only works if you apply it correctly and complete the full course.",
    pros: [
      "Terbinafine kills the fungal cell membrane — it's fungicidal, not just fungistatic",
      "7-day course (vs 4-week for most competitors) in clinical trials",
      "Available in cream, gel, and spray — gel absorbs fastest for men with hair on feet",
      "Low recurrence rate when full course completed",
    ],
    cons: [
      "Ineffective against nail fungus on its own — needs adjunct treatment for onychomycosis",
      "Cream formulation can feel greasy if over-applied",
    ],
    whyItWorks:
      "Terbinafine works by inhibiting squalene epoxidase — an enzyme fungi need to build their cell membranes. This makes it fungicidal (kills the organism) rather than fungistatic (just slows it). That mechanism explains why it works faster and with less recurrence than azole-class antifungals like clotrimazole.",
    whoItsFor:
      "Men with athlete's foot (tinea pedis) — particularly interdigital (between toes) or moccasin-type (bottom of foot). Not sufficient as a standalone treatment for toenail fungus, which requires prescription oral treatment or a specifically formulated topical.",
    affiliateUrl: "https://www.amazon.com/s?k=lamisil+AT+cream",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[2], // Gehwol
    summary:
      "Gehwol Fusskraft Soft Feet Cream is the product most podiatrists reach for personally and rarely mention to patients. The urea + lactic acid combination at therapeutic concentrations is what separates it from drugstore heel creams — it actually exfoliates while it hydrates.",
    pros: [
      "Urea 10% + lactic acid combination works as a genuine keratolytic, not just a moisturizer",
      "Lavender oil base creates light antimicrobial effect alongside hydration",
      "Absorbs without the greasy residue that makes most foot creams unwearable during the day",
      "One tube typically lasts 6–8 weeks of nightly use",
    ],
    cons: [
      "Requires import or specialty order in the US — not available at CVS or Walgreens",
      "Scent is medicinal/herbal; some men find it strong",
    ],
    whyItWorks:
      "Urea at 10%+ concentration acts as a keratolytic — it breaks the hydrogen bonds holding thickened keratin together. Lactic acid reinforces this by lowering skin pH, which accelerates natural cell turnover. Combined, they exfoliate from within the skin layer rather than scrubbing the surface. That's why the results outlast pumice work.",
    whoItsFor:
      "Men with chronically dry heels, mild heel fissures, or rough sole skin who have tried standard drugstore creams without lasting results. Also effective as a maintenance product after a professional foot treatment.",
    affiliateUrl: "https://www.amazon.com/s?k=gehwol+fusskraft+soft+feet",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[3], // Gold Bond
    summary:
      "Gold Bond Medicated works — it controls odor, absorbs moisture, and the menthol provides immediate comfort. The conditional rating comes from the talc question and the fact that better-formulated alternatives now exist for men serious about their foot hygiene routine.",
    pros: [
      "Zinc oxide provides mild antimicrobial action on top of odor control",
      "Menthol creates genuine cooling effect — effective after long days on feet",
      "Widely available, inexpensive, and fast-acting",
    ],
    cons: [
      "Original formula uses talc — men with respiratory concerns should choose the talc-free version",
      "Short duration: needs reapplication after 4–5 hours in warm conditions",
      "Not effective against fungal infections — it's a deodorant, not a treatment",
    ],
    whyItWorks:
      "Foot odor is primarily produced by bacteria metabolizing sweat. Zinc oxide disrupts bacterial cell membranes at low concentrations while absorbing moisture — reducing both the substrate and the bacteria simultaneously. Menthol creates vasoconstriction at the skin surface, which temporarily reduces sweating.",
    whoItsFor:
      "Men who want a fast, accessible option for day-to-day foot odor management. Not for men dealing with hyperhidrosis (excessive sweating) or fungal issues — those need targeted treatment.",
    affiliateUrl: "https://www.amazon.com/s?k=gold+bond+medicated+foot+powder",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[4], // Yoga Toes
    summary:
      "Yoga Toes GEM separators are a legitimate tool for men working on toe splay and big toe extension. The conditional rating is because the wearing protocol is where most men fail — 10 minutes on, full rest, progressive increase. Skip that, and you'll either quit from discomfort or see no results.",
    pros: [
      "Medical-grade silicone holds shape over hundreds of uses",
      "Creates measurable increase in toe splay with consistent 8-week use",
      "Works during rest — no active exercise required",
      "More durable than cheaper alternatives that flatten quickly",
    ],
    cons: [
      "Initial sessions (first 2 weeks) cause significant discomfort — men who push through too fast quit",
      "No sizing guidance for very wide or very narrow feet",
      "Results are reversible — maintenance use is required long-term",
    ],
    whyItWorks:
      "Toe separators work through sustained low-load stretching — the same mechanism as any soft tissue mobility work. The plantar fascia, intrinsic foot muscles, and toe ligaments respond to consistent gentle load over time. 10 minutes daily at low intensity outperforms 60 minutes three times a week because the tissue doesn't have time to guard.",
    whoItsFor:
      "Men with bunions, hammer toes, or cramped toe boxes who want a conservative, non-surgical approach. Also effective as maintenance after a podiatry visit. Not a replacement for professional care if structural deformity is significant.",
    affiliateUrl: "https://www.amazon.com/s?k=yoga+toes+gem+separators",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[5], // KURU
    summary:
      "KURU is one of the very few casual shoe brands that treats foot anatomy as the design brief rather than an afterthought. The ATOM model works because the heel geometry is designed around the fat pad — the structure that absorbs impact and erodes with age. Most shoes ignore it entirely.",
    pros: [
      "KURUSOLE technology cups the heel fat pad, which distributes impact load instead of concentrating it",
      "Wide toe box allows natural toe splay without looking orthopedic",
      "Runs true to size with reliable width consistency across production batches",
      "Holds up to 12–18 months of daily use before midsole compression",
    ],
    cons: [
      "Premium price point ($130–$150) compared to most casual sneakers",
      "Style is limited — not a fashion shoe, trades aesthetics for function",
      "Takes 1–2 weeks of daily wear before the midsole fully conforms",
    ],
    whyItWorks:
      "The heel fat pad in men over 40 has typically lost 30–50% of its original volume and elasticity. Standard shoes place a flat surface against this degraded pad, concentrating load at the posterior heel. KURU's cupped heel geometry distributes that load around the perimeter of the fat pad instead of through its center — reducing peak pressure by a meaningful margin.",
    whoItsFor:
      "Men over 40 with heel pain, plantar fasciitis, or general foot fatigue who want a casual shoe that doesn't require an insert to be comfortable. Also good for men transitioning off custom orthotics who need supportive daily footwear.",
    affiliateUrl: "https://www.kurufootwear.com/collections/mens-sneakers",
    affiliateLabel: "View on KURU",
  },
];

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getReview(slug: string): Promise<ReviewDetail | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticReviewDetails.find((r) => r.slug === slug) ?? null;
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { reviewBySlugQuery } = await import("@/sanity/lib/queries");
    const review = await client.fetch<ReviewDetail>(reviewBySlugQuery, { slug });
    if (review) return review;
    return staticReviewDetails.find((r) => r.slug === slug) ?? null;
  } catch (err) {
    console.error("[reviews/slug] Sanity fetch failed, using static fallback:", err);
    return staticReviewDetails.find((r) => r.slug === slug) ?? null;
  }
}

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticReviewDetails.map((r) => ({ slug: r.slug }));
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { reviewsQuery } = await import("@/sanity/lib/queries");
    const reviews = await client.fetch<{ slug: string }[]>(reviewsQuery);
    return reviews?.length > 0
      ? reviews.map((r) => ({ slug: r.slug }))
      : staticReviewDetails.map((r) => ({ slug: r.slug }));
  } catch {
    return staticReviewDetails.map((r) => ({ slug: r.slug }));
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return { title: "Review Not Found" };
  return {
    title: `${review.productName} Review — Men's Sole Revival`,
    description: review.tagline,
  };
}

// ── Rating display ────────────────────────────────────────────────────────────

function RatingBar({ rating }: { rating: number }) {
  const pct = (rating / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-accent-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-brand-900 tabular-nums">
        {rating}<span className="text-xs font-normal text-neutral-400">/10</span>
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = await getReview(slug);

  if (!review) notFound();

  const verdict = review.verdict ? verdictConfig[review.verdict] : null;

  return (
    <SiteLayout>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-neutral-100 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/reviews" className="hover:text-brand-600 transition">Reviews</Link>
            <span>›</span>
            <span className="text-neutral-600">{review.productName}</span>
          </nav>
        </Container>
      </div>

      {/* ── Review hero ── */}
      <section className="py-10 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">

            {/* Image */}
            <div className="relative overflow-hidden bg-neutral-100" style={{ aspectRatio: "1/1" }}>
              {review.imageUrl ? (
                <Image
                  src={review.imageUrl}
                  alt={review.productName}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-neutral-400">No image</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">

              {/* Category */}
              {review.category && (
                <span className="mb-4 inline-block self-start bg-neutral-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {categoryLabel(review.category)}
                </span>
              )}

              <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">{review.brand}</p>
              <h1 className={`mt-1 ${type.displaySection} text-brand-900`}>{review.productName}</h1>

              {review.tagline && (
                <p className="mt-3 text-lg leading-relaxed text-neutral-600">{review.tagline}</p>
              )}

              {/* Verdict + Rating */}
              <div className="mt-6 space-y-4">
                {verdict && (
                  <div className={`inline-flex items-center gap-2 border ${verdict.border} ${verdict.bg} px-4 py-2`}>
                    <span className={`text-sm font-bold uppercase tracking-wider ${verdict.text}`}>
                      {verdict.label}
                    </span>
                  </div>
                )}
                {review.rating != null && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Rating</p>
                    <RatingBar rating={review.rating} />
                  </div>
                )}
              </div>

              {/* Price */}
              {review.retailPriceUsd != null && (
                <p className="mt-4 text-sm text-neutral-500">
                  Retails for approximately <span className="font-semibold text-brand-900">${review.retailPriceUsd}</span>
                </p>
              )}

              {/* Summary */}
              {review.summary && (
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <p className="text-sm leading-7 text-neutral-700">{review.summary}</p>
                </div>
              )}

              {/* Affiliate CTA */}
              {review.affiliateUrl && (
                <div className="mt-6">
                  <a
                    href={review.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-2 border border-brand-900 bg-brand-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    {review.affiliateLabel ?? "View Product"} ↗
                  </a>
                  <p className="mt-2 text-xs text-neutral-400">
                    Affiliate link — we may earn a commission at no extra cost to you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Pros & Cons ── */}
      {(review.pros?.length || review.cons?.length) && (
        <section className="border-t border-neutral-200 py-12 md:py-16">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

              {review.pros?.length && (
                <div>
                  <p className={`${type.overline} mb-4 text-neutral-500`}>Pros</p>
                  <ul className="space-y-3">
                    {review.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 text-emerald-600 shrink-0">✓</span>
                        <span className="text-sm leading-6 text-neutral-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.cons?.length && (
                <div className="md:border-l md:border-neutral-200 md:pl-10">
                  <p className={`${type.overline} mb-4 text-neutral-500`}>Cons</p>
                  <ul className="space-y-3">
                    {review.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 text-neutral-400 shrink-0">–</span>
                        <span className="text-sm leading-6 text-neutral-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ── Why It Works + Who It's For ── */}
      {(review.whyItWorks || review.whoItsFor) && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

              {review.whyItWorks && (
                <div>
                  <p className={`${type.overline} mb-4 text-neutral-500`}>Why It Works</p>
                  <p className="text-sm leading-7 text-neutral-700">{review.whyItWorks}</p>
                </div>
              )}

              {review.whoItsFor && (
                <div className="md:border-l md:border-neutral-200 md:pl-10">
                  <p className={`${type.overline} mb-4 text-neutral-500`}>Who It's For</p>
                  <p className="text-sm leading-7 text-neutral-700">{review.whoItsFor}</p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ── Back to reviews ── */}
      <section className="border-t border-neutral-200 py-10">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              href="/reviews"
              className="text-sm font-semibold text-brand-600 hover:text-brand-900 transition"
            >
              ← Back to Reviews
            </Link>
            {review.affiliateUrl && (
              <a
                href={review.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-sm font-semibold text-brand-500 hover:text-brand-700 transition"
              >
                {review.affiliateLabel ?? "View Product"} ↗
              </a>
            )}
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
