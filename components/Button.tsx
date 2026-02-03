type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : "border border-zinc-300 text-zinc-900 hover:bg-zinc-50";

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}
