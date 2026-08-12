import { forwardRef } from "react";
import { cn } from "./cn";

// ─────────────────────────────────────────────────────────────
// IconButton — square button for icon-only actions.
// Extracted 2026-08-11 after the DS audit flagged three hand-rolled
// icon buttons (hamburger, mobile-sheet close, and lurking others)
// as pattern drift. Every icon-only button on the site should go
// through this primitive so hover/focus/tap-target come from one
// source, not per-caller inline classes.
//
// Variants mirror Button (primary/secondary/ghost). Sizes hit
// 8-multiples: sm=32, md=40, lg=48 — all WCAG-adjacent tap targets.
// Radius stays 0 per the DS.
// ─────────────────────────────────────────────────────────────

export type IconButtonVariant = "primary" | "secondary" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg-page " +
  "disabled:pointer-events-none disabled:opacity-40 select-none";

const variants: Record<IconButtonVariant, string> = {
  primary:
    "bg-cta-fill text-cta-text hover:bg-cta-fill-hover active:bg-accent-800",
  secondary:
    "border border-ink text-ink bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
  ghost:
    "text-ink bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
};

const sizes: Record<IconButtonSize, string> = {
  sm: "h-8  w-8",   // 32×32 — smallest allowed, still 8-mult
  md: "h-10 w-10",  // 40×40 — default, WCAG-adjacent
  lg: "h-12 w-12",  // 48×48 — spacious, matches Button lg
};

export type IconButtonProps = {
  /** Required — screen-reader label. Icon-only buttons must announce their purpose. */
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "className" | "children">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { variant = "ghost", size = "md", className, children, type, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default IconButton;
