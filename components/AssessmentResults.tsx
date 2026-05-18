"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import {
  submitAssessmentEmail,
  type AssessmentEmailState,
  type FlagsByLabel,
} from "@/app/actions/assessment-email";
import {
  composeResult,
  sectionTitle,
  type SectionId,
} from "@/lib/assessment-routing";

const initialEmail: AssessmentEmailState = { status: "idle" };

interface AssessmentResultsProps {
  flagsBySection: Partial<Record<SectionId, number>>;
  totalFlags: number;
  /** Section IDs the user worked through (used for the per-section
   * flag summary on top of the result blocks). */
  attemptedSections: SectionId[];
  notSureCount: number;
  /** Called when the user clicks "Download PDF for my doctor". */
  onDownloadPdf: () => void;
  /** Called when the user clicks Restart. */
  onRestart: () => void;
}

/**
 * Three-block result screen built per MSR-Assessment-Redesign.md §3.4:
 * Articles to read · Routine to follow · Talk to a professional.
 * Above the three blocks: a per-section flag summary so the result is
 * traceable to what the user answered.
 */
export default function AssessmentResults({
  flagsBySection,
  totalFlags,
  attemptedSections,
  notSureCount,
  onDownloadPdf,
  onRestart,
}: AssessmentResultsProps) {
  const result = composeResult(flagsBySection);

  const [emailState, emailAction, emailPending] = useActionState(
    submitAssessmentEmail,
    initialEmail
  );

  const flagsForEmail: FlagsByLabel[] = attemptedSections.map((sid) => ({
    label: sectionTitle[sid],
    count: flagsBySection[sid] ?? 0,
  }));

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
              <span className="font-bold text-brand-900">
                {notSureCount}
              </span>{" "}
              marked &ldquo;Not sure&rdquo;
            </>
          )}
          .
        </p>
        {attemptedSections.length > 0 && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {attemptedSections.map((sid) => {
              const count = flagsBySection[sid] ?? 0;
              return (
                <li
                  key={sid}
                  className="flex items-center justify-between border border-neutral-200 bg-white px-4 py-3"
                >
                  <span className="text-sm font-medium text-neutral-800">
                    {sectionTitle[sid]}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                    {count} flag{count === 1 ? "" : "s"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Block 1: Articles to read ──────────────────────────────────── */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Block 1
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900">
          Articles to read.
        </h3>
        <p className="mt-1 text-sm text-neutral-500">Based on what you flagged.</p>
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
                className="group flex gap-4 border border-neutral-200 bg-white p-4 transition hover:border-brand-300 hover:bg-neutral-50"
              >
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
            className="group mt-4 flex items-center justify-between border border-neutral-200 bg-white p-5 transition hover:border-brand-300 hover:bg-neutral-50"
          >
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
          <div className="mt-3 border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              Sent. Check your inbox.
            </p>
          </div>
        ) : (
          <form
            action={emailAction}
            className="mt-3 grid gap-3 border border-neutral-200 bg-white p-5"
          >
            <p className="text-sm leading-6 text-neutral-700">
              Email yourself a copy. We'll keep the results and (optionally)
              check in at 30 and 90 days. No marketing.
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
            onClick={onDownloadPdf}
            className="border border-brand-900 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
          >
            Download PDF
          </button>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 underline underline-offset-4 hover:text-brand-700"
        >
          Restart the assessment →
        </button>
      </section>
    </div>
  );
}
