/**
 * Centralized GA4 event helper. Wraps `window.gtag` with a typed,
 * fail-safe interface so callers don't need to worry about SSR,
 * dev environments without GA, or accidental shape drift.
 *
 * Naming convention: `<surface>_<action>` (snake_case, lowercase),
 * matching GA4's recommended event style. Keep names stable —
 * renames break historical reporting.
 *
 * Event taxonomy lives at the bottom of this file (`AssessmentEvent`)
 * so the surface inventory is grep-able in one place.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "consent",
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

// The GoogleAnalytics component defines window.gtag in a script that runs
// after hydration, so an event fired while a page mounts (a confirmation
// page, a results screen) can arrive before gtag exists. Those events are
// held here and sent once gtag appears. If it never does (ad blocker, GA
// not mounted outside production), the queue is dropped after ten seconds.
const pending: Array<[string, Record<string, unknown>]> = [];
let flushTimer: number | null = null;
const FLUSH_EVERY_MS = 250;
const FLUSH_ATTEMPTS = 40;

function flushPending(): boolean {
  if (typeof window.gtag !== "function") return false;
  while (pending.length > 0) {
    const [event, params] = pending.shift()!;
    window.gtag("event", event, params);
  }
  return true;
}

/** Fire a GA4 event. No-ops cleanly when gtag never becomes available
 * (SSR, dev without GA, ad-blocker, etc.) so call sites stay simple. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
      return;
    }
    pending.push([event, params]);
    if (flushTimer !== null) return;
    let attempts = 0;
    flushTimer = window.setInterval(() => {
      attempts += 1;
      if (flushPending() || attempts >= FLUSH_ATTEMPTS) {
        window.clearInterval(flushTimer!);
        flushTimer = null;
        pending.length = 0;
      }
    }, FLUSH_EVERY_MS);
  } catch {
    /* swallow — analytics never break the UX */
  }
}

// ── Assessment event taxonomy ─────────────────────────────────────────────
//
// Lifecycle (in order a single session emits them):
//   assessment_started       — user clicks "Start the assessment" on intro
//   assessment_triage_done   — user picks symptoms (or "show me everything") + advances
//   assessment_section_done  — user finishes a section (one event per section)
//   assessment_section_skip  — user skips the active section
//   assessment_results_view  — results screen renders
//   assessment_article_click — user clicks an article card on results
//   assessment_routine_click — user clicks the routine card on results
//   assessment_review_click  — user clicks a reviewed product card on results
//   assessment_email_save    — user submits the email-save form
//   assessment_pdf_download  — user clicks "Download PDF"
//   assessment_restart       — user clicks restart
//   assessment_feedback_sent — user submits the feedback form
//
// Severity / not-sure signals fire alongside the section_done event
// rather than as standalone events so the cohort grain stays clean.

export type AssessmentEvent =
  | "assessment_started"
  | "assessment_triage_done"
  | "assessment_section_done"
  | "assessment_section_skip"
  | "assessment_results_view"
  | "assessment_article_click"
  | "assessment_routine_click"
  | "assessment_review_click"
  | "assessment_email_save"
  | "assessment_pdf_download"
  | "assessment_restart"
  | "assessment_feedback_sent";

export function trackAssessment(
  event: AssessmentEvent,
  params: Record<string, unknown> = {}
): void {
  track(event, params);
}

// ── Newsletter event taxonomy ─────────────────────────────────────────────
//
//   newsletter_signup    — the signup form is accepted and the confirmation
//                          email is on its way. `from` names the placement:
//                          page (/newsletter), home, article, popup,
//                          foot-check, doctor-prep
//   newsletter_confirmed — the visitor opens a valid confirmation link
//
// Email capture is the site's north star. Both belong marked as key events
// in the GA property (Admin → Events → Mark as key event), together with
// assessment_email_save.

export type NewsletterEvent = "newsletter_signup" | "newsletter_confirmed";

export function trackNewsletter(
  event: NewsletterEvent,
  params: Record<string, unknown> = {}
): void {
  track(event, params);
}
