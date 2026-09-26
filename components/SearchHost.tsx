"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import SearchPalette from "@/components/SearchPalette";

/**
 * One owner for the ⌘K search palette. The nav renders two Search buttons
 * (the mobile row is hidden with CSS on desktop but stays mounted), so the
 * open state, the ⌘K and `/` shortcuts, and the palette live here, once.
 * Two owners meant ⌘K opened two palettes stacked on top of each other.
 */
type SearchContextValue = {
  open: boolean;
  /** Opens the palette; focus returns to `from` when it closes. */
  openSearch: (from?: HTMLElement | null) => void;
};

const SearchContext = createContext<SearchContextValue>({ open: false, openSearch: () => {} });

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const openSearch = useCallback((from?: HTMLElement | null) => {
    opener.current = from ?? (document.activeElement as HTMLElement | null);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K from anywhere toggles the palette.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openSearch(null);
        return;
      }
      // `/` opens it when no text field has focus (the GitHub pattern).
      if (e.key === "/" && !open) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        const editable = tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;
        if (!editable) {
          e.preventDefault();
          openSearch(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openSearch, close]);

  return (
    <SearchContext.Provider value={{ open, openSearch }}>
      {children}
      <SearchPalette open={open} onClose={close} returnFocusTo={opener} />
    </SearchContext.Provider>
  );
}
