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
 * SearchPalette — global search modal.
 *
 * Empty state shows a curated "Start with" list instead of mono-font
 * code samples. No keyboard-hint strip at the bottom, no ⌘K/Esc badges
 * in the chrome — the shortcuts still work, they just don't advertise
 * themselves. Sharp corners, ink accents, DS-conformant.
 *
 * Keyboard (still active):
 *   ⌘K / Ctrl+K · open  (handled by SearchTrigger)
 *   ↑ ↓         · move selection
 *   Enter       · navigate
 *   Esc / click outside · close
 */

type Props = {
  open: boolean;
  onClose: () => void;
};

// Curated starting points shown when the palette opens with no query.
// The highest-intent entry points on the site.
const START_HERE: SearchItem[] = [
  { id: "assessment", group: "Assessment", title: "Take the assessment",                              subtitle: "Five sections, 30 questions, under five minutes.", href: "/assessment" },
  { id: "why-hurt",   group: "Guides",     title: "Why your feet hurt after 40",                       subtitle: "The four things that change, and what to do about each.", href: "/guides/why-your-feet-hurt-after-40" },
  { id: "dress",      group: "Guides",     title: "What 30 years in dress shoes does to your feet",   subtitle: "The narrow-toe-box compounding problem.",          href: "/guides/what-your-dress-shoes-are-doing-to-your-feet" },
  { id: "toe",        group: "Guides",     title: "Your big toe controls more than you think",        subtitle: "40 to 60% of your push-off force lives here.",     href: "/guides/big-toe-and-your-whole-body" },
  { id: "routines",   group: "Routines",   title: "The five-minute nightly routine",                  subtitle: "The habit that heads off most common problems.",   href: "/guides/5-minute-routine" },
];

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

  const flatResults = useMemo(
    () => grouped.flatMap((s) => s.items),
    [grouped]
  );

  // What arrow keys actually traverse — either curated start-here (empty
  // query) or grouped search results.
  const navList = query.trim().length === 0 ? START_HERE : flatResults;

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIdx(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(navList.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = navList[activeIdx];
      if (item) go(item);
    }
  };

  if (!open || typeof document === "undefined") return null;

  const renderRow = (item: SearchItem, idx: number) => {
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
          onClick={(e) => { e.preventDefault(); go(item); }}
          className={`block px-6 py-3 transition-colors ${
            isActive
              ? "bg-neutral-100 text-ink"
              : "text-ink hover:bg-neutral-100"
          }`}
        >
          <div className="text-sm font-medium leading-tight">{item.title}</div>
          <div className="mt-1 text-sm leading-6 text-neutral-600">
            {item.subtitle}
          </div>
        </Link>
      </li>
    );
  };

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
        className="absolute inset-0 bg-ink/60"
      />

      {/* Panel — sharp corners, ink border, no ring */}
      <div className="relative w-full max-w-[640px] overflow-hidden border border-border-subtle bg-bg-elevated shadow-lg">

        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border-subtle px-6">
          <SearchIcon className="h-4 w-4 text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent py-5 text-base text-ink placeholder:text-neutral-500 focus:outline-none"
            aria-label="Search the site"
            aria-controls="search-results"
            aria-activedescendant={
              navList[activeIdx]
                ? `search-result-${navList[activeIdx].id}`
                : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">

          {/* Empty state — curated start-here list, DS-styled */}
          {query.trim().length === 0 && (
            <div className="py-4">
              <p className="px-6 pb-3 text-xs font-medium tracking-[0.01em] text-neutral-500">
                Start with
              </p>
              <ul ref={listRef} id="search-results" role="listbox">
                {START_HERE.map((item, idx) => renderRow(item, idx))}
              </ul>
            </div>
          )}

          {/* No results */}
          {query.trim().length > 0 && flatResults.length === 0 && (
            <div className="px-6 py-10">
              <p className="text-base leading-6 text-ink">
                Nothing found for &ldquo;{query.trim()}&rdquo;.
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Try a symptom like pain or nails, or a product category like insoles.
              </p>
            </div>
          )}

          {/* Grouped results */}
          {flatResults.length > 0 && (
            <ul ref={listRef} id="search-results" role="listbox" className="py-2">
              {grouped.map((section) => (
                <li key={section.group}>
                  <div className="px-6 pt-4 pb-2 text-xs font-medium tracking-[0.01em] text-neutral-500">
                    {section.group}
                  </div>
                  <ul>
                    {section.items.map((item) => {
                      const idx = flatResults.indexOf(item);
                      return renderRow(item, idx);
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
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
