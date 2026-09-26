"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackAsk } from "@/lib/analytics";
import { ASK_LAUNCHED } from "@/lib/chat/launch";
import AskPanel from "./AskPanel";

/**
 * One owner for the Ask drawer. The nav renders two Ask buttons (the mobile
 * row is hidden with CSS on desktop but stays mounted), so the open state,
 * the ⌘I shortcut, and the drawer itself live here, once, instead of in each
 * button. Two owners meant ⌘I opened two stacked dialogs and could never
 * close one opened by a click.
 *
 * Shows once the launch switch is on; before that, only outside production,
 * so previews and local builds can review it without exposing it live.
 * Off on /ask itself, where it would open a second copy of the page and
 * where ⌘I should reach the browser untouched.
 */
const visible =
  ASK_LAUNCHED ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development";

type AskContextValue = {
  enabled: boolean;
  open: boolean;
  /** Opens the drawer; focus returns to `from` when it closes. */
  openPanel: (from?: HTMLElement | null) => void;
};

const AskContext = createContext<AskContextValue>({
  enabled: false,
  open: false,
  openPanel: () => {},
});

export function useAsk() {
  return useContext(AskContext);
}

export function AskProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const enabled = visible && pathname !== "/ask";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Where focus goes back to on close. A ref to the button that opened the
  // drawer, not document.activeElement: Safari doesn't focus a clicked button.
  const opener = useRef<HTMLElement | null>(null);

  const openPanel = useCallback(
    (from?: HTMLElement | null) => {
      opener.current = from ?? (document.activeElement as HTMLElement | null);
      setMounted(true);
      setOpen(true);
      trackAsk("ask_panel_open", { from: pathname ?? "" });
    },
    [pathname],
  );
  const close = useCallback(() => setOpen(false), []);

  // ⌘I / Ctrl+I toggles the drawer, the shortcut docs sites have settled on.
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        if (open) close();
        else openPanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, open, openPanel, close]);

  return (
    <AskContext.Provider value={{ enabled, open, openPanel }}>
      {children}
      {enabled && mounted && <AskPanel open={open} onClose={close} returnFocusTo={opener} />}
    </AskContext.Provider>
  );
}
