import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";
import { formatPrice, type Product } from "@/app/shop/page";

// ── Extended type for detail page ─────────────────────────────────────────────

interface ProductDetail extends Product {
  description?: string;
  gallery?: string[];
  contents?: { item: string; detail?: string }[];
  whyItWorks?: string;
}

// ── Static fallback catalog ───────────────────────────────────────────────────
// Mirrors the listing page data + adds detail-specific fields.

const staticProducts: ProductDetail[] = [
  {
    title: "Pain & Recovery Kit",
    slug: "pain-recovery-kit",
    tagline: "For soreness, fatigue, plantar discomfort, and everyday foot ache.",
    description:
      "Most foot pain in men over 40 is accumulated — years of unsupportive footwear, skipped mobility work, and loading patterns that compound quietly. This kit addresses the underlying causes, not just the symptoms. Simple to use, designed around a 10-minute post-shower routine.",
    priceInCents: 4900,
    status: "waitlist",
    category: "kit",
    waitlistParam: "pain-recovery",
    imageUrl: "https://images.pexels.com/photos/8729236/pexels-photo-8729236.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contents: [
      { item: "Plantar fascia massage ball", detail: "High-density rubber, 65mm" },
      { item: "Arch support insole pair", detail: "EVA, full-length, 3 arch heights" },
      { item: "Recovery protocol guide", detail: "12-week progressive routine, PDF" },
      { item: "Epsom salt soak pack", detail: "Magnesium sulfate, 3 uses" },
    ],
    whyItWorks:
      "Plantar fascia pain responds to a combination of targeted pressure release, progressive loading, and reduced inflammation during recovery windows. This kit sequences those interventions in the right order — most approaches fail because they only address one.",
  },
  {
    title: "Fungus & Nail Care Kit",
    slug: "fungus-nail-care-kit",
    tagline: "For discoloration, thick nails, and the confidence tax of hiding your feet.",
    description:
      "Toenail fungus is a structural infection — it lives under the nail plate where topicals rarely penetrate. This kit pairs a clinically-validated topical approach with the filing technique that actually lets it work, plus a maintenance routine to prevent recurrence.",
    priceInCents: 5900,
    status: "waitlist",
    category: "kit",
    waitlistParam: "fungus-care",
    imageUrl: "https://images.pexels.com/photos/10904211/pexels-photo-10904211.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contents: [
      { item: "Antifungal topical (urea 40%)", detail: "Clinical-grade, 30ml" },
      { item: "Nail file set", detail: "Coarse + fine grit, stainless" },
      { item: "Moisture barrier cream", detail: "Post-filing application, 60ml" },
      { item: "Treatment protocol guide", detail: "16-week timeline, what to expect" },
    ],
    whyItWorks:
      "The failure rate of most OTC fungal treatments comes down to penetration — the active ingredient never reaches the infection site. Thinning the nail plate first changes the math. Urea 40% also softens the nail bed, making it physically easier for treatment to work.",
  },
  {
    title: "Toe Alignment & Mobility Kit",
    slug: "toe-alignment-mobility-kit",
    tagline: "For cramped toes, bunions, balance, and restoring natural foot function.",
    description:
      "Decades of narrow shoes migrate your toes inward and reduce the big toe's range of motion — which then affects how your knee tracks, how your hip loads, and how your lower back absorbs impact. This kit works on the structural cause, not the cosmetic symptom.",
    priceInCents: 6900,
    status: "coming-soon",
    category: "kit",
    waitlistParam: "alignment-mobility",
    imageUrl: "https://images.pexels.com/photos/35206081/pexels-photo-35206081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contents: [
      { item: "Toe spacers (medical silicone)", detail: "Set of 4, washable, reusable" },
      { item: "Big toe extension splint", detail: "Night use, adjustable strap" },
      { item: "Mobility protocol guide", detail: "8-week progression, 10 min/day" },
      { item: "Foot strength band", detail: "Light resistance, latex-free" },
    ],
    whyItWorks:
      "The big toe drives 40–60% of push-off force in walking and running. When it can't extend fully, proximal compensation patterns develop — you'll feel it in your Achilles, then your knee, then your hip. Restoring extension range is the upstream fix.",
  },
  {
    title: "Dry Skin & Cracking Kit",
    slug: "dry-skin-cracking-kit",
    tagline: "For rough heels, persistent dryness, and cracking that comes back no matter what.",
    description:
      "Heel fissures return because most men scrub dry skin and apply basic lotion — which treats the surface without addressing the barrier. This kit uses the right sequence: soften, reduce, and seal, with the right ingredient concentrations.",
    priceInCents: 3900,
    status: "coming-soon",
    category: "kit",
    waitlistParam: "dry-skin",
    imageUrl: "https://images.pexels.com/photos/29145634/pexels-photo-29145634.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contents: [
      { item: "Urea 25% heel cream", detail: "Exfoliates + hydrates, 100ml" },
      { item: "Pumice bar", detail: "Wet-use, medium grit" },
      { item: "Heel socks (2 pairs)", detail: "Occlusive, overnight treatment" },
      { item: "Barrier cream", detail: "Lanolin-based, 60ml" },
    ],
    whyItWorks:
      "Urea at 25%+ concentration breaks down the keratin bonds that hold dry, thickened skin together — it's a keratolytic, not just a moisturizer. The socks create an occlusive layer overnight that locks in the active ingredient rather than letting it evaporate.",
  },
  {
    title: "Odor & Hygiene Kit",
    slug: "odor-hygiene-kit",
    tagline: "For persistent odor, excessive sweating, and the hygiene habits most men were never taught.",
    description:
      "Foot odor is a bacterial problem, not a cleanliness problem — the bacteria that produce odor thrive in moisture, regardless of how often you shower. This kit addresses the moisture-bacteria cycle at every stage.",
    priceInCents: 3400,
    status: "coming-soon",
    category: "kit",
    waitlistParam: "odor-hygiene",
    imageUrl: "https://images.pexels.com/photos/8980963/pexels-photo-8980963.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contents: [
      { item: "Antibacterial foot wash", detail: "Tea tree + neem, 200ml" },
      { item: "Foot powder", detail: "Talc-free, absorbs 6–8 hrs" },
      { item: "Cedar shoe inserts (pair)", detail: "Natural deodorizer, reusable" },
      { item: "Moisture-wicking socks (3 pairs)", detail: "Merino blend, ankle cut" },
    ],
    whyItWorks:
      "Cutting the moisture loop is the intervention that actually sticks. Most men wash and then immediately put on synthetic socks and enclosed shoes — which restores the bacterial environment within hours. This kit addresses the full daily sequence.",
  },
  {
    title: "Footwear Fit Guide",
    slug: "footwear-fit-guide",
    tagline: "For men who suspect their shoes are causing problems. Assess fit, fix the damage.",
    description:
      "Most men wear shoes that are one size too short and a half-width too narrow — not because they measured wrong, but because they were never measured as an adult. Feet change. This guide shows you how to assess what you're wearing, and what to do about it.",
    priceInCents: 0,
    status: "coming-soon",
    category: "treatment",
    waitlistParam: "footwear-fit",
    imageUrl: "https://images.pexels.com/photos/12031206/pexels-photo-12031206.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contents: [
      { item: "Brannock measurement guide", detail: "Self-measure accurately at home" },
      { item: "Fit assessment checklist", detail: "6-point shoe evaluation" },
      { item: "Brand sizing chart", detail: "Cross-reference 20+ brands" },
      { item: "Transition protocol", detail: "Move to wider shoes without pain" },
    ],
    whyItWorks:
      "Shoe fit isn't intuitive — the industry standardized on D-width decades ago when most men wore dress shoes all day. Today's wider variety means there's a correct shoe for almost every foot shape. The failure is in the assessment, not the options.",
  },
];

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getProduct(slug: string): Promise<ProductDetail | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticProducts.find((p) => p.slug === slug) ?? null;
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { productBySlugQuery } = await import("@/sanity/lib/queries");
    const product = await client.fetch<ProductDetail>(productBySlugQuery, { slug });
    if (product) return product;
    return staticProducts.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    console.error("[shop/slug] Sanity fetch failed, using static fallback:", err);
    return staticProducts.find((p) => p.slug === slug) ?? null;
  }
}

// ── Static params — pre-renders all 6 product pages at build time ─────────────
// Next.js will statically generate each slug so pages are instant on Vercel.
// When Sanity is connected, this also pre-renders CMS products.

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticProducts.map((p) => ({ slug: p.slug }));
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { productsQuery } = await import("@/sanity/lib/queries");
    const products = await client.fetch<{ slug: string }[]>(productsQuery);
    const slugs = products?.length > 0
      ? products.map((p) => ({ slug: p.slug }))
      : staticProducts.map((p) => ({ slug: p.slug }));
    return slugs;
  } catch {
    return staticProducts.map((p) => ({ slug: p.slug }));
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} — Men's Sole Revival`,
    description: product.tagline ?? product.description,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const isAvailable  = product.status === "available";
  const isWaitlist   = product.status === "waitlist";
  const hasDiscount  =
    product.compareAtPriceInCents &&
    product.priceInCents &&
    product.compareAtPriceInCents > product.priceInCents;

  const ctaHref = isWaitlist
    ? `/waitlist${product.waitlistParam ? `?kit=${product.waitlistParam}` : ""}`
    : "#";

  return (
    <SiteLayout>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-neutral-100 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/shop" className="hover:text-brand-600 transition">Shop</Link>
            <span>›</span>
            <span className="text-neutral-600">{product.title}</span>
          </nav>
        </Container>
      </div>

      {/* ── Product hero ── */}
      <section className="py-10 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">

            {/* Image */}
            <div className="relative overflow-hidden bg-neutral-100" style={{ aspectRatio: "1/1" }}>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-50">
                  <span className="text-brand-300 text-sm font-medium">No image yet</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">

              {/* Category chip */}
              {product.category && (
                <span className="mb-4 inline-block self-start bg-neutral-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {product.category === "kit" ? "Starter Kit" : product.category}
                </span>
              )}

              <h1 className={`${type.displaySection} text-brand-900`}>{product.title}</h1>

              {product.tagline && (
                <p className="mt-3 text-lg leading-relaxed text-neutral-600">{product.tagline}</p>
              )}

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                {product.priceInCents != null && product.priceInCents > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-brand-900">
                      {formatPrice(product.priceInCents)}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-neutral-400 line-through">
                        {formatPrice(product.compareAtPriceInCents)}
                      </span>
                    )}
                  </>
                ) : product.priceInCents === 0 ? (
                  <span className="text-2xl font-bold text-brand-600">Free</span>
                ) : (
                  <span className="text-neutral-400">Price TBD</span>
                )}
              </div>

              {/* Status + CTA */}
              <div className="mt-8">
                {isAvailable ? (
                  <button className="w-full bg-brand-900 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700">
                    Add to Cart
                  </button>
                ) : isWaitlist ? (
                  <>
                    <Link
                      href={ctaHref}
                      className="block w-full bg-accent-600 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-accent-700"
                    >
                      Join the Waitlist
                    </Link>
                    <p className="mt-3 text-xs text-neutral-500 text-center">
                      No payment now. We'll notify you when it ships.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      disabled
                      className="w-full cursor-not-allowed bg-neutral-200 py-4 text-sm font-bold uppercase tracking-wider text-neutral-400"
                    >
                      Coming Soon
                    </button>
                    <div className="mt-4">
                      <Button href="/waitlist" size="md" className="w-full justify-center">
                        Get Notified →
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-8 border-t border-neutral-100 pt-6">
                  <p className="text-sm leading-7 text-neutral-700">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── What's Included ── */}
      {product.contents && product.contents.length > 0 && (
        <section className="border-t border-neutral-200 py-12 md:py-16">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <p className={`${type.overline} mb-4 text-neutral-500`}>What's Included</p>
                <ul className="divide-y divide-neutral-100">
                  {product.contents.map((c, i) => (
                    <li key={i} className="flex items-start justify-between gap-4 py-4">
                      <span className="text-sm font-semibold text-brand-900">{c.item}</span>
                      {c.detail && (
                        <span className="text-right text-xs text-neutral-500 shrink-0">{c.detail}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why It Works */}
              {product.whyItWorks && (
                <div className="md:pl-10 md:border-l md:border-neutral-200">
                  <p className={`${type.overline} mb-4 text-neutral-500`}>Why It Works</p>
                  <p className="text-sm leading-7 text-neutral-700">{product.whyItWorks}</p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ── Back to shop ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-10">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-600 hover:text-brand-900 transition"
            >
              ← Back to Shop
            </Link>
            {!isAvailable && (
              <Button href="/waitlist" size="sm">
                Join the Waitlist
              </Button>
            )}
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
