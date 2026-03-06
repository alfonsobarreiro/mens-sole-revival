import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Journal",
  description: "Practical, evidence-based writing on foot health, consistency, and care for men.",
};

const articles = [
  {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1608138278598-7e595958dbe0?w=800&q=75",
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

      {/* ── Header ── */}
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Journal</p>
            <h1 className={`mt-3 ${type.h1}`}>Clear guides, no hype.</h1>
            <p className={`mt-6 ${type.lead}`}>
              Practical, evidence-based writing on foot health, footwear, and
              the habits that keep men moving well.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Article list ── */}
      <section className="py-12">
        <Container>
          <div className="space-y-4">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex gap-5 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm md:p-5"
              >
                {/* Thumbnail */}
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-md md:h-32 md:w-40">
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
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                        {a.category}
                      </span>
                      <span className="text-xs text-neutral-400">{a.readTime} read</span>
                    </div>
                    <h2 className={`mt-3 ${type.h4} group-hover:text-brand-700`}>
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
