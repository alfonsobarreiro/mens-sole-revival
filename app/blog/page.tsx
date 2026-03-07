import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "The Library",
  description: "Practical, evidence-based writing on foot health, consistency, and care for men.",
};

const articles = [
  {
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "What 30 Years in Dress Shoes Actually Does to Your Feet",
    category: "Footwear Fit",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=75",
    excerpt:
      "Most men don't connect the shoes they wore for decades to the foot problems they have now. Here's the chain of cause and effect.",
  },
  {
    slug: "big-toe-and-your-whole-body",
    title: "Your Big Toe Controls More of Your Body Than You Think",
    category: "Toe Alignment",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75",
    excerpt:
      "The big toe is responsible for 40–60% of your push-off force. Most men have spent decades restricting it — and wondering why their knee hurts.",
  },
  {
    slug: "cracked-heels-what-actually-works",
    title: "Cracked Heels: The Fix That Isn't a Pumice Stone",
    category: "Dry Skin",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=75",
    excerpt:
      "Scrubbing dry, cracked heel skin is the wrong starting point. Here's what's actually happening — and the routine that addresses it.",
  },
  {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
    excerpt:
      "The evidence on OTC treatments, prescription options, and home remedies — ranked by how well they actually work.",
  },
  {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    category: "Alignment",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75",
    excerpt:
      "The connection between cramped toes, altered gait, and the knee and hip pain that follows years later.",
  },
  {
    slug: "5-minute-routine",
    title: "A 5-Minute Daily Foot-Care Routine You Can Actually Stick To",
    category: "Routine",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=75",
    excerpt:
      "A consistency-first approach: five focused minutes after your shower, anchored to a habit you already have.",
  },
];

export default function BlogPage() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[55vh] flex-col overflow-hidden bg-brand-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1600&q=75"
            alt=""
            fill
            className="object-cover object-center opacity-40"
            priority
          />
        </div>
        {/* Directional gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/30" />

        {/* Text — anchored to bottom-left for editorial feel */}
        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>Journal</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                Clear guides.<br />No hype.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Practical, evidence-based writing on foot health, footwear,
                and the habits that keep men moving well.
              </p>
              <div className="mt-8">
                <Button href="/waitlist" size="md">
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Article list ── */}
      <section className="py-12">
        <Container>
          <div className="divide-y divide-neutral-200">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex gap-5 py-6 transition hover:bg-brand-50/40 first:pt-0 px-1"
              >
                {/* Thumbnail — sharp, no rounding */}
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden md:h-32 md:w-40">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                        {a.category}
                      </span>
                      <span className="text-xs text-neutral-400">{a.readTime} read</span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600 md:text-2xl">
                      {a.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {a.excerpt}
                    </p>
                  </div>
                  <span className="mt-1 flex-shrink-0 text-lg text-neutral-300 group-hover:text-brand-500">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-sm text-neutral-500">
            More articles coming soon. Join the{" "}
            <Link href="/waitlist" className="font-medium text-brand-500 underline underline-offset-4 hover:text-brand-700">
              waitlist
            </Link>{" "}
            to get notified.
          </p>
        </Container>
      </section>

    </SiteLayout>
  );
}
