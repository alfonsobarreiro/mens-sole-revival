import { forwardRef } from "react";
import { cn } from "./cn";

export type CardVariant = "surface" | "elevated" | "outline" | "callout";

const variants: Record<CardVariant, string> = {
  surface:  "bg-neutral-100 border border-border-subtle",
  elevated: "bg-bg-elevated border border-border-subtle shadow-sm",
  outline:  "bg-transparent border border-ink",
  callout:  "bg-accent-100 border border-accent-200",
};

type CardProps = {
  variant?: CardVariant;
  as?: "div" | "article" | "section" | "aside";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">;

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant = "surface", as: Tag = "div", className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={cn("relative", variants[variant], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-border-subtle", className)}>
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-6 py-6", className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 pt-4 pb-6 border-t border-border-subtle flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  as: Tag = "h3",
  className,
  children,
}: {
  as?: "h2" | "h3" | "h4";
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn("font-heading", className)}>{children}</Tag>;
}

export function CardEyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("eyebrow mb-2", className)}>{children}</p>;
}

export default Card;
