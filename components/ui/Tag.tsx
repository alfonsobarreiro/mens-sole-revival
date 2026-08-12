import { cn } from "./cn";

export type TagVariant = "default" | "accent" | "outline" | "muted";

const variants: Record<TagVariant, string> = {
  default: "bg-neutral-100 text-ink border border-border-subtle",
  accent:  "bg-accent-100 text-accent-800 border border-accent-200",
  outline: "bg-transparent text-ink border border-ink",
  muted:   "bg-transparent text-text-muted border border-border-subtle",
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
