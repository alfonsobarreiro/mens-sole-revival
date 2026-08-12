import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import EcosystemFooter from "@/components/EcosystemFooter";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { reviewRelations } from "@/lib/ecosystem";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { type } from "@/components/typography";
import {
  verdictConfig,
  verdictToTagVariant,
  categoryLabel,
  staticReviews,
  type Review,
} from "@/lib/reviews";

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
// Every visible-copy em-dash swept per DS voice rule (feedback_no_em_dashes).

const staticReviewDetails: ReviewDetail[] = [
  {
    ...staticReviews[0], // Superfeet BLUE
    summary:
      "Superfeet BLUE is the benchmark OTC insole for a reason. It combines a semi-rigid heel cup with a high-density foam layer in a way that supports the midfoot without overcorrecting. It works across footwear types and holds its structure longer than most competitors at twice the price.",
    pros: [
      "Semi-rigid heel cup provides genuine arch support, not just cushioning",
      "Holds structural shape for 12+ months of daily use",
      "Fits most standard footwear without heavy trimming",
      "Available in 7 sizes with consistent fit across the range",
    ],
    cons: [
      "No cushioning layer; men with significant heel pain may need an additional pad",
      "Takes 2 to 3 days of break-in before the arch position feels natural",
    ],
    whyItWorks:
      "The BLUE insole works because it supports the subtalar joint, the hinge point between the heel and foot, in a neutral position. Most foot pain in men over 40 originates from this joint collapsing inward (overpronation). A semi-rigid shell under the arch stops that collapse without forcing an overcorrected position.",
    whoItsFor:
      "Men over 40 who spend 4+ hours on their feet daily and experience arch fatigue, mild plantar fasciitis, or general foot tiredness. Not a substitute for custom orthotics if you have a diagnosed structural issue.",
    affiliateUrl: "https://www.amazon.com/s?k=superfeet+blue+insoles",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[1], // Lamisil AT
    summary:
      "Lamisil AT (terbinafine 1%) has the strongest clinical evidence of any OTC antifungal for athlete's foot. It outperforms clotrimazole and miconazole in head-to-head studies. The catch: it only works if you apply it correctly and complete the full course.",
    pros: [
      "Terbinafine kills the fungal cell membrane. It is fungicidal, not just fungistatic",
      "7-day course (vs 4-week for most competitors) in clinical trials",
      "Available in cream, gel, and spray. Gel absorbs fastest for men with hair on feet",
      "Low recurrence rate when full course completed",
    ],
    cons: [
      "Ineffective against nail fungus on its own. Needs adjunct treatment for onychomycosis",
      "Cream formulation can feel greasy if over-applied",
    ],
    whyItWorks:
      "Terbinafine works by inhibiting squalene epoxidase, an enzyme fungi need to build their cell membranes. This makes it fungicidal (kills the organism) rather than fungistatic (just slows it). That mechanism explains why it works faster and with less recurrence than azole-class antifungals like clotrimazole.",
    whoItsFor:
      "Men with athlete's foot (tinea pedis), particularly interdigital (between toes) or moccasin-type (bottom of foot). Not sufficient as a standalone treatment for toenail fungus, which requires prescription oral treatment or a specifically formulated topical.",
    affiliateUrl: "https://www.amazon.com/s?k=lamisil+AT+cream",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[2], // Gehwol
    summary:
      "Gehwol Fusskraft Soft Feet Cream is the product most podiatrists reach for personally and rarely mention to patients. The urea + lactic acid combination at therapeutic concentrations is what separates it from drugstore heel creams. It actually exfoliates while it hydrates.",
    pros: [
      "Urea 10% + lactic acid combination works as a genuine keratolytic, not just a moisturizer",
      "Lavender oil base creates light antimicrobial effect alongside hydration",
      "Absorbs without the greasy residue that makes most foot creams unwearable during the day",
      "One tube typically lasts 6 to 8 weeks of nightly use",
    ],
    cons: [
      "Requires import or specialty order in the US. Not available at CVS or Walgreens",
      "Scent is medicinal/herbal; some men find it strong",
    ],
    whyItWorks:
      "Urea at 10%+ concentration acts as a keratolytic. It breaks the hydrogen bonds holding thickened keratin together. Lactic acid reinforces this by lowering skin pH, which accelerates natural cell turnover. Combined, they exfoliate from within the skin layer rather than scrubbing the surface. That is why the results outlast pumice work.",
    whoItsFor:
      "Men with chronically dry heels, mild heel fissures, or rough sole skin who have tried standard drugstore creams without lasting results. Also effective as a maintenance product after a professional foot treatment.",
    affiliateUrl: "https://www.amazon.com/s?k=gehwol+fusskraft+soft+feet",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[3], // Gold Bond
    summary:
      "Gold Bond Medicated works. It controls odor, absorbs moisture, and the menthol provides immediate comfort. The conditional rating comes from the talc question and the fact that better-formulated alternatives now exist for men serious about their foot hygiene routine.",
    pros: [
      "Zinc oxide provides mild antimicrobial action on top of odor control",
      "Menthol creates genuine cooling effect. Effective after long days on feet",
      "Widely available, inexpensive, and fast-acting",
    ],
    cons: [
      "Original formula uses talc. Men with respiratory concerns should choose the talc-free version",
      "Short duration: needs reapplication after 4 to 5 hours in warm conditions",
      "Not effective against fungal infections. It is a deodorant, not a treatment",
    ],
    whyItWorks:
      "Foot odor is primarily produced by bacteria metabolizing sweat. Zinc oxide disrupts bacterial cell membranes at low concentrations while absorbing moisture, reducing both the substrate and the bacteria simultaneously. Menthol creates vasoconstriction at the skin surface, which temporarily reduces sweating.",
    whoItsFor:
      "Men who want a fast, accessible option for day-to-day foot odor management. Not for men dealing with hyperhidrosis (excessive sweating) or fungal issues. Those need targeted treatment.",
    affiliateUrl: "https://www.amazon.com/s?k=gold+bond+medicated+foot+powder",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[4], // Yoga Toes
    summary:
      "Yoga Toes GEM separators are a legitimate tool for men working on toe splay and big toe extension. The conditional rating is because the wearing protocol is where most men fail: 10 minutes on, full rest, progressive increase. Skip that, and you'll either quit from discomfort or see no results.",
    pros: [
      "Medical-grade silicone holds shape over hundreds of uses",
      "Creates measurable increase in toe splay with consistent 8-week use",
      "Works during rest. No active exercise required",
      "More durable than cheaper alternatives that flatten quickly",
    ],
    cons: [
      "Initial sessions (first 2 weeks) cause significant discomfort. Men who push through too fast quit",
      "No sizing guidance for very wide or very narrow feet",
      "Results are reversible. Maintenance use is required long-term",
    ],
    whyItWorks:
      "Toe separators work through sustained low-load stretching, the same mechanism as any soft tissue mobility work. The plantar fascia, intrinsic foot muscles, and toe ligaments respond to consistent gentle load over time. 10 minutes daily at low intensity outperforms 60 minutes three times a week because the tissue does not have time to guard.",
    whoItsFor:
      "Men with bunions, hammer toes, or cramped toe boxes who want a conservative, non-surgical approach. Also effective as maintenance after a podiatry visit. Not a replacement for professional care if structural deformity is significant.",
    affiliateUrl: "https://www.amazon.com/s?k=yoga+toes+gem+separators",
    affiliateLabel: "View on Amazon",
  },
  {
    ...staticReviews[5], // KURU
    summary:
      "KURU is one of the very few casual shoe brands that treats foot anatomy as the design brief rather than an afterthought. The ATOM model works because the heel geometry is designed around the fat pad, the structure that absorbs impact and erodes with age. Most shoes ignore it entirely.",
    pros: [
      "KURUSOLE technology cups the heel fat pad, which distributes impact load instead of concentrating it",
      "Wide toe box allows natural toe splay without looking orthopedic",
      "Runs true to size with reliable width consistency across production batches",
      "Holds up to 12 to 18 months of daily use before midsole compression",
    ],
    cons: [
      "Premium price point ($130 to $150) compared to most casual sneakers",
      "Style is limited. Not a fashion shoe; trades aesthetics for function",
      "Takes 1 to 2 weeks of daily wear before the midsole fully conforms",
    ],
    whyItWorks:
      "The heel fat pad in men over 40 has typically lost 30 to 50% of its original volume and elasticity. Standard shoes place a flat surface against this degraded pad, concentrating load at the posterior heel. KURU's cupped heel geometry distributes that load around the perimeter of the fat pad instead of through its center, reducing peak pressure by a meaningful margin.",
    whoItsFor:
      "Men over 40 with heel pain, plantar fasciitis, or general foot fatigue who want a casual shoe that does not require an insert to be comfortable. Also good for men transitioning off custom orthotics who need supportive daily footwear.",
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
// Sharp-cornered bar per DS radius = 0. Ink fill (structural, matches
// dividers/borders); no accent-500 identity leak.

function RatingBar({ rating }: { rating: number }) {
  const pct = (rating / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden bg-neutral-200">
        <div
          className="h-full bg-ink transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[0.9375rem] font-medium text-ink tabular-nums">
        {rating}
        <span className={`${type.small} font-normal text-neutral-500`}>/10</span>
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

  // Review structured data — drives rich-result stars in search, which lift
  // affiliate CTR. ratingValue is on a 10-point scale (bestRating: 10).
  //
  // The nested Product carries offers + aggregateRating so Google's Product
  // snippet validator has one of the three required fields (offers, review,
  // aggregateRating) and the review is eligible for the star + price rich
  // result.
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: review.productName,
      ...(review.brand ? { brand: { "@type": "Brand", name: review.brand } } : {}),
      ...(review.imageUrl ? { image: `${SITE_URL}${review.imageUrl}` } : {}),
      ...(review.retailPriceUsd != null
        ? {
            offers: {
              "@type": "Offer",
              price: review.retailPriceUsd,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: review.affiliateUrl ?? `${SITE_URL}/reviews/${review.slug}`,
            },
          }
        : {}),
      ...(review.rating != null
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: review.rating,
              bestRating: 10,
              worstRating: 0,
              ratingCount: 1,
              reviewCount: 1,
            },
          }
        : {}),
    },
    ...(review.tagline ? { name: review.tagline } : {}),
    ...(review.summary ? { reviewBody: review.summary } : {}),
    ...(review.rating != null
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 10,
            worstRating: 0,
          },
        }
      : {}),
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <SiteLayout>
      <JsonLd schema={reviewSchema} />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-neutral-200 py-3">
        <Container>
          <nav className={`flex items-center gap-2 ${type.small} text-neutral-500`}>
            <Button href="/reviews" variant="link" className="text-neutral-500 no-underline hover:underline">
              Reviews
            </Button>
            <span>›</span>
            <span className="text-neutral-600">{review.productName}</span>
          </nav>
        </Container>
      </div>

      {/* ── Review hero ── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-24">
            {/* Image — muted-photo per DS Foundations Imagery */}
            <div className="relative overflow-hidden bg-neutral-100" style={{ aspectRatio: "1/1" }}>
              {review.imageUrl ? (
                <Image
                  src={review.imageUrl}
                  alt={review.productName}
                  fill
                  className="muted-photo object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`${type.small} text-neutral-500`}>No image</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Category — DS Tag muted */}
              {review.category && (
                <Tag variant="muted" className="mb-4 self-start">
                  {categoryLabel(review.category)}
                </Tag>
              )}

              {/* Brand — DS Tag accent-kicker (sanctioned accent-700 use;
                  drops the `.eyebrow !text-accent-700` token-cascade hack) */}
              <Tag variant="accent-kicker" className="self-start !px-0">
                {review.brand}
              </Tag>

              {/* Product name — H1 at DS h1 (40px) per hierarchy discipline */}
              <h1 className={`mt-1 ${type.h1} text-ink`}>
                {review.productName}
              </h1>

              {review.tagline && (
                <p className={`${type.lead} mt-3 text-neutral-600`}>
                  {review.tagline}
                </p>
              )}

              {/* Verdict + Rating */}
              <div className="mt-6 space-y-4">
                {review.verdict && verdict && (
                  <Tag
                    variant={verdictToTagVariant(review.verdict)}
                    className="self-start"
                  >
                    {verdict.label}
                  </Tag>
                )}
                {review.rating != null && (
                  <div>
                    <p className="eyebrow mb-2">Rating</p>
                    <RatingBar rating={review.rating} />
                  </div>
                )}
              </div>

              {/* Price */}
              {review.retailPriceUsd != null && (
                <p className={`${type.body} mt-4 text-neutral-500`}>
                  Retails for approximately{" "}
                  <span className="font-medium text-ink">${review.retailPriceUsd}</span>
                </p>
              )}

              {/* Summary */}
              {review.summary && (
                <div className="mt-6 border-t border-neutral-200 pt-6">
                  <p className={`${type.lead} text-neutral-600`}>{review.summary}</p>
                </div>
              )}

              {/* Affiliate CTA — DS Button primary */}
              {review.affiliateUrl && (
                <div className="mt-6">
                  <Button
                    href={review.affiliateUrl}
                    variant="primary"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    {review.affiliateLabel ?? "View product"} ↗
                  </Button>
                  <p className={`${type.small} mt-2 text-neutral-500`}>
                    Affiliate link. We may earn a commission at no extra cost to you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Pros & Cons ── */}
      {(review.pros?.length || review.cons?.length) && (
        <section className="border-t border-neutral-200 py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              {review.pros?.length && (
                <div>
                  <p className="eyebrow mb-4">Pros</p>
                  <ul className="space-y-3">
                    {review.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 text-ink shrink-0">✓</span>
                        <span className={`${type.body} text-ink`}>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.cons?.length && (
                <div className="md:border-l md:border-neutral-200 md:pl-8">
                  <p className="eyebrow mb-4">Cons</p>
                  <ul className="space-y-3">
                    {review.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 text-neutral-500 shrink-0">–</span>
                        <span className={`${type.body} text-ink`}>{con}</span>
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
        <section className="border-t border-neutral-200 bg-neutral-100 py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              {review.whyItWorks && (
                <div>
                  <p className="eyebrow mb-4">Why it works</p>
                  <p className={`${type.body} text-ink`}>{review.whyItWorks}</p>
                </div>
              )}

              {review.whoItsFor && (
                <div className="md:border-l md:border-neutral-200 md:pl-8">
                  <p className="eyebrow mb-4">Who it&apos;s for</p>
                  <p className={`${type.body} text-ink`}>{review.whoItsFor}</p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ── Ecosystem footer: related routine + guides ── */}
      {reviewRelations[review.slug] && (
        <EcosystemFooter
          heading="What it pairs with."
          intro="A product alone rarely fixes the problem. Here's the routine that puts this one to work, and the guide that explains why."
          routineKey={reviewRelations[review.slug].routine}
          articleSlugs={reviewRelations[review.slug].articles}
        />
      )}

      {/* ── Back to reviews ── */}
      <section className="border-t border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="flex items-center justify-between">
            <Button href="/reviews" variant="link">
              ← Back to reviews
            </Button>
            {review.affiliateUrl && (
              <Button
                href={review.affiliateUrl}
                variant="link"
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                {review.affiliateLabel ?? "View product"} ↗
              </Button>
            )}
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
