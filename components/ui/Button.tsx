import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[0.01em] " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg-page " +
  "disabled:pointer-events-none disabled:opacity-40 select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cta-fill text-cta-text hover:bg-cta-fill-hover active:bg-accent-800",
  secondary:
    "border border-ink text-ink bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
  ghost:
    "text-ink bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
  link:
    "text-link underline underline-offset-4 hover:text-link-hover tracking-normal p-0 h-auto",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9  px-4 text-[0.75rem]",
  md: "h-11 px-6 text-[0.8125rem]",
  lg: "h-14 px-8 text-[0.9375rem]",
};

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href">;

type ButtonElProps = BaseProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

export type ButtonProps = AnchorProps | ButtonElProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = "primary", size = "md", fullWidth, className, children } = props;
    const classes = cn(
      base,
      variants[variant],
      variant !== "link" && sizes[size],
      fullWidth && "w-full",
      className,
    );

    if ("href" in props && props.href) {
      const { href, variant: _v, size: _s, fullWidth: _fw, className: _c, children: _ch, ...rest } = props;
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    const { variant: _v, size: _s, fullWidth: _fw, className: _c, children: _ch, ...rest } = props as ButtonElProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={rest.type ?? "button"}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default Button;
