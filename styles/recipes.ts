import { tokens } from "./tokens";

type CalloutVariant = "info" | "warn" | "steps";

export const recipes = {
  /**
   * Article surface baseline
   * Applied once in ArticleLayout
   * Controls rhythm + default typography behavior
   */
  articleSurface: [
    "space-y-6",
    tokens.color.body,

    // headings
    "[&_h1]:mt-12 [&_h1]:mb-4",
    "[&_h2]:mt-10 [&_h2]:mb-3",
    "[&_h3]:mt-8 [&_h3]:mb-2",

    // paragraphs + lists
    "[&_p]:leading-7",
    "[&_ul]:my-4 [&_ol]:my-4",
    "[&_li]:my-2",

    // block elements
    "[&_hr]:my-10",

    // blockquote (if you use it later)
    "[&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic",

    // tables
    "[&_table]:my-8",
  ].join(" "),

  /**
   * Links (shared UI + MDX)
   */
  link: [
    "font-medium",
    tokens.color.fg,
    "underline underline-offset-4 decoration-neutral-300",
    "hover:decoration-brand-700 hover:opacity-90",
  ].join(" "),

  /**
   * Caption / small text (generic)
   */
  caption: [tokens.text.small, tokens.color.muted].join(" "),

  /**
   * Horizontal rule
   */
  hr: "my-10 border-t border-neutral-200",

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

  callout: (variant: CalloutVariant) => {
    const base = [
      "not-prose",
      "my-8",
      "rounded-xl",
      "border",
      "p-5",
      "shadow-sm",
      "ring-1",
      "ring-inset",
    ].join(" ");

    const variants: Record<CalloutVariant, string> = {
      info: [
        tokens.color.surfaceInfo,
        "border-blue-200",
        tokens.color.ringInfo,
      ].join(" "),
      warn: [
        tokens.color.surfaceWarn,
        "border-amber-200",
        tokens.color.ringWarn,
      ].join(" "),
      steps: [
        tokens.color.surface,
        tokens.color.border,
        "ring-neutral-200",
      ].join(" "),
    };

    return [base, tokens.color.fg, variants[variant]].join(" ");
  },

  calloutHeader: "flex items-start justify-between gap-4",
  calloutTitle: ["font-semibold", tokens.color.fg].join(" "),
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
    base: [
      "not-prose",
      "rounded-xl",
      "border",
      tokens.color.border,
      tokens.color.surface,
      "p-5",
    ].join(" "),

    title: ["text-sm font-semibold", tokens.color.fg].join(" "),
    body: ["mt-2 text-sm leading-6", tokens.color.body].join(" "),
    meta: ["mt-3 text-xs", tokens.color.muted].join(" "),
  },
} as const;
