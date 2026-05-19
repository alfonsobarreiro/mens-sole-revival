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
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open search"
          className="group flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700"
        >
          <SearchIcon className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Search</span>
          <kbd className="ml-1 hidden rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[10px] font-medium text-neutral-500 lg:inline">
            {isMac ? "⌘K" : "Ctrl K"}
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open search"
          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition hover:bg-neutral-100"
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
