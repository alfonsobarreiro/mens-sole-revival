import { cn } from "./cn";

/**
 * "New" badge — small accent-tone pill that appears next to a card title
 * for a fixed window after publish. Renders null once the content is past
 * the window, so callers can drop it on every card without conditional
 * logic at the call site.
 *
 * Data source: `date` is the publish date (ISO or YYYY-MM-DD). Callers
 * pull it from guideSeo[slug].datePublished, routineSeo[slug].datePublished,
 * or a review's publishedAt.
 *
 * Window: 30 days by default (Alfonso's rule as of 2026-09-10). Adjustable
 * via `windowDays` prop if a specific surface wants a shorter/longer window.
 */
export function NewBadge({
  date,
  windowDays = 30,
  className,
}: {
  date: string | undefined;
  windowDays?: number;
  className?: string;
}) {
  if (!date) return null;
  const published = new Date(date);
  if (Number.isNaN(published.getTime())) return null;

  const ageMs = Date.now() - published.getTime();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  if (ageMs > windowMs || ageMs < 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
        "bg-accent-100 text-accent-800 border border-accent-200",
        className,
      )}
      aria-label={`New — published ${published.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
    >
      New
    </span>
  );
}

export default NewBadge;
