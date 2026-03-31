import Link from "next/link";

type Variant = "solid" | "outline" | "ghost" | "text";
type Size    = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid:   "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700",
  outline: "border border-brand-500 text-brand-500 bg-transparent hover:bg-brand-50 active:bg-brand-100",
  ghost:   "border border-brand-300 text-brand-500 bg-brand-50 hover:bg-brand-100 active:bg-brand-200",
  text:    "text-brand-500 hover:text-brand-600 underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "h-8  px-4  text-sm  rounded gap-1.5",
  md: "h-10 px-5  text-sm  rounded gap-2",
  lg: "h-12 px-6  text-base rounded gap-2",
};

export default function Button({
  href,
  onClick,
  children,
  variant = "solid",
  size = "md",
  className = "",
  type = "button",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
