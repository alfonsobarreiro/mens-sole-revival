"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SEARCH_GROUP_ORDER,
  searchItems,
  type SearchItem,
  type SearchGroup,
} from "@/lib/search-index";

/**
 * SearchPalette — global ⌘K command palette.
 *
 * Renders nothing when closed. When open: full-bleed backdrop + centered
 * modal with input and grouped results. Keyboard:
 *   ⌘K / Ctrl+K · open  (handled by parent SearchTrigger)
 *   ↑ ↓         · move selection
 *   Enter       · navigate to selected result
 *   Esc / click outside · close
 *
 * Static index, no network call. Matches Cate's Principle #2: every
 * non-happy state is rendered — empty (no query), no-results, and
 * selected/hover/focus are all visually distinct.
 */

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchPalette({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const results = useMemo(() => searchItems(query), [query]);

  // Group results in display order for sectioned rendering.
  const grouped = useMemo(() => {
    const byGroup = new Map<SearchGroup, SearchItem[]>();
    for (const item of results) {
      const arr = byGroup.get(item.group) ?? [];
      arr.push(item);
      byGroup.set(item.group, arr);
    }
    return SEARCH_GROUP_ORDER
      .map((g) => ({ group: g, items: byGroup.get(g) ?? [] }))
      .filter((s) => s.items.length > 0);
  }, [results]);

  // Flat order of items as the user sees them — what arrow keys traverse.
  const flatResults = useMemo(
    () => grouped.flatMap((s) => s.items),
    [grouped]
  );

  // Reset state when opening, focus the input, lock body scroll.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIdx(0);
    // Focus after the modal mounts.
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset selection whenever the result set changes.
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Keep the active row scrolled into view as the user arrows.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${activeIdx}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const go = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      close();
    },
    [router, close]
  );

  // Keyboard handlers while the palette is open.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(flatResults.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = flatResults[activeIdx];
      if (item) go(item);
    }
  };

  if (!open || typeof document === "undefined") return null;

  // Portal to document.body so the fixed-position modal escapes the
  // sticky header's containing block (backdrop-blur creates one in Chrome).
  return createPortal(
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-screen w-screen items-start justify-center px-4 pt-[12vh] pb-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative w-full max-w-[640px] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-neutral-200">

        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4">
          <SearchIcon className="h-4 w-4 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, reviews, routines, assessment…"
            className="flex-1 bg-transparent py-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            aria-label="Search the site"
            aria-controls="search-results"
            aria-activedescendant={
              flatResults[activeIdx]
                ? `search-result-${flatResults[activeIdx].id}`
                : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-500 sm:inline-block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">

          {/* Empty state: no query yet */}
          {query.trim().length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-neutral-500">
                Search guides, product reviews, routines, and assessment sections.
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                Try <code className="font-mono text-neutral-500">pain</code>,
                {" "}
                <code className="font-mono text-neutral-500">nails</code>, or
                {" "}
                <code className="font-mono text-neutral-500">insoles</code>.
              </p>
            </div>
          )}

          {/* No results */}
          {query.trim().length > 0 && flatResults.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-neutral-700">
                Nothing found for{" "}
                <span className="font-medium text-neutral-900">
                  &ldquo;{query.trim()}&rdquo;
                </span>
                .
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                Try a symptom like <em>pain</em> or <em>nails</em>, or a product
                category like <em>insoles</em>.
              </p>
            </div>
          )}

          {/* Grouped results */}
          {flatResults.length > 0 && (
            <ul ref={listRef} id="search-results" role="listbox" className="py-2">
              {grouped.map((section) => (
                <li key={section.group}>
                  <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    {section.group}
                  </div>
                  <ul>
                    {section.items.map((item) => {
                      const idx = flatResults.indexOf(item);
                      const isActive = idx === activeIdx;
                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            id={`search-result-${item.id}`}
                            data-idx={idx}
                            role="option"
                            aria-selected={isActive}
                            onMouseEnter={() => setActiveIdx(idx)}
                            onClick={(e) => {
                              e.preventDefault();
                              go(item);
                            }}
                            className={`flex items-center justify-between gap-3 px-4 py-2.5 transition ${
                              isActive
                                ? "bg-brand-50 text-brand-700"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {item.title}
                              </div>
                              <div className={`truncate text-xs ${isActive ? "text-brand-600" : "text-neutral-500"}`}>
                                {item.subtitle}
                              </div>
                            </div>
                            <ArrowIcon className={`h-3.5 w-3.5 flex-none ${isActive ? "text-brand-500" : "text-neutral-300"}`} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-[11px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span className="ml-1">to open</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Kbd>Esc</Kbd>
            <span className="ml-1">to close</span>
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-600">
      {children}
    </kbd>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
