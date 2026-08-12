/**
 * Design Tokens — Men's Sole Revival
 *
 * Tailwind utility class shortcuts that map to the CSS custom properties
 * defined in globals.css. This mirrors the Figma variable system:
 * Primitives (globals.css @theme) → Semantic tokens (below) → Components
 *
 * Usage: import { tokens } from "@/styles/tokens"
 *        <h1 className={tokens.text.h1}>...</h1>
 *
 * Refactored 2026-08-13 to route every entry through DS tokens instead of
 * the legacy Cabana brand-* ramp. Article surfaces (which import this file
 * via mdx-components + recipes) now conform to the MSR DS.
 */
export const tokens = {

  // Typography
  font: {
    heading: "font-heading",
    body:    "font-body",
  },

  // Type scale — DS-locked 60/40/28/20/15/12 + 17 article body.
  // All headings at Medium 500 mixed case. Leading tokens per DS.
  text: {
    display:     "font-heading text-[3.75rem] font-medium leading-[1.05] tracking-[-0.01em]",
    h1:          "font-heading text-[2.5rem] font-medium leading-[1.1] tracking-[-0.01em]",
    h2:          "font-heading text-[1.75rem] font-medium leading-[1.15] tracking-[-0.01em]",
    h3:          "font-heading text-xl font-medium leading-[1.35]",
    h4:          "font-heading text-[0.9375rem] font-medium leading-[1.35]",
    lead:        "font-body text-[1.0625rem] leading-[1.5] text-neutral-600",
    body:        "font-body text-[0.9375rem] leading-[1.5] text-ink",
    small:       "font-body text-[0.75rem] leading-[1.5] text-neutral-600",
    caption:     "font-body text-[0.75rem] leading-[1.5] text-neutral-500",
    captionMeta: "font-body text-[0.75rem] leading-[1.5] text-neutral-500",
    label:       "font-body text-[0.9375rem] font-medium text-neutral-700",
  },

  // Layout
  // pageY promoted from py-12 to DS standard section rhythm (py-16 md:py-24).
  // article prose column narrowed from max-w-3xl to max-w-2xl per DS.
  layout: {
    pageX:         "px-6",
    pageY:         "py-16 md:py-24",
    sectionY:      "py-16 md:py-24",
    container:     "mx-auto w-full max-w-6xl px-6",
    article:       "mx-auto w-full max-w-2xl px-6",
    figure:        "w-full my-8",
    // Radius zeroed per DS (no rounded-*); border-subtle uses the semantic alias.
    figureMedia:   "w-full overflow-hidden border border-border-subtle",
    figureCaption: "mt-2",
    figureMeta:    "mt-1",
  },

  // Colors — DS-routed. brand-* legacy ramp fully retired from this file.
  color: {
    bg:            "bg-bg-page",
    fg:            "text-ink",
    body:          "text-ink",
    muted:         "text-neutral-600",
    border:        "border-border-subtle",
    surface:       "bg-neutral-100",
    surfaceSubtle: "bg-neutral-100",
    // MDX body links = terracotta per DS text-link (accent-700).
    link:          "text-link hover:text-link-hover",
    surfaceInfo:   "bg-neutral-100",
    // accent-100 is the DS "subtle-emphasis" fill; used for warn callouts.
    surfaceWarn:   "bg-accent-100",
    ringInfo:      "ring-border-subtle",
    ringWarn:      "ring-accent-200",
    primary:       "bg-cta-fill text-cta-text",
    primaryHover:  "hover:bg-cta-fill-hover",
    // Accent is CTA fill per DS (accent-500 is identity-only, not for fills).
    accent:        "bg-cta-fill text-cta-text",
  },

  // Radius — only `full` for legitimate pills. DS = 0 everywhere else.
  radius: {
    full: "rounded-full",
  },

  border: {
    hairline: "border border-border-subtle",
    strong:   "border border-neutral-300",
    primary:  "border border-ink",
    accent:   "border border-accent-500",
  },

  // Button base classes — rounded-* removed (DS radius = 0).
  // Solid/outline/ghost now route through DS CTA + neutral tokens.
  button: {
    base:    "inline-flex items-center justify-center font-body font-medium transition-colors focus-visible:outline-none",
    sm:      "h-8  px-4  text-sm",
    md:      "h-10 px-4  text-sm",
    lg:      "h-11 px-5  text-base",
    xl:      "h-12 px-6  text-base",
    solid:   "bg-cta-fill text-cta-text hover:bg-cta-fill-hover active:bg-accent-800",
    outline: "border border-ink text-ink hover:bg-neutral-100 active:bg-neutral-200",
    ghost:   "bg-neutral-100 border border-neutral-300 text-ink hover:bg-neutral-200 active:bg-neutral-300",
    text:    "text-link hover:text-link-hover underline-offset-4 hover:underline",
  },

} as const;
