/**
 * Design Tokens — Men's Sole Revival
 *
 * Tailwind utility class shortcuts that map to the CSS custom properties
 * defined in globals.css. This mirrors the Figma variable system:
 * Primitives (globals.css @theme) → Semantic tokens (below) → Components
 *
 * Usage: import { tokens } from "@/styles/tokens"
 *        <h1 className={tokens.text.h1}>...</h1>
 */
export const tokens = {

  // Typography
  font: {
    heading: "font-heading",
    body:    "font-body",
  },

  text: {
    display:     "font-heading text-5xl md:text-6xl font-semibold leading-tight tracking-tight",
    h1:          "font-heading text-4xl md:text-5xl font-semibold leading-tight tracking-tight",
    h2:          "font-heading text-3xl font-semibold leading-tight tracking-tight",
    h3:          "font-heading text-2xl font-semibold leading-snug",
    h4:          "font-heading text-xl font-semibold leading-snug",
    lead:        "font-body text-lg leading-relaxed text-neutral-700",
    body:        "font-body text-base leading-7 text-neutral-700",
    small:       "font-body text-sm leading-6 text-neutral-600",
    caption:     "font-body text-sm leading-6 text-neutral-500",
    captionMeta: "font-body text-xs leading-5 text-neutral-400",
    label:       "font-body text-sm font-medium text-neutral-700",
  },

  // Layout
  layout: {
    pageX:     "px-6",
    pageY:     "py-12",
    sectionY:  "py-16",
    container: "mx-auto w-full max-w-6xl px-6",
    article:   "mx-auto w-full max-w-3xl px-6",
    figure:         "w-full my-8",
    figureMedia:    "w-full overflow-hidden rounded-lg border border-neutral-200",
    figureCaption:  "mt-2",
    figureMeta:     "mt-1",
  },

  // Colors — now wired to design tokens (not zinc placeholders)
  color: {
    bg:           "bg-white",
    fg:           "text-brand-900",
    body:         "text-neutral-700",
    muted:        "text-neutral-500",
    border:       "border-neutral-200",
    surface:      "bg-neutral-50",
    surfaceSubtle:"bg-brand-50",
    link:         "text-brand-500 hover:text-brand-700",
    surfaceInfo:  "bg-brand-50",
    surfaceWarn:  "bg-accent-50",
    ringInfo:     "ring-brand-200",
    ringWarn:     "ring-accent-200",
    primary:      "bg-brand-500 text-white",
    primaryHover: "hover:bg-brand-600",
    accent:       "bg-accent-500 text-white",
  },

  // Radius
  radius: {
    xs:   "rounded-xs",
    sm:   "rounded-sm",
    md:   "rounded-md",
    lg:   "rounded-lg",
    xl:   "rounded-xl",
    "2xl":"rounded-2xl",
    full: "rounded-full",
  },

  border: {
    hairline: "border border-neutral-200",
    strong:   "border border-neutral-300",
    primary:  "border border-brand-500",
    accent:   "border border-accent-500",
  },

  // Button base classes (pair with color variants above)
  button: {
    base:   "inline-flex items-center justify-center font-body font-medium transition-colors focus-visible:outline-none",
    sm:     "h-8  px-4  text-sm  rounded-sm",
    md:     "h-10 px-4  text-sm  rounded-sm",
    lg:     "h-11 px-5  text-base rounded-sm",
    xl:     "h-12 px-6  text-base rounded-sm",
    solid:  "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700",
    outline:"border border-brand-500 text-brand-500 hover:bg-brand-50 active:bg-brand-100",
    ghost:  "bg-brand-50 border border-brand-300 text-brand-500 hover:bg-brand-100 active:bg-brand-200",
    text:   "text-brand-500 hover:text-brand-600 underline-offset-4 hover:underline active:text-brand-700",
  },

} as const;
