"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitNewsletter } from "@/app/actions/newsletter";

const initialState = { status: "idle" as const };

// ─────────────────────────────────────────────────────────────────────────────
// InlineNewsletterForm — reusable single-field capture.
//
// Powers every non-/newsletter surface where we want a lead-magnet-framed
// signup: home page band, end-of-article strip on every guide, exit-intent
// popup body, and (later) the assessment-results email capture rewrite.
//
// Same server action as /newsletter, so the double opt-in flow + Resend
// audience wiring is identical. The differentiator is the value exchange:
// this form's copy leads with the "5-minute foot check" lead magnet
// (delivered on confirmation) rather than "we email when there's something
// worth reading."
//
// Two visual variants:
//   - `tone="light"` — dark text on light background (home, article footer)
//   - `tone="dark"`  — light text on dark background (exit popup, dark bands)
// ─────────────────────────────────────────────────────────────────────────────

type Tone = "light" | "dark";

interface Props {
  tone?: Tone;
  heading?: string;
  body?: string;
  cta?: string;
  /** Small caption shown under the form. Defaults to the reassurance line. */
  reassurance?: string;
}

const DEFAULT_HEADING = "Get the 5-minute foot check.";
const DEFAULT_BODY =
  "Same questions the assessment asks, printable, yours to keep. Free.";
const DEFAULT_CTA = "Send it to me";
const DEFAULT_REASSURANCE =
  "No spam. One confirmation email. Unsubscribe anytime.";

export default function InlineNewsletterForm({
  tone = "light",
  heading = DEFAULT_HEADING,
  body = DEFAULT_BODY,
  cta = DEFAULT_CTA,
  reassurance = DEFAULT_REASSURANCE,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitNewsletter,
    initialState
  );

  const isDark = tone === "dark";

  const headingClass = isDark
    ? "font-heading text-2xl font-semibold text-white md:text-3xl"
    : "font-heading text-2xl font-semibold text-brand-900 md:text-3xl";

  const bodyClass = isDark
    ? "mt-3 text-base leading-relaxed text-white/80"
    : "mt-3 text-base leading-relaxed text-neutral-600";

  const reassuranceClass = isDark
    ? "mt-3 text-xs text-white/60"
    : "mt-3 text-xs text-neutral-400";

  const inputClass = isDark
    ? "w-full rounded border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
    : "w-full rounded border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

  // Success state — inline confirmation, no page redirect.
  if (state.status === "success") {
    return (
      <div>
        <p className={headingClass}>Check your inbox.</p>
        <p className={bodyClass}>
          Click the confirmation link we just sent. Once you confirm, the
          5-minute foot check is yours. (No link yet? Check your spam folder.
          It lands within a minute.)
        </p>
        <p className={reassuranceClass}>
          Already know it works?{" "}
          <Link
            href="/foot-check"
            className={
              isDark
                ? "text-accent-300 underline underline-offset-4"
                : "text-brand-600 underline underline-offset-4"
            }
          >
            See the checklist now →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className={headingClass}>{heading}</p>
      <p className={bodyClass}>{body}</p>

      <form action={formAction} className="mt-6 space-y-3" noValidate>
        {state.status === "error" && !state.field && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {state.message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="ilf-email" className="sr-only">
            Email address
          </label>
          <input
            id="ilf-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending…" : cta}
          </button>
        </div>

        {state.status === "error" && state.field === "email" && (
          <p className="text-xs text-red-600">{state.message}</p>
        )}
      </form>

      <p className={reassuranceClass}>{reassurance}</p>
    </div>
  );
}
