"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackAsk } from "@/lib/analytics";
import { ASK_LAUNCHED } from "@/lib/chat/launch";
import AskPanel from "./AskPanel";
import { askCopy } from "./copy";

/**
 * The nav's "Ask" entry, beside Search. Opens the AskPanel drawer.
 *
 * Shows once the launch switch is on; before that, only outside production,
 * so previews and local builds can review it without exposing it live.
 * Hidden on /ask itself, where it would open a second copy of the page.
 */
const visible = ASK_LAUNCHED || process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export default function AskTrigger({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openPanel = useCallback(() => {
    setMounted(true);
    setOpen(true);
    trackAsk("ask_panel_open", { from: pathname ?? "" });
  }, [pathname]);
  const close = useCallback(() => setOpen(false), []);

  // ⌘I / Ctrl+I toggles the panel, the shortcut docs sites have settled on.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        if (open) close();
        else openPanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openPanel, close]);

  if (!visible || pathname === "/ask") return null;

  return (
    <>
      {variant === "desktop" ? (
        <button
          type="button"
          onClick={openPanel}
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
          onClick={openPanel}
          aria-label={askCopy.panel.triggerLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink transition hover:text-accent-700"
        >
          <ChatIcon className="h-5 w-5" />
        </button>
      )}
      {mounted && <AskPanel open={open} onClose={close} />}
    </>
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
