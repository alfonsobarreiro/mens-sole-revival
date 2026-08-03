import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";
import { verifyProgressToken } from "@/lib/progress-token";
import { client } from "@/sanity/lib/client";
import { sectionTitle, type SectionId, type Duration, durationLabels } from "@/lib/assessment-routing";

// This page renders personal health data — keep it out of search entirely.
export const metadata: Metadata = {
  title: "Your progress",
  robots: { index: false, follow: false },
};

// Force dynamic so the token check runs on every request (never cached).
export const dynamic = "force-dynamic";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionCountRow {
  sectionId: SectionId;
  count: number;
}

interface SectionDurationRow {
  sectionId: SectionId;
  duration: Duration;
}

interface SectionItemsRow {
  sectionId: SectionId;
  items?: string[];
}

interface SubmissionDoc {
  _id: string;
  submittedAt: string;
  totalFlags: number;
  checkIn: boolean;
  notSureCount: number;
  attemptedSections?: SectionId[];
  flagsBySection?: SectionCountRow[];
  durationBySection?: SectionDurationRow[];
  itemsBySection?: SectionItemsRow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysBetween(a: string, b: string): number {
  const aT = new Date(a).getTime();
  const bT = new Date(b).getTime();
  return Math.round((aT - bT) / (24 * 60 * 60 * 1000));
}

// Flatten flagsBySection array of {sectionId, count} into a map for easy lookup.
function toFlagsMap(rows?: SectionCountRow[]): Partial<Record<SectionId, number>> {
  const out: Partial<Record<SectionId, number>> = {};
  for (const r of rows ?? []) out[r.sectionId] = r.count;
  return out;
}

function toDurationMap(rows?: SectionDurationRow[]): Partial<Record<SectionId, Duration>> {
  const out: Partial<Record<SectionId, Duration>> = {};
  for (const r of rows ?? []) out[r.sectionId] = r.duration;
  return out;
}

function toItemsMap(rows?: SectionItemsRow[]): Partial<Record<SectionId, string[]>> {
  const out: Partial<Record<SectionId, string[]>> = {};
  for (const r of rows ?? []) out[r.sectionId] = r.items ?? [];
  return out;
}

const ALL_SECTIONS: SectionId[] = [
  "nail-health",
  "skin-heels",
  "pain-inflammation",
  "alignment-structure",
  "footwear-fit",
];

// ── Views ─────────────────────────────────────────────────────────────────────

function InvalidTokenView() {
  return (
    <SiteLayout>
      <section className="border-b border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Link problem</p>
            <h1 className={`mt-3 ${type.h1}`}>This link didn't work.</h1>
            <p className={`mt-6 ${type.lead}`}>
              Your progress link is invalid or has expired. Links last 24 hours.
              No problem — request a fresh one.
            </p>
            <div className="mt-8">
              <Link
                href="/progress"
                className="inline-block bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
              >
                Request a new link
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

function NoHistoryView({ email }: { email: string }) {
  return (
    <SiteLayout>
      <section className="border-b border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>No history yet</p>
            <h1 className={`mt-3 ${type.h1}`}>Nothing to compare.</h1>
            <p className={`mt-6 ${type.lead}`}>
              We don't have any assessment submissions on file for{" "}
              <strong>{email}</strong>. Take the assessment to start your record,
              then request a link again in 30 days to see what changed.
            </p>
            <div className="mt-8">
              <Link
                href="/assessment"
                className="inline-block bg-accent-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent-600"
              >
                Take the assessment
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

// ── Delta row: which sections got better / worse / stayed the same ────────────

interface DeltaRow {
  sectionId: SectionId;
  latest: number;
  previous: number;
  delta: number; // latest - previous. Negative = improvement.
}

function computeDeltas(latest: SubmissionDoc, previous: SubmissionDoc): DeltaRow[] {
  const latestMap = toFlagsMap(latest.flagsBySection);
  const previousMap = toFlagsMap(previous.flagsBySection);
  return ALL_SECTIONS.filter(
    (sid) => latestMap[sid] !== undefined || previousMap[sid] !== undefined
  ).map((sid) => ({
    sectionId: sid,
    latest: latestMap[sid] ?? 0,
    previous: previousMap[sid] ?? 0,
    delta: (latestMap[sid] ?? 0) - (previousMap[sid] ?? 0),
  }));
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default async function ProgressViewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const verified = token ? verifyProgressToken(token) : null;
  if (!verified) return <InvalidTokenView />;

  const { email } = verified;

  // Query all submissions for this email, newest first.
  let submissions: SubmissionDoc[] = [];
  try {
    submissions = await client.fetch<SubmissionDoc[]>(
      `*[_type == "assessmentSubmission" && email == $email] | order(submittedAt desc) {
        _id,
        submittedAt,
        totalFlags,
        checkIn,
        notSureCount,
        attemptedSections,
        flagsBySection[]{sectionId, count},
        durationBySection[]{sectionId, duration},
        itemsBySection[]{sectionId, items}
      }`,
      { email }
    );
  } catch (err) {
    console.error("[Progress view] Sanity query failed:", err);
  }

  if (submissions.length === 0) return <NoHistoryView email={email} />;

  const latest = submissions[0];
  const previous = submissions[1];
  const first = submissions[submissions.length - 1];
  const deltas = previous ? computeDeltas(latest, previous) : null;

  const latestFlagsMap = toFlagsMap(latest.flagsBySection);
  const latestDurationMap = toDurationMap(latest.durationBySection);
  const latestItemsMap = toItemsMap(latest.itemsBySection);

  return (
    <SiteLayout>
      {/* ── Header ── */}
      <section className="border-b border-neutral-200 py-14 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className={type.overline}>Your progress</p>
            <h1 className={`mt-3 ${type.h1}`}>Where you are today.</h1>
            <p className="mt-4 text-sm text-neutral-500">
              {email} · {submissions.length} assessment
              {submissions.length === 1 ? "" : "s"} on record · first on{" "}
              {formatDate(first.submittedAt)}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Latest snapshot ── */}
      <section className="border-b border-neutral-200 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
              Latest ({formatDate(latest.submittedAt)})
            </p>
            <p className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-brand-900">
              {latest.totalFlags} flag{latest.totalFlags === 1 ? "" : "s"} across{" "}
              {latest.attemptedSections?.length ?? 0} section
              {(latest.attemptedSections?.length ?? 0) === 1 ? "" : "s"}
            </p>
            {previous && (
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                {daysBetween(latest.submittedAt, previous.submittedAt)} days since
                your previous check-in
              </p>
            )}
          </div>

          {/* Per-section breakdown of the latest assessment */}
          <div className="mt-8 max-w-3xl space-y-3">
            {(latest.attemptedSections ?? []).map((sid) => {
              const count = latestFlagsMap[sid] ?? 0;
              const items = latestItemsMap[sid] ?? [];
              const duration = latestDurationMap[sid];
              return (
                <div
                  key={sid}
                  className="border border-neutral-200 bg-white px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-sm font-medium text-neutral-800">
                        {sectionTitle[sid]}
                      </span>
                      {duration && count > 0 && (
                        <span className="text-xs text-neutral-500">
                          for {durationLabels[duration]}
                        </span>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-xs font-bold uppercase tracking-wider ${
                        count > 0 ? "text-brand-500" : "text-neutral-400"
                      }`}
                    >
                      {count} flag{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  {items.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3">
                      {items.map((it, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-6 text-neutral-700"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                          />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Delta vs previous ── */}
      {deltas && (
        <section className="border-b border-neutral-200 bg-neutral-50 py-12 md:py-16">
          <Container>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                What changed
              </p>
              <h2 className={`mt-2 ${type.h2} text-brand-900`}>
                Compared to your check-in on {formatDate(previous.submittedAt)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Delta = latest flag count minus previous. Negative numbers mean
                fewer flags, which is the direction you want.
              </p>
            </div>

            <div className="mt-8 max-w-3xl space-y-2">
              {deltas.map((d) => {
                const better = d.delta < 0;
                const worse = d.delta > 0;
                const flat = d.delta === 0;
                const arrow = better ? "↓" : worse ? "↑" : "·";
                const tone = better
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : worse
                  ? "text-accent-700 bg-accent-50 border-accent-200"
                  : "text-neutral-500 bg-white border-neutral-200";
                return (
                  <div
                    key={d.sectionId}
                    className={`flex items-baseline justify-between gap-3 border px-4 py-3 ${tone}`}
                  >
                    <span className="text-sm font-medium">
                      {sectionTitle[d.sectionId]}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider tabular-nums">
                      {d.previous} → {d.latest} {arrow}{" "}
                      {flat ? "no change" : `${Math.abs(d.delta)} ${better ? "better" : "worse"}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── History timeline ── */}
      {submissions.length > 1 && (
        <section className="border-b border-neutral-200 py-12 md:py-16">
          <Container>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                Full history
              </p>
              <h2 className={`mt-2 ${type.h2} text-brand-900`}>
                Every check-in, most recent first
              </h2>
            </div>

            <ol className="mt-8 max-w-3xl space-y-3">
              {submissions.map((s) => (
                <li
                  key={s._id}
                  className="flex items-baseline justify-between gap-3 border border-neutral-200 bg-white px-4 py-3"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-medium text-neutral-800">
                      {formatDate(s.submittedAt)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {s.attemptedSections?.length ?? 0} section
                      {(s.attemptedSections?.length ?? 0) === 1 ? "" : "s"} attempted
                    </span>
                    {s.checkIn && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-600">
                        Check-in on
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-brand-500 tabular-nums">
                    {s.totalFlags} flag{s.totalFlags === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* ── Next step CTA ── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className={type.lead}>
              Best time to re-take: 30 days after your latest check-in. That's a
              long enough window for a routine or fix to show up in your answers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/assessment"
                className="inline-block bg-accent-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent-600"
              >
                Take a fresh check
              </Link>
              <Link
                href="/routines"
                className="inline-block border border-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
              >
                Browse routines
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
