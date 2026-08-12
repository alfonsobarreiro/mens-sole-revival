import { forwardRef } from "react";
import { cn } from "./cn";

// ─────────────────────────────────────────────────────────────
// Chip — toggle-style filter/selection control.
//
// Fills the gap Button couldn't: Button primary uses accent-600
// (CTA-fill role); Chip active state uses bg-ink to signal navigation
// selection (matching desktop nav's active state). Different semantic
// from a Button CTA, so it lives in its own primitive.
//
// Sharp corners per DS radius=0 rule. Mixed case + Medium 500 +
// tracking-[0.01em] matches the .eyebrow/tag typographic register.
// `count` optionally renders a soft number after the label.
// ─────────────────────────────────────────────────────────────

export type ChipProps = {
  active?: boolean;
  count?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { active = false, count, className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center px-4 py-2 text-xs font-medium tracking-[0.01em] transition",
        active
          ? "bg-ink text-inverse"
          : "border border-neutral-300 bg-bg-elevated text-neutral-600 hover:border-ink hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
      {count != null && (
        <span className="ml-2 font-normal opacity-60">{count}</span>
      )}
    </button>
  );
});

export default Chip;
