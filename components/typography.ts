// ─────────────────────────────────────────────────────────────
// Typography tokens — mirrors the MSR DS (Figma cAPu29rp3vKoYF4uqiyIyr)
// Ryan's rules (2026-08-11): mixed case everywhere except one role.
// Unified at Lora Medium 500 across all headings AND the wordmark.
// ─────────────────────────────────────────────────────────────

// DS scale: 60 / 40 / 28 / 20 / 15 / 12 px. Every heading token below caps
// at one of these steps. Mobile scales down from the DS max; desktop hits it.
export const type = {
  // Display — Lora Medium, mixed case, tight leading, slight negative tracking.
  // displayHero caps at 60px per DS. Mobile drops one step for practicality.
  displayHero:    "font-heading text-[2.5rem] font-medium leading-[1.05] tracking-[-0.01em] md:text-[3.75rem]",
  displaySection: "font-heading text-[1.75rem] font-medium leading-[1.15] tracking-[-0.01em]",
  displaySm:      "font-heading text-[1.75rem] font-medium leading-[1.15] tracking-[-0.01em]",

  // Editorial (Lora Medium) — headings + article prose
  display: "font-heading text-[3.75rem] font-medium leading-[1.05] tracking-[-0.01em]",
  h1:      "font-heading text-[2.5rem] font-medium leading-[1.1] tracking-[-0.01em]",
  h2:      "font-heading text-[1.75rem] font-medium leading-[1.15] tracking-[-0.01em]",
  h3:      "font-heading text-xl font-medium leading-[1.35]",
  h4:      "font-heading text-[0.9375rem] font-medium leading-[1.35]",  // 15px per DS scale

  // UI (Archivo) — DS scale 15/12 + 17 article, body leading 1.5.
  lead:    "text-[1.0625rem] leading-[1.5] text-neutral-600",  // 17px, article body
  body:    "text-[0.9375rem] leading-[1.5] text-ink",           // 15px, DS body
  small:   "text-[0.75rem] leading-[1.5] text-neutral-600",     // 12px, caption
  muted:   "text-[0.75rem] leading-[1.5] text-neutral-500",     // 12px, meta
  label:   "text-[0.9375rem] font-medium text-neutral-700",     // 15px, form labels

  // Eyebrow / kicker — use the CSS class `.eyebrow` in globals.css.
  // Token kept here for legacy inline callers.
  // Tracking is +5% (0.05em) per DS Foundations Typography table for
  // Archivo small caps / eyebrows; underlying `.eyebrow` class matches.
  overline:"text-xs font-medium tracking-[0.05em] text-neutral-500",
};
