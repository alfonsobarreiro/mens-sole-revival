"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { type } from "@/components/typography";
import {
  articleList,
  symptomLabels,
  symptomOrder,
  type Symptom,
} from "@/lib/ecosystem";

// ── Category color (kept from the previous version) ───────────────────────────

const categoryColor: Record<string, string> = {
  "Footwear Fit":  "bg-brand-50 text-brand-700",
  "Alignment":     "bg-brand-50 text-brand-700",
  "Dry Skin":      "bg-amber-50 text-amber-700",
  "Nail Care":     "bg-teal-50 text-teal-700",
  "Daily Routine": "bg-accent-50 text-accent-700",
};

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
      <section className="relative flex h-[45vh] flex-col overflow-hidden bg-brand-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pexels-10904211.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900/90 via-brand-900/50 to-transparent" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>Learn</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                The knowledge<br />base.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Guides organized by symptom. Start with what's bothering you
                most. Every article links to the next logical step.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <AssessmentEntryStrip />

      {/* ── Filter bar: search + symptom chips ── */}
      <section className="py-10 md:py-14">
        <Container>
          {/* Search input */}
          <div className="mb-6">
            <label htmlFor="learn-search" className="sr-only">
              Search guides
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
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
                className="w-full border border-neutral-300 bg-white py-3 pl-12 pr-4 text-sm leading-6 text-neutral-800 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Symptom chips */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                active === "all"
                  ? "bg-brand-900 text-white"
                  : "border border-neutral-300 bg-white text-neutral-700 hover:border-brand-500"
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
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  active === s
                    ? "bg-brand-900 text-white"
                    : "border border-neutral-300 bg-white text-neutral-700 hover:border-brand-500"
                }`}
              >
                {symptomLabels[s]}
                <span className="ml-2 font-normal opacity-60">
                  {countFor(s)}
                </span>
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {filtered.length === articleList.length
              ? `${articleList.length} guides`
              : `${filtered.length} of ${articleList.length} guides`}
            {query && ` matching "${query}"`}
          </p>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${categoryColor[a.category] ?? "bg-white/90 text-brand-900"}`}>
                      {a.category}
                    </span>
                  </div>
                </div>

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
                  {a.symptoms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {a.symptoms.map((s) => (
                        <span
                          key={s}
                          className="bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
                        >
                          {symptomLabels[s]}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-500 group-hover:text-brand-700">
                    Read guide →
                  </p>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full border border-dashed border-neutral-200 py-16 text-center">
                <p className="text-sm text-neutral-500">
                  No guides match{query ? ` "${query}"` : ""} yet.
                </p>
                <button
                  onClick={() => {
                    setActive("all");
                    setQuery("");
                  }}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-500 underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

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

export default function LearnPage() {
  return (
    <Suspense fallback={null}>
      <LearnContent />
    </Suspense>
  );
}
