import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Shop — Men's Sole Revival",
  description:
    "Curated foot care kits and tools for men over 40. No gimmicks — evidence-based routines and the right gear.",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Product {
  _id?: string;
  title: string;
  slug: string;
  tagline?: string;
  priceInCents?: number;
  compareAtPriceInCents?: number;
  status?: "available" | "coming-soon" | "waitlist" | "hidden";
  category?: "kit" | "tool" | "treatment" | "supplement";
  waitlistParam?: string;
  imageUrl?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatPrice(cents?: number): string {
  if (!cents) return "";
  return `$${(cents / 100).toFixed(2)}`;
}

export function productHref(p: Product): string {
  return `/shop/${p.slug}`;
}

export function ctaLabel(status: Product["status"]): string {
  switch (status) {
    case "available":    return "Add to Cart";
    case "coming-soon":  return "Coming Soon";
    case "waitlist":     return "Join Waitlist";
    default:             return "Learn More";
  }
}

// ── Static fallback ───────────────────────────────────────────────────────────
// Shown when Sanity is not yet configured. Mirrors the product schema so the
// UX is identical — swap to real data by adding NEXT_PUBLIC_SANITY_PROJECT_ID.

const staticProducts: Product[] = [
  {
    title: "Pain & Recovery Kit",
    slug: "pain-recovery-kit",
    tagline: "For soreness, fatigue, plantar discomfort, and everyday foot ache.",
    priceInCents: 4900,
    status: "waitlist",
    category: "kit",
    waitlistParam: "pain-recovery",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=75",
  },
  {
    title: "Fungus & Nail Care Kit",
    slug: "fungus-nail-care-kit",
    tagline: "For discoloration, thick nails, and the confidence tax of hiding your feet.",
    priceInCents: 5900,
    status: "waitlist",
    category: "kit",
    waitlistParam: "fungus-care",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=75",
  },
  {
    title: "Toe Alignment & Mobility Kit",
    slug: "toe-alignment-mobility-kit",
    tagline: "For cramped toes, bunions, balance, and restoring natural foot function.",
    priceInCents: 6900,
    status: "coming-soon",
    category: "kit",
    waitlistParam: "alignment-mobility",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75",
  },
  {
    title: "Dry Skin & Cracking Kit",
    slug: "dry-skin-cracking-kit",
    tagline: "For rough heels, persistent dryness, and cracking that comes back no matter what.",
    priceInCents: 3900,
    status: "coming-soon",
    category: "kit",
    waitlistParam: "dry-skin",
    imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=75",
  },
  {
    title: "Odor & Hygiene Kit",
    slug: "odor-hygiene-kit",
    tagline: "For persistent odor, excessive sweating, and the hygiene habits most men were never taught.",
    priceInCents: 3400,
    status: "coming-soon",
    category: "kit",
    waitlistParam: "odor-hygiene",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
  },
  {
    title: "Footwear Fit Guide",
    slug: "footwear-fit-guide",
    tagline: "For men who suspect their shoes are causing problems. Assess fit, fix the damage.",
    priceInCents: 0,
    status: "coming-soon",
    category: "treatment",
    waitlistParam: "footwear-fit",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=75",
  },
];

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticProducts;
  }
  try {
    const { client } = await import("@/sanity/lib/client");
    const { productsQuery } = await import("@/sanity/lib/queries");
    const products = await client.fetch<Product[]>(productsQuery);
    return products?.length > 0 ? products : staticProducts;
  } catch (err) {
    console.error("[shop] Sanity fetch failed, using static fallback:", err);
    return staticProducts;
  }
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const isAvailable  = product.status === "available";
  const isWaitlist   = product.status === "waitlist";
  const isComingSoon = product.status === "coming-soon";

  const ctaHref = isWaitlist
    ? `/waitlist${product.waitlistParam ? `?kit=${product.waitlistParam}` : ""}`
    : isAvailable
    ? productHref(product)
    : "#";

  return (
    <div className="group flex flex-col border border-neutral-200 bg-white transition hover:border-brand-300 hover:shadow-md">
      {/* Image */}
      <Link href={productHref(product)} className="relative block overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-100 flex items-center justify-center">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">No image</span>
          </div>
        )}

        {/* Status badge */}
        {isComingSoon && (
          <span className="absolute top-3 left-3 bg-brand-900/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            Coming Soon
          </span>
        )}
        {isWaitlist && (
          <span className="absolute top-3 left-3 bg-accent-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Waitlist Open
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category chip */}
        {product.category && (
          <span className="mb-3 inline-block self-start bg-neutral-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {product.category === "kit" ? "Starter Kit" : product.category}
          </span>
        )}

        <Link href={productHref(product)}>
          <h2 className="font-display text-xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600 md:text-2xl">
            {product.title}
          </h2>
        </Link>

        {product.tagline && (
          <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">
            {product.tagline}
          </p>
        )}

        {/* Price row */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            {product.priceInCents != null && product.priceInCents > 0 ? (
              <>
                <span className="text-lg font-bold text-brand-900">
                  {formatPrice(product.priceInCents)}
                </span>
                {product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.compareAtPriceInCents)}
                  </span>
                )}
              </>
            ) : product.priceInCents === 0 ? (
              <span className="text-sm font-semibold text-brand-600">Free</span>
            ) : (
              <span className="text-sm text-neutral-400">Price TBD</span>
            )}
          </div>

          {/* CTA */}
          {isAvailable ? (
            <Link
              href={ctaHref}
              className="bg-brand-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
            >
              Add to Cart
            </Link>
          ) : isWaitlist ? (
            <Link
              href={ctaHref}
              className="border border-accent-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-700 transition hover:bg-accent-50"
            >
              Join Waitlist →
            </Link>
          ) : (
            <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-400 border border-neutral-200 cursor-not-allowed">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ShopPage() {
  const products = await getProducts();

  const available  = products.filter((p) => p.status === "available");
  const waitlist   = products.filter((p) => p.status === "waitlist");
  const comingSoon = products.filter((p) => p.status === "coming-soon");

  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[55vh] flex-col overflow-hidden bg-brand-900">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=60"
            alt=""
            fill
            className="object-cover object-center opacity-25"
            priority
          />
        </div>
        {/* Directional gradient — content readable left, image shows right */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>The Shop</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                The gear that<br />backs the work.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Each kit is built around a specific problem — with the tools and
                routine to match. No filler, no proprietary mystery ingredients.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Available products (if any) ── */}
      {available.length > 0 && (
        <section className="py-12 md:py-16">
          <Container>
            <p className={`${type.overline} mb-6 text-neutral-500`}>Available Now</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {available.map((p) => (
                <ProductCard key={p._id ?? p.slug} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Waitlist kits ── */}
      {waitlist.length > 0 && (
        <section className={`py-12 md:py-16 ${available.length > 0 ? "border-t border-neutral-200" : ""}`}>
          <Container>
            <p className={`${type.overline} mb-6 text-neutral-500`}>Waitlist Open</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {waitlist.map((p) => (
                <ProductCard key={p._id ?? p.slug} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Coming soon ── */}
      {comingSoon.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
          <Container>
            <p className={`${type.overline} mb-6 text-neutral-500`}>In Development</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoon.map((p) => (
                <ProductCard key={p._id ?? p.slug} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Waitlist CTA ── */}
      <section className="border-t border-neutral-200 py-14">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className={`${type.displaySm} text-brand-900`}>Help us build the right kits.</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
                Join the waitlist and tell us which problem you want solved first.
                We're shipping based on demand — your signal shapes what gets built.
              </p>
            </div>
            <Button href="/waitlist" size="lg" className="shrink-0">
              Join the Waitlist
            </Button>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
