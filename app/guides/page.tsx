"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { Button, Card, CardBody, Chip, Input, Tag } from "@/components/ui";
import { type } from "@/components/typography";
import {
  articleList,
  symptomLabels,
  symptomOrder,
  type Symptom,
} from "@/lib/ecosystem";

// Every category chip renders via DS Tag variant="accent-kicker" — the
// documented terracotta-kicker exception (accent-700 label on neutral-100).

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
          {/* Search input — DS Input with icon prefix */}
          <div className="mb-6">
            <Input
              id="learn-search"
              type="search"
              label="Search guides"
              hideLabel
              placeholder="Search by symptom or topic. Try: heel, fungus, knee, fit."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              prefix={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              }
            />
          </div>

          {/* Symptom chips — DS Chip primitive */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Chip
              active={active === "all"}
              count={articleList.length}
              onClick={() => setActive("all")}
            >
              All
            </Chip>
            {symptomOrder.map((s) => (
              <Chip
                key={s}
                active={active === s}
                count={countFor(s)}
                onClick={() => setActive(s)}
              >
                {symptomLabels[s]}
              </Chip>
            ))}
          </div>

          {/* Result count — mixed case, .eyebrow class */}
          <p className="eyebrow mb-4">
            {filtered.length === articleList.length
              ? `${articleList.length} guides`
              : `${filtered.length} of ${articleList.length} guides`}
            {query && ` matching "${query}"`}
          </p>

          {/* Grid — DS Card composition, wrapped in Link */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                className="group block h-full"
              >
                <Card
                  variant="elevated"
                  className="flex h-full flex-col overflow-hidden transition group-hover:border-ink"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={a.imageUrl}
                      alt={a.title}
                      fill
                      className="muted-photo object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3">
                      <Tag variant="accent-kicker" className="backdrop-blur-sm">
                        {a.category}
                      </Tag>
                    </div>
                  </div>

                  <CardBody className="flex flex-1 flex-col !px-4 !py-4 md:!px-6 md:!py-6">
                    <p className="eyebrow mb-2 text-accent-700">
                      {a.readTime} read
                    </p>
                    <h2 className={`${type.h3} text-ink transition group-hover:text-accent-700`}>
                      {a.title}
                    </h2>
                    <p className={`mt-2 flex-1 ${type.body} text-neutral-600`}>
                      {a.excerpt}
                    </p>
                    {a.symptoms.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {a.symptoms.map((s) => (
                          <Tag key={s} variant="muted">
                            {symptomLabels[s]}
                          </Tag>
                        ))}
                      </div>
                    )}
                    <p className="mt-4 text-[0.9375rem] font-medium text-link group-hover:text-link-hover">
                      Read guide →
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full border border-dashed border-neutral-200 py-16 text-center">
                <p className={`${type.body} text-neutral-600`}>
                  No guides match{query ? ` "${query}"` : ""} yet.
                </p>
                <div className="mt-3">
                  <Button
                    variant="link"
                    onClick={() => {
                      setActive("all");
                      setQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Subscribe callout — DS Card variant="surface" */}
          <Card variant="surface" className="mt-12">
            <CardBody className="md:flex md:items-center md:justify-between !px-6 !py-6">
              <div>
                <p className={`${type.h3} text-ink`}>A new guide every other Tuesday.</p>
                <p className={`mt-1 ${type.body} text-neutral-600`}>
                  New guides land in your inbox as they publish.
                </p>
              </div>
              <div className="mt-4 flex-shrink-0 md:mt-0 md:ml-8">
                <Button href="/newsletter" size="sm">Subscribe</Button>
              </div>
            </CardBody>
          </Card>
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
