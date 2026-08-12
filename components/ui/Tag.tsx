import { cn } from "./cn";

export type TagVariant = "default" | "accent" | "accent-kicker" | "outline" | "muted";

const variants: Record<TagVariant, string> = {
  default:        "bg-neutral-100 text-ink border border-border-subtle",
  accent:         "bg-accent-100 text-accent-800 border border-accent-200",
  // Terracotta kicker exception (per Foundations Color, 2026-08-11):
  // neutral-100 fill + accent-700 label is the ONLY non-link use of accent-700.
  // Used for article/category kickers that need brand-tinted small text.
  "accent-kicker": "bg-neutral-100 text-accent-700 border border-transparent",
  outline:        "bg-transparent text-ink border border-ink",
  muted:          "bg-neutral-200 text-neutral-700 border border-transparent",
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
