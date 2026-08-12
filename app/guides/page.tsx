"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { Button } from "@/components/ui";
import { type } from "@/components/typography";
import {
  articleList,
  symptomLabels,
  symptomOrder,
  type Symptom,
} from "@/lib/ecosystem";

// ── Category chip color — unified per DS ─────────────────────────────────────
// Every category renders bg-neutral-100 + text-accent-700 (documented terracotta
// kicker exception). Previously used tailwind amber/teal + accent-50 (removed
// from ramp) + brand-50/700 (legacy off-ramp) — all off-DS.

const CATEGORY_CHIP = "bg-neutral-100 text-accent-700";

// ── Page ─────────────────────────────────────────────────────────────────────

function LearnContent() {
  const searchParams = useSearchParams();
  const initialSymptom = searchParams.get("symptom") as Symptom | null;
  const initialQ = searchParams.get("q") ?? "";

  const [active, setActive] = useState<Symptom | "all">(
    initialSymptom && symptomOrder.includes(initialSymptom)
      ? initialSymptom
      : "all"
  );
  const [query, setQuery] = useState(initialQ);

  // Keep filter state in sync if the URL changes (e.g. nav from homepage chips)
  useEffect(() => {
    const s = searchParams.get("symptom") as Symptom | null;
    if (s && symptomOrder.includes(s)) setActive(s);
    const q = searchParams.get("q");
    if (q !== null) setQuery(q);
  }, [searchParams]);

  // ── Filter pipeline: symptom chip → text query ──────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articleList.filter((a) => {
      const matchesSymptom = active === "all" || a.symptoms.includes(active);
      if (!matchesSymptom) return false;
      if (!q) return true;
      const hay = `${a.title} ${a.excerpt} ${a.category} ${a.symptoms.join(
        " "
      )}`.toLowerCase();
      return hay.includes(q);
    });
  }, [active, query]);

  const countFor = (s: Symptom) =>
    articleList.filter((a) => a.symptoms.includes(s)).length;

  return (
    <SiteLayout>
      {/* ── Hero ── */}
      <section className="relative flex flex-col overflow-hidden bg-ink py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pexels-10904211.jpg"
            alt=""
            fill
            className="muted-photo object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl">
              <p className="eyebrow text-inverse-caption">Learn</p>
              <h1 className={`mt-3 ${type.displayHero} text-inverse`}>
                The knowledge base.
              </h1>
              <p className={`mt-6 max-w-xl ${type.lead} text-inverse-body`}>
                Guides organized by symptom. Start with what's bothering you
                most; every guide links to the next one to read.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <AssessmentEntryStrip />

      {/* ── Filter bar: search + symptom chips ── */}
      <section className="py-16 md:py-24">
        <Container>
          {/* Search input */}
          <div className="mb-6">
            <label htmlFor="learn-search" className="sr-only">
              Search guides
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                id="learn-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by symptom or topic. Try: heel, fungus, knee, fit."
                className="w-full border border-border-input bg-bg-elevated py-3 pl-12 pr-4 text-[0.9375rem] leading-[1.5] text-ink placeholder:text-neutral-500 focus:border-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-600/40"
              />
            </div>
          </div>

          {/* Symptom chips — mixed case, DS tokens */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`px-4 py-2 text-xs font-medium tracking-[0.01em] transition ${
                active === "all"
                  ? "bg-ink text-inverse"
                  : "border border-neutral-300 bg-bg-elevated text-neutral-600 hover:border-ink hover:text-ink"
              }`}
            >
              All
              <span className="ml-2 font-normal opacity-60">
                {articleList.length}
              </span>
            </button>
            {symptomOrder.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActive(s)}
                className={`px-4 py-2 text-xs font-medium tracking-[0.01em] transition ${
                  active === s
                    ? "bg-ink text-inverse"
                    : "border border-neutral-300 bg-bg-elevated text-neutral-600 hover:border-ink hover:text-ink"
                }`}
              >
                {symptomLabels[s]}
                <span className="ml-2 font-normal opacity-60">
                  {countFor(s)}
                </span>
              </button>
            ))}
          </div>

          {/* Result count — mixed case, .eyebrow class */}
          <p className="eyebrow mb-4">
            {filtered.length === articleList.length
              ? `${articleList.length} guides`
              : `${filtered.length} of ${articleList.length} guides`}
            {query && ` matching "${query}"`}
          </p>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-bg-elevated transition hover:border-ink"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="muted-photo object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-3 py-1 text-xs font-medium tracking-[0.01em] backdrop-blur-sm ${CATEGORY_CHIP}`}>
                      {a.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-6">
                  <p className="eyebrow mb-2 text-accent-700">
                    {a.readTime} read
                  </p>
                  <h2 className={`${type.h3} text-ink transition group-hover:text-accent-700`}>
                    {a.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-[1.5] text-neutral-600">
                    {a.excerpt}
                  </p>
                  {a.symptoms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {a.symptoms.map((s) => (
                        <span
                          key={s}
                          className="bg-neutral-200 px-2 py-1 text-xs font-medium tracking-[0.01em] text-neutral-700"
                        >
                          {symptomLabels[s]}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-[0.9375rem] font-medium text-link group-hover:text-link-hover">
                    Read guide →
                  </p>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full border border-dashed border-neutral-200 py-16 text-center">
                <p className="text-[0.9375rem] leading-[1.5] text-neutral-600">
                  No guides match{query ? ` "${query}"` : ""} yet.
                </p>
                <button
                  onClick={() => {
                    setActive("all");
                    setQuery("");
                  }}
                  className="mt-3 text-[0.9375rem] font-medium text-link underline underline-offset-4 hover:text-link-hover"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 border border-neutral-200 bg-neutral-100 p-6 md:flex md:items-center md:justify-between">
            <div>
              <p className={`${type.h3} text-ink`}>A new guide every other Tuesday.</p>
              <p className={`mt-1 ${type.body} text-neutral-600`}>
                New guides land in your inbox as they publish.
              </p>
            </div>
            <div className="mt-4 flex-shrink-0 md:mt-0 md:ml-8">
              <Button href="/newsletter" size="sm">Subscribe</Button>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={null}>
      <LearnContent />
    </Suspense>
  );
}
