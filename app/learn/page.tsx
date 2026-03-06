import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Learn",
  description: "Evidence-based foot health guides for men. Practical routines, honest advice, no gimmicks.",
};

const topics = [
  {
    category: "Nail Care",
    articles: [
      {
        title: "Toenail fungus: what actually works (and what's a scam)",
        href: "/blog/toenail-fungus-what-works",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
        excerpt:
          "The evidence on OTC treatments, prescription options, and home remedies — ranked by how well they actually work.",
      },
    ],
  },
  {
    category: "Alignment & Mobility",
    articles: [
      {
        title: "Why toe alignment affects your knees and hips",
        href: "/blog/why-toe-alignment-affects-knees-and-hips",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75",
        excerpt:
          "The connection between cramped toes, altered gait, and the knee and hip pain that follows years later.",
      },
    ],
  },
  {
    category: "Daily Routine",
    articles: [
      {
        title: "A 5-minute daily foot-care routine you can stick to",
        href: "/blog/5-minute-routine",
        readTime: "4 min",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=75",
        excerpt:
          "A consistency-first approach: five focused minutes after your shower, anchored to a habit you already have.",
      },
    ],
  },
];

export default function LearnPage() {
  return (
    <SiteLayout>

      {/* ── Header ── */}
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Learn</p>
            <h1 className={`mt-3 ${type.h1}`}>The knowledge base.</h1>
            <p className={`mt-6 ${type.lead}`}>
              Guides organized by topic. Start with what's bothering you
              most — every article links out to the next logical step.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Topic groups ── */}
      <section className="py-12">
        <Container>
          <div className="space-y-14">
            {topics.map((topic) => (
              <div key={topic.category}>
                <h2 className={`mb-4 ${type.h3}`}>{topic.category}</h2>
                <div className="space-y-4">
                  {topic.articles.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
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

                      {/* Content */}
                      <div className="flex flex-1 items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                              {topic.category}
                            </span>
                            <span className="text-xs text-neutral-400">{a.readTime} read</span>
                          </div>
                          <h3 className={`mt-3 ${type.h4} group-hover:text-brand-700`}>
                            {a.title}
                          </h3>
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
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-lg border border-neutral-200 bg-brand-50 p-6">
            <p className={type.h4}>More guides coming soon.</p>
            <p className="mt-2 text-sm text-neutral-600">
              Join the waitlist to get notified when new articles and topic
              series are published.
            </p>
            <Link
              href="/waitlist"
              className="mt-4 inline-block text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700"
            >
              Join the waitlist →
            </Link>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
