import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import SiteLayout from "@/components/SiteLayout";
import Button from "@/components/Button";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Starter Kits",
  description: "Curated starter kits for the most common men's foot health problems. Simple routines, honest tools.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Kit {
  _id?: string;
  title: string;
  tag?: string;
  description?: string;
  desc?: string;           // legacy field used by Card component
  image?: string;
  waitlistParam?: string;
  href?: string;
  status?: string;
}

// ─── Static fallback ──────────────────────────────────────────────────────────
// Used when Sanity is not yet configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing).
// Once you add kits in the Studio, this data is superseded by Sanity content.

const staticKits: Kit[] = [
  {
    title: "Pain & Recovery",
    tag: "Most requested",
    desc: "For soreness, fatigue, plantar discomfort, and everyday foot ache. Simple routines that actually work.",
    href: "/waitlist?kit=pain-recovery",
    waitlistParam: "pain-recovery",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
  },
  {
    title: "Fungus & Nail Care",
    tag: "Long game",
    desc: "For discoloration, thick nails, and the confidence tax of hiding your feet. Evidence-based, not gimmicks.",
    href: "/waitlist?kit=fungus-care",
    waitlistParam: "fungus-care",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=75",
  },
  {
    title: "Toe Alignment & Mobility",
    tag: "Foundation",
    desc: "For cramped toes, bunions, balance, and restoring natural foot function before problems compound.",
    href: "/waitlist?kit=alignment-mobility",
    waitlistParam: "alignment-mobility",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75",
  },
  {
    title: "Dry Skin & Cracking",
    tag: "Quick wins",
    desc: "For rough heels, persistent dryness, and cracking that comes back no matter what lotion you use.",
    href: "/waitlist?kit=dry-skin",
    waitlistParam: "dry-skin",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=75",
  },
  {
    title: "Odor & Hygiene",
    tag: "Foundation",
    desc: "For persistent odor, excessive sweating, and the hygiene habits that most men were never taught.",
    href: "/waitlist?kit=odor-hygiene",
    waitlistParam: "odor-hygiene",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75",
  },
  {
    title: "Footwear Fit",
    tag: "Prevention",
    desc: "For men who suspect their shoes are causing problems. How to assess fit and what to look for.",
    href: "/waitlist?kit=footwear-fit",
    waitlistParam: "footwear-fit",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=75",
  },
];

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getKits(): Promise<Kit[]> {
  // Return static data if Sanity is not configured yet
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return staticKits;
  }

  try {
    const { client } = await import("@/sanity/lib/client");
    const { kitsQuery } = await import("@/sanity/lib/queries");
    const kits = await client.fetch<Kit[]>(kitsQuery);
    return kits?.length > 0 ? kits : staticKits;
  } catch (err) {
    console.error("[kits] Sanity fetch failed, using static fallback:", err);
    return staticKits;
  }
}

function kitHref(kit: Kit): string {
  if (kit.href) return kit.href;
  if (kit.waitlistParam) return `/waitlist?kit=${kit.waitlistParam}`;
  return "/waitlist";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function KitsPage() {
  const kits = await getKits();

  return (
    <SiteLayout>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-neutral-100 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-brand-600 transition">Home</Link>
            <span>›</span>
            <span className="text-neutral-600">Kits</span>
          </nav>
        </Container>
      </div>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[55vh] flex-col overflow-hidden bg-brand-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=75"
            alt=""
            fill
            className="object-cover object-center opacity-35"
            priority
          />
        </div>
        {/* Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/25" />

        {/* Text */}
        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>Starter Kits</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                Start with<br />a kit.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Each kit bundles a simple routine with the right tools for a
                specific problem. Tell us which you need — we'll prioritize
                what ships first.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Kits grid ── */}
      <section className="py-12">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kits.map((kit) => (
              <Card
                key={kit._id ?? kit.title}
                title={kit.title}
                tag={kit.tag}
                desc={kit.desc ?? kit.description ?? ""}
                href={kitHref(kit)}
                image={kit.image}
                imageAlt={kit.title}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Waitlist nudge ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <Container>
          <div className="max-w-lg">
            <h2 className={`${type.displaySm} text-brand-900`}>Not sure where to start?</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Join the waitlist and we'll ask you a few questions about
              what you're dealing with. We'll recommend the right kit and
              let you know when it's ready.
            </p>
            <div className="mt-6">
              <Button href="/waitlist" size="md">
                Join the Waitlist
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
