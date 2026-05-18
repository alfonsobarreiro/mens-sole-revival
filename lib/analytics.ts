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

/** Fire a GA4 event. No-ops cleanly when gtag is unavailable
 * (SSR, dev without GA, ad-blocker, etc.) so call sites stay simple. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, params);
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
