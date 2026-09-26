"use client";

import { useEffect, useState } from "react";
import { useSearch } from "@/components/SearchHost";

/**
 * SearchTrigger — nav-mounted entry point for the global ⌘K palette.
 *
 * Two variants:
 *   • desktop: pill with magnifier icon, "Search" label, and ⌘K hint
 *   • mobile:  icon-only square button
 *
 * Both variants open the one palette owned by SearchProvider, which also
 * handles ⌘K / Ctrl+K and `/` (slash) when no input is focused.
 */
export default function SearchTrigger({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { open, openSearch } = useSearch();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  return (
    <>
      {variant === "desktop" ? (
        // Plain nav-item treatment — icon + "Search", no italic, no border box,
        // no keyboard-hint pill. Matches the neighbouring nav links.
        // Keyboard shortcut still works, it just doesn't advertise itself.
        <button
          type="button"
          onClick={(e) => openSearch(e.currentTarget)}
          aria-label="Search the site"
          aria-haspopup="dialog"
          aria-expanded={open}
          title={isMac ? "Search  (⌘K)" : "Search  (Ctrl K)"}
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-ink"
        >
          <SearchIcon className="h-4 w-4" />
          <span>Search</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => openSearch(e.currentTarget)}
          aria-label="Search the site"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink transition hover:text-accent-700"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
