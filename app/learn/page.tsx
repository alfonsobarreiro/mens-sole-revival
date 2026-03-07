"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

// ── Article data ─────────────────────────────────────────────────────────────

const articles = [
  {
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    href: "/blog/toenail-fungus-what-works",
    category: "Nail Care",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
    excerpt: "The evidence on OTC treatments, prescription options, and home remedies — ranked by how well they actually work.",
  },
  {
    title: "Why Toe Alignment Affects Your Knees and Hips",
    href: "/blog/why-toe-alignment-affects-knees-and-hips",
    category: "Alignment",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75",
    excerpt: "The connection between cramped toes, altered gait, and the knee and hip pain that follows years later.",
  },
  {
    title: "A 5-Minute Daily Foot-Care Routine You Can Stick To",
    href: "/blog/5-minute-routine",
    category: "Daily Routine",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=75",
    excerpt: "A consistency-first approach: five focused minutes after your shower, anchored to a habit you already have.",
  },
];

const allCategories = ["All", ...Array.from(new Set(articles.map((a) => a.category)))];

// ── Category colour map ───────────────────────────────────────────────────────
const categoryColor: Record<string, string> = {
  "Nail Care":      "bg-teal-50 text-teal-700",
  "Alignment":      "bg-brand-50 text-brand-700",
  "Daily Routine":  "bg-accent-50 text-accent-700",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? articles
    : articles.filter((a) => a.category === active);

  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[55vh] flex-col overflow-hidden bg-brand-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=75"
            alt=""
            fill
            className="object-cover object-center opacity-40"
            priority
          />
        </div>
        {/* Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/20" />

        {/* Text — bottom-left editorial anchor */}
        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>Learn</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                The knowledge<br />base.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Guides organized by topic. Start with what's bothering you
                most — every article links to the next logical step.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Filter tabs + grid ── */}
      <section className="py-10 md:py-14">
        <Container>

          {/* Filter tabs — angular underline style */}
          <div className="mb-8 flex flex-wrap gap-0 border-b border-neutral-200">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`-mb-px px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  active === cat
                    ? "border-brand-900 text-brand-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-2 font-normal opacity-50">
                    {articles.filter((a) => a.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Article grid — sharp image-first cards, no rounding */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                {/* Full-bleed image — sharp edges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Category badge overlaid bottom-left */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-900 backdrop-blur-sm">
                      {a.category}
                    </span>
                  </div>
                </div>

                {/* Text below image */}
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {a.readTime} read
                  </p>
                  <h2 className="font-display text-lg font-bold uppercase leading-tight text-neutral-900 transition group-hover:text-brand-700 md:text-xl">
                    {a.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500">
                    {a.excerpt}
                  </p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-500 group-hover:text-brand-700">
                    Read guide →
                  </p>
                </div>
              </Link>
            ))}

            {/* Empty-state */}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-neutral-400">
                <p className="text-sm">No guides in this category yet.</p>
                <button
                  onClick={() => setActive("All")}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-500 underline underline-offset-4"
                >
                  View all guides
                </button>
              </div>
            )}
          </div>

          {/* Coming soon callout — sharp edges */}
          <div className="mt-12 border border-neutral-200 bg-neutral-50 p-6 md:flex md:items-center md:justify-between">
            <div>
              <p className="font-display text-xl font-bold uppercase leading-tight text-brand-900">More guides coming soon.</p>
              <p className="mt-1 text-sm text-neutral-600">
                Join the waitlist to get notified when new articles and topic series are published.
              </p>
            </div>
            <Link
              href="/waitlist"
              className="mt-4 inline-block flex-shrink-0 bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 md:mt-0 md:ml-8"
            >
              Join the waitlist
            </Link>
          </div>

        </Container>
      </section>

    </SiteLayout>
  );
}
