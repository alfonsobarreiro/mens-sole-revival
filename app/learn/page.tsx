import type { Metadata } from "next";
import Link from "next/link";
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
          <div className="space-y-12">
            {topics.map((topic) => (
              <div key={topic.category}>
                <h2 className={type.h3}>{topic.category}</h2>
                <div className="mt-4 space-y-3">
                  {topic.articles.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-5 py-4 transition hover:border-brand-300 hover:shadow-sm"
                    >
                      <span className="text-sm font-medium text-neutral-800 group-hover:text-brand-700">
                        {a.title}
                      </span>
                      <div className="flex items-center gap-3 text-neutral-400">
                        <span className="text-xs">{a.readTime}</span>
                        <span className="text-sm group-hover:text-brand-500">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-neutral-200 bg-brand-50 p-6">
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
