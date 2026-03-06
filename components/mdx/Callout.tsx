// components/mdx/Callout.tsx
import React from "react";
import { recipes } from "@/styles/recipes";
import { tokens } from "@/styles/tokens";

type CalloutVariant = "info" | "warn" | "steps";

type CalloutProps = {
  variant?: CalloutVariant;
  title?: string;
  steps?: string[];
  children?: React.ReactNode;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function defaultTitle(variant: CalloutVariant) {
  if (variant === "warn") return "Warning";
  if (variant === "steps") return "Steps";
  return "Note";
}

export default function Callout({
  variant = "info",
  title,
  steps,
  children,
  className,
}: CalloutProps) {
  return (
    <aside className={cx(recipes.callout(variant), className)} role="note">
      <div className={recipes.calloutHeader}>
        <div className={recipes.calloutTitle}>
          {title ?? defaultTitle(variant)}
        </div>
      </div>

      {(children || (steps && steps.length > 0)) && (
        <div className={recipes.calloutBody}>
          {children}

          {steps && steps.length > 0 && (
            <ol className={recipes.calloutList}>
              {steps.map((step, i) => (
                <li key={i} className={recipes.calloutListItem}>
                  <span className={recipes.calloutListIndex}>{i + 1}</span>
                  <span className={tokens.color.body}>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </aside>
  );
}
