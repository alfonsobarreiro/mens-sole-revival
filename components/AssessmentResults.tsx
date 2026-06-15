"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import {
  submitAssessmentEmail,
  type AssessmentEmailState,
  type FlagsByLabel,
} from "@/app/actions/assessment-email";
import {
  composeResult,
  durationLabels,
  sectionTitle,
  type Duration,
  type SectionId,
} from "@/lib/assessment-routing";
import { trackAssessment } from "@/lib/analytics";

const initialEmail: AssessmentEmailState = { status: "idle" };

interface AssessmentResultsProps {
  flagsBySection: Partial<Record<SectionId, number>>;
  durationBySection: Partial<Record<SectionId, Duration>>;
  /** Per-section, the human-readable text of every item the user
   * flagged. Surfaces in each section card so the user (and any
   * print/PDF of the page) sees what specifically was checked, not
   * just a count. */
  itemsBySection: Partial<Record<SectionId, string[]>>;
  totalFlags: number;
  /** Section IDs the user worked through (used for the per-section
   * flag summary on top of the result blocks). */
  attemptedSections: SectionId[];
  notSureCount: number;
  /** Called when the user clicks "Download PDF for my doctor". */
  onDownloadPdf: () => void;
  /** Called when the user clicks Restart. */
  onRestart: () => void;
  /** Called when the user wants to step back into the last section to
   * edit an answer. Their previous answers persist; results recompute
   * after they hit Next again. */
  onBackToLastSection: () => void;
}

/**
 * Three-block result screen built per MSR-Assessment-Redesign.md §3.4:
 * Articles to read · Routine to follow · Talk to a professional.
 * Above the three blocks: a per-section flag summary so the result is
 * traceable to what the user answered.
 */
export default function AssessmentResults({
  flagsBySection,
  durationBySection,
  totalFlags,
  attemptedSections,
  notSureCount,
  itemsBySection,
  onDownloadPdf,
  onRestart,
  onBackToLastSection,
}: AssessmentResultsProps) {
  const result = composeResult({
    flagsBySection,
    durationBySection,
    notSureCount,
  });

  // Fire results_view exactly once, when the component first mounts.
  useEffect(() => {
    trackAssessment("assessment_results_view", {
      total_flags: totalFlags,
      not_sure_count: notSureCount,
      attempted_sections: attemptedSections.length,
      recommends_clinic: result.recommendsClinic,
      articles_count: result.articles.length,
      has_routine: Boolean(result.routine),
      prep_bullet_count: result.prepBullets.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [emailState, emailAction, emailPending] = useActionState(
    submitAssessmentEmail,
    initialEmail
  );

  useEffect(() => {
    if (emailState.status === "success") {
      trackAssessment("assessment_email_save", { total_flags: totalFlags });
    }
  }, [emailState.status, totalFlags]);

  const flagsForEmail: FlagsByLabel[] = attemptedSections.map((sid) => ({
    label: sectionTitle[sid],
    count: flagsBySection[sid] ?? 0,
  }));

  const handleArticleClick = (slug: string) =>
    trackAssessment("assessment_article_click", { slug });
  const handleRoutineClick = (anchor?: string) =>
    trackAssessment("assessment_routine_click", { anchor: anchor ?? "none" });
  const handlePdf = () => {
    trackAssessment("assessment_pdf_download", { total_flags: totalFlags });
    onDownloadPdf();
  };
  const handleRestart = () => {
    trackAssessment("assessment_restart", { total_flags: totalFlags });
    onRestart();
  };

  return (
    <div className="space-y-10">
      {/* ── Per-section flag summary ───────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Your results
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-brand-900">
          Here's where you stand.
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-700">
          You flagged{" "}
          <span className="font-bold text-brand-900">{totalFlags}</span> item
          {totalFlags === 1 ? "" : "s"} across the sections you took
          {notSureCount > 0 && (
            <>
              , with{" "}
              <span className="font-bold text-brand-900">{notSureCount}</span>{" "}
              marked &ldquo;Not sure&rdquo;
            </>
          )}
          .
        </p>
        {attemptedSections.length > 0 && (
          <ul className="mt-5 space-y-3">
            {attemptedSections.map((sid) => {
              const count = flagsBySection[sid] ?? 0;
              const items = itemsBySection[sid] ?? [];
              const duration = durationBySection[sid];
              const bucket = result.bucketBySection[sid];
              return (
                <li
                  key={sid}
                  className="border border-neutral-200 bg-white px-4 py-3"
                >
                  {/* Header row: section name + duration + count */}
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
                      {bucket === "high" && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-600">
                          Worth a podiatrist visit
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

                  {/* Items list (only when count > 0) */}
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
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Clinic recommendation callout ─────────────────────────────── */}
      {result.recommendsClinic && (
        <section className="border-l-4 border-accent-500 bg-accent-50 px-5 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-700">
            Worth a professional visit
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            {notSureCount >= 3
              ? "You marked several pain items as Not sure. That interpretive uncertainty is exactly what a 20-minute podiatrist consult is for. The routine and articles below still apply, but don't try to self-resolve this one."
              : "One or more sections came back severe enough that a podiatrist visit is the right next step. The routine and articles below help in the meantime, but they're not a substitute."}
          </p>
          <a
            href="https://www.apma.org/find-a-podiatrist"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-700 underline underline-offset-4 hover:text-accent-800"
          >
            Find a podiatrist near you →
          </a>
        </section>
      )}

      {/* ── Block 1: Articles to read ──────────────────────────────────── */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Block 1
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900">
          Read &amp; do.
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Each card is a guide plus the first concrete move from it.
        </p>
        {result.articles.length === 0 ? (
          <p className="mt-4 border border-dashed border-neutral-200 p-4 text-sm text-neutral-500">
            No flags strong enough to recommend specific reading. Browse the
            full library if you want to dig in.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {result.articles.map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                onClick={() => handleArticleClick(a.slug)}
                className="group flex flex-col border border-neutral-200 bg-white transition hover:border-brand-300 hover:bg-neutral-50"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden bg-neutral-100">
                    <Image
                      src={a.imageUrl}
                      alt={a.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-600">
                      {a.category} · {a.readTime} read
                    </p>
                    <p className="mt-1 text-sm font-bold leading-tight text-brand-900 group-hover:text-brand-600">
                      {a.title}
                    </p>
                  </div>
                </div>
                <p className="border-t border-neutral-100 bg-neutral-50/60 px-4 py-3 text-xs leading-5 text-neutral-700">
                  <span className="font-bold uppercase tracking-wider text-brand-500">
                    First move:
                  </span>{" "}
                  {a.action}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Block 2: Routine to follow ─────────────────────────────────── */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Block 2
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900">
          Routine to follow.
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          One specific starting point, not a list.
        </p>
        {result.routine ? (
          <Link
            href={`/routines#${result.routine.anchor}`}
            onClick={() => handleRoutineClick(result.routine?.anchor)}
            className="group mt-4 block border border-neutral-200 bg-white transition hover:border-brand-300 hover:bg-neutral-50"
          >
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                  Routine · {result.routine.label}
                </p>
                <p className="mt-2 font-display text-xl font-bold uppercase leading-tight text-brand-900 group-hover:text-brand-600">
                  {result.routine.heading}
                </p>
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  {result.routine.time}
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500 group-hover:text-brand-700">
                See it →
              </span>
            </div>
            <p className="border-t border-neutral-100 bg-neutral-50/60 px-5 py-3 text-xs leading-5 text-neutral-700">
              <span className="font-bold uppercase tracking-wider text-brand-500">
                First move:
              </span>{" "}
              {result.routine.action}
            </p>
          </Link>
        ) : (
          <p className="mt-4 border border-dashed border-neutral-200 p-4 text-sm text-neutral-500">
            Nothing urgent enough to assign a routine. Build the nightly five
            minutes if you don't already have one.
          </p>
        )}
      </section>

      {/* ── Block 3: Talk to a professional ────────────────────────────── */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Block 3
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900">
          Talk to a professional.
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Read these to your podiatrist. They cover what you came to say.
        </p>
        {result.prepBullets.length > 0 ? (
          <ul className="mt-4 space-y-2 border-l-2 border-brand-200 bg-white py-2 pl-5 pr-4">
            {result.prepBullets.map((b, i) => (
              <li key={i} className="text-sm leading-6 text-neutral-700">
                {b}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 border border-dashed border-neutral-200 p-4 text-sm text-neutral-500">
            Nothing in this self-check rises to the level of a podiatrist
            visit. Re-take in a few months if anything changes.
          </p>
        )}
        <a
          href="https://www.apma.org/find-a-podiatrist"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-600 underline underline-offset-4 hover:text-accent-700"
        >
          Find a podiatrist near you →
        </a>
      </section>

      {/* ── Save row ───────────────────────────────────────────────────── */}
      <section className="border-t border-neutral-200 pt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Save your results
        </p>

        {emailState.status === "success" ? (
          <div className="mt-3 border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              ✓ Sent
            </p>
            <p className="mt-2 font-display text-xl font-bold uppercase leading-tight text-emerald-800">
              Check your inbox.
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-800/80">
              Your results are on the way. If you opted in to the 30 and 90
              day check-ins, we'll nudge you when it's time to re-take.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-emerald-200 pt-5">
              <button
                type="button"
                onClick={onRestart}
                className="bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
              >
                Take a fresh self-check
              </button>
              <button
                type="button"
                onClick={handlePdf}
                className="border border-brand-900 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
              >
                Download PDF for my doctor
              </button>
            </div>
          </div>
        ) : (
          <form
            action={emailAction}
            className="mt-3 grid gap-3 border border-neutral-200 bg-white p-5"
          >
            <p className="text-sm leading-6 text-neutral-700">
              Email yourself a copy. We'll save your results and send the
              occasional foot-health guide worth your time. Unsubscribe anytime.
            </p>
            <input
              type="hidden"
              name="flags"
              value={JSON.stringify(flagsForEmail)}
            />
            <input type="hidden" name="totalFlags" value={String(totalFlags)} />
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Email address
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="flex items-start gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="checkIn"
                defaultChecked
                className="mt-1 h-4 w-4 border-neutral-300 text-brand-900 focus:ring-brand-500"
              />
              <span>
                Check in with me at 30 and 90 days.{" "}
                <span className="text-neutral-400">(Recommended.)</span>
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={emailPending}
                className="bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {emailPending ? "Sending..." : "Send my results"}
              </button>
              {emailState.status === "error" && emailState.message && (
                <p className="text-xs text-red-600">{emailState.message}</p>
              )}
            </div>
          </form>
        )}

        {/* PDF for doctor visit */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-neutral-200 bg-neutral-50 p-4">
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              Download PDF for your doctor.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Formatted as a print-ready summary for a podiatrist visit.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePdf}
            className="border border-brand-900 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
          >
            Download PDF
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={onBackToLastSection}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 underline underline-offset-4 hover:text-brand-700"
          >
            ← Edit my answers
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 underline underline-offset-4 hover:text-brand-700"
          >
            Restart the assessment →
          </button>
        </div>
      </section>
    </div>
  );
}
