"use client";

import { useAsk } from "./AskHost";
import { askCopy } from "./copy";

/**
 * The nav's "Ask" entry, beside Search. Rendered twice by SiteLayout (mobile
 * row and desktop row); both open the one drawer owned by AskProvider, which
 * also decides whether the entry shows at all.
 */
export default function AskTrigger({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { enabled, open, openPanel } = useAsk();
  if (!enabled) return null;

  return variant === "desktop" ? (
    <button
      type="button"
      onClick={(e) => openPanel(e.currentTarget)}
      aria-label={askCopy.panel.triggerLabel}
      aria-haspopup="dialog"
      aria-expanded={open}
      className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-ink"
    >
      <ChatIcon className="h-4 w-4" />
      <span>{askCopy.panel.trigger}</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => openPanel(e.currentTarget)}
      aria-label={askCopy.panel.triggerLabel}
      aria-haspopup="dialog"
      aria-expanded={open}
      className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink transition hover:text-accent-700"
    >
      <ChatIcon className="h-5 w-5" />
    </button>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6.5A8 8 0 0 1 13 4h0a8 8 0 0 1 8 8z" />
    </svg>
  );
}
