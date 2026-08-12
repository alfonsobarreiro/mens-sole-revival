import { cn } from "./cn";

export type TagVariant =
  | "default"
  | "accent"
  | "accent-kicker"
  | "outline"
  | "muted"
  | "on-photo"
  | "verdict-recommended"
  | "verdict-conditional"
  | "verdict-skip";

const variants: Record<TagVariant, string> = {
  default:        "bg-neutral-100 text-ink border border-border-subtle",
  accent:         "bg-accent-100 text-accent-800 border border-accent-200",
  // Terracotta kicker exception (per Foundations Color, 2026-08-11):
  // neutral-100 fill + accent-700 label is the ONLY non-link use of accent-700.
  // Used for article/category kickers that need brand-tinted small text.
  "accent-kicker": "bg-neutral-100 text-accent-700 border border-transparent",
  outline:        "bg-transparent text-ink border border-ink",
  muted:          "bg-neutral-200 text-neutral-700 border border-transparent",
  // Article hero meta on photography — translucent white on ink scrim.
  // Category = pill, read time = plain caption after (DS Foundations Imagery).
  "on-photo":     "bg-white/15 text-inverse border border-white/25 backdrop-blur-sm",
  // Review verdicts — weight-based hierarchy (DS has no success/warn/danger
  // tokens; using terracotta/neutral/ink instead of raw green/amber/red keeps
  // us on the sanctioned Foundations Color palette).
  //   recommended → solid ink (strongest positive weight)
  //   conditional → outline neutral (medium weight, "check this")
  //   skip        → accent-callout (accent-100 fill; semantic warning without red)
  "verdict-recommended": "bg-ink text-inverse border border-ink",
  "verdict-conditional": "bg-transparent text-ink border border-ink",
  "verdict-skip":        "bg-accent-100 text-accent-800 border border-accent-200",
};

export type TagProps = {
  variant?: TagVariant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children">;

export function Tag({ variant = "default", className, children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.75rem] font-medium tracking-[0.01em]",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Tag;
