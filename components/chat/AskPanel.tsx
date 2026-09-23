"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import AskChat from "./AskChat";
import { askCopy } from "./copy";
import { AssistantMark } from "./states";

/**
 * The slide-in panel behind the nav's "Ask" entry: the same conversation as
 * /ask, in a drawer on the right so the reader keeps the page underneath.
 *
 * Stays mounted after the first open so a conversation survives closing and
 * reopening on the same page (hidden with display: none, which also takes it
 * out of the tab order). Navigating to another page starts fresh, which is
 * the privacy stance anyway.
 */
export default function AskPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [];

    // The composer gets focus so the reader can type right away.
    const composer = panelRef.current?.querySelector<HTMLTextAreaElement>("textarea");
    (composer ?? focusables()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={open ? "fixed inset-0 z-50" : "hidden"} role="presentation">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-neutral-200 bg-white shadow-xl sm:w-[440px] motion-safe:animate-in motion-safe:slide-in-from-right motion-safe:duration-200"
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
          <AssistantMark />
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[0.9375rem] font-medium leading-tight text-ink">
              {askCopy.panel.title}
            </h2>
            <p className="truncate text-xs text-neutral-600">{askCopy.panel.subtitle}</p>
          </div>
          <Link
            href="/ask"
            className="hidden text-xs font-medium text-neutral-600 underline underline-offset-4 hover:text-ink sm:inline"
          >
            {askCopy.panel.fullPage}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={askCopy.panel.close}
            className="flex h-11 w-11 items-center justify-center text-ink transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* The conversation scrolls here; AskChat's composer sticks to this box's bottom. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AskChat variant="panel" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
