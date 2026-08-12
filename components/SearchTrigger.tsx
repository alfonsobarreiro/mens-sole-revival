"use client";

import { useEffect, useState } from "react";
import SearchPalette from "@/components/SearchPalette";

/**
 * SearchTrigger — nav-mounted entry point for the global ⌘K palette.
 *
 * Two variants:
 *   • desktop: pill with magnifier icon, "Search" label, and ⌘K hint
 *   • mobile:  icon-only square button
 *
 * Listens for ⌘K / Ctrl+K globally and `/` (slash) when no input is focused.
 * Mounts SearchPalette as a sibling so the modal can sit above the sticky
 * header without z-index gymnastics.
 */
export default function SearchTrigger({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K from anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      // `/` shortcut when no input is focused (GitHub pattern)
      if (e.key === "/" && !open) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        const editable =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          target?.isContentEditable;
        if (!editable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {variant === "desktop" ? (
        // Plain nav-item treatment — icon + "Search", no italic, no border box,
        // no keyboard-hint pill. Matches the neighbouring nav links.
        // Keyboard shortcut still works, it just doesn't advertise itself.
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search the site"
          title={isMac ? "Search  (⌘K)" : "Search  (Ctrl K)"}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-ink"
        >
          <SearchIcon className="h-4 w-4" />
          <span>Search</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search the site"
          className="flex h-10 w-10 items-center justify-center text-ink transition hover:text-accent-700"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      )}

      <SearchPalette open={open} onClose={() => setOpen(false)} />
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
