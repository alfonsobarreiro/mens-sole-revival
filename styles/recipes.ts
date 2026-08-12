import { tokens } from "./tokens";

type CalloutVariant = "info" | "warn" | "steps";

export const recipes = {
  /**
   * Article surface baseline
   * Applied once in ArticleLayout
   * Controls rhythm + default typography behavior
   */
  // Activates the DS `.article-body` scope (17px/1.6, small-caps opener,
  // oldstyle numerals, Lora italic blockquote). Paragraph/heading spacing
  // snapped to DS 8-multiples. Blockquote styling deferred to .article-body.
  articleSurface: [
    "article-body",
    "space-y-6",
    tokens.color.body,

    // headings — all margins on DS 8-multiple scale
    "[&_h1]:mt-12 [&_h1]:mb-4",
    "[&_h2]:mt-12 [&_h2]:mb-4",
    "[&_h3]:mt-8 [&_h3]:mb-2",

    // lists
    "[&_ul]:my-4 [&_ol]:my-4",
    "[&_li]:my-2",

    // hr — DS 8-multiple
    "[&_hr]:my-12",

    // tables
    "[&_table]:my-8",
  ].join(" "),

  /**
   * Links (shared UI + MDX) — DS text-link tokens
   */
  link: [
    "font-medium",
    "text-link",
    "underline underline-offset-4 decoration-neutral-300",
    "hover:text-link-hover hover:decoration-link-hover",
  ].join(" "),

  /**
   * Caption / small text (generic)
   */
  caption: [tokens.text.small, tokens.color.muted].join(" "),

  /**
   * Horizontal rule — DS 8-multiple, border-subtle token
   */
  hr: "my-12 border-t border-border-subtle",

  /**
   * ======================
   * FIGURE (MDX / Articles)
   * ======================
   *
   * Standard image + caption treatment.
   * No inline MDX styling — MDX maps <Img/> or <Figure/> to your primitive.
   */
  figure: {
    base: [tokens.layout.figure].join(" "),
    media: [tokens.layout.figureMedia].join(" "),
    caption: [
      tokens.layout.figureCaption,
      tokens.text.caption,
      tokens.color.muted,
    ].join(" "),
    meta: [
      tokens.layout.figureMeta,
      tokens.text.captionMeta,
      tokens.color.muted,
    ].join(" "),

    variants: {
      align: {
        left: "",
        center: "mx-auto",
      },
      width: {
        full: "w-full",
        // Use a real token later if you want; right now this is a safe, scoped choice
        content: "max-w-2xl",
      },
      intent: {
        // default is “framed” by media token; you can add additional intents later
        default: "",
      },
    },

    defaultVariants: {
      align: "left",
      width: "full",
      intent: "default",
    },
  },

  /**
   * ======================
   * CALLOUTS
   * ======================
   */

  // Radius zeroed per DS. Padding snapped to p-6. shadow-sm + ring dropped —
  // one-hue DS uses colour, not elevation, for callout weight.
  callout: (variant: CalloutVariant) => {
    const base = [
      "not-prose",
      "my-8",
      "border",
      "p-6",
    ].join(" ");

    const variants: Record<CalloutVariant, string> = {
      // Info tier lives in the neutral ramp (no blue in DS).
      info: [
        tokens.color.surfaceInfo,
        "border-border-subtle",
      ].join(" "),
      // Warn tier lives on the terracotta ramp (no amber in DS).
      warn: [
        tokens.color.surfaceWarn,
        "border-accent-200",
      ].join(" "),
      steps: [
        tokens.color.surface,
        tokens.color.border,
      ].join(" "),
    };

    return [base, tokens.color.fg, variants[variant]].join(" ");
  },

  calloutHeader: "flex items-start justify-between gap-4",
  // Medium 500 per DS heading weight lock.
  calloutTitle: ["font-medium", tokens.color.fg].join(" "),
  calloutBody: ["mt-2", tokens.color.body].join(" "),

  calloutList: "mt-3 space-y-2",
  calloutListItem: "leading-relaxed",
  calloutListIndex: [
    "inline-flex",
    "h-6 w-6",
    "items-center justify-center",
    "rounded-full",
    "border",
    "text-xs",
    "font-medium",
    "mr-2",
    "align-middle",
    tokens.color.fg,
  ].join(" "),

  /**
   * ======================
   * INLINE CARD (MDX)
   * ======================
   */

  inlineCard: {
    // Radius zeroed, padding p-6 (DS 8-multiple).
    base: [
      "not-prose",
      "border",
      tokens.color.border,
      tokens.color.surface,
      "p-6",
    ].join(" "),

    // Title Medium 500 at 15px per DS heading/label weight + scale.
    title: ["text-[0.9375rem] font-medium", tokens.color.fg].join(" "),
    body: ["mt-2 text-[0.9375rem] leading-[1.5]", tokens.color.body].join(" "),
    meta: ["mt-3 text-[0.75rem] leading-[1.5]", tokens.color.muted].join(" "),
  },
} as const;
