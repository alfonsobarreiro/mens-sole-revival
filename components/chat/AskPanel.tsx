"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AskChat from "./AskChat";
import { askCopy } from "./copy";

/**
 * The slide-in panel behind the nav's "Ask" entry: the same conversation as
 * /ask, in a drawer on the right so the reader keeps the page underneath.
 *
 * Stays mounted after the first open so a conversation survives closing and
 * reopening on the same page (hidden with display: none, which also takes it
 * out of the tab order). Navigating to another page starts fresh, which is
 * the privacy stance anyway.
 */
export default function AskPanel({
  open,
  onClose,
  returnFocusTo,
}: {
  open: boolean;
  onClose: () => void;
  /** The control that opened the drawer; focus goes back to it on close. */
  returnFocusTo?: React.RefObject<HTMLElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // While `leaving`, the panel stays in the DOM to play its slide-out; the
  // animationend handler (or a timer, when animations are off) drops it.
  // Derived from the previous render's `open`, the React pattern for
  // reacting to a prop change without an effect.
  const [leaving, setLeaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setLeaving(true);
  }
  const present = open || leaving;

  // Fallback for reduced motion (animation: none, so no animationend).
  useEffect(() => {
    if (open || !leaving) return;
    const timer = setTimeout(() => setLeaving(false), 400);
    return () => clearTimeout(timer);
  }, [open, leaving]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Everything behind the drawer is inert while it's open: out of the tab
    // order and out of reach of screen readers' virtual cursor.
    const inerted: HTMLElement[] = [];
    for (const el of Array.from(document.body.children) as HTMLElement[]) {
      if (el === rootRef.current || el.inert) continue;
      el.inert = true;
      inerted.push(el);
    }

    // Only what's on screen: "Open full page" is hidden below 640px, and a
    // display:none element can't take focus, so it can't anchor the loop.
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.getClientRects().length > 0);

    // The composer gets focus so the reader can type right away. When there
    // is no composer (a red-flag escalation, a notice, or the turn limit,
    // all of which survive closing and reopening), the heading that explains
    // why gets it instead, then the first control, then the dialog itself.
    const panel = panelRef.current;
    const composer = panel?.querySelector<HTMLTextAreaElement>("textarea");
    const heading = panel?.querySelector<HTMLElement>(
      'h2[tabindex="-1"]:not(.sr-only), h3[tabindex="-1"]',
    );
    (composer ?? heading ?? focusables()[0] ?? panel)?.focus();

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
      const active = document.activeElement;
      // Focus on the dialog itself, or somewhere outside it: bring it back in.
      if (active === panelRef.current || !panelRef.current?.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      for (const el of inerted) el.inert = false;
      (returnFocusTo?.current ?? previousFocus.current)?.focus?.();
    };
  }, [open, onClose, returnFocusTo]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={rootRef} className={present ? "fixed inset-0 z-50" : "hidden"} role="presentation">
      <div
        className={`absolute inset-0 bg-ink/40 ${open ? "ask-backdrop-enter" : "ask-backdrop-exit"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onAnimationEnd={() => {
          if (!open) setLeaving(false);
        }}
        className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-neutral-200 bg-white shadow-xl outline-none sm:w-[440px] ${
          open ? "ask-panel-enter" : "ask-panel-exit"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 py-2 pl-4 pr-2">
          {/* The visible line names the dialog, so screen readers hear it once. */}
          <h2 id={titleId} className="min-w-0 flex-1 text-[0.8125rem] font-normal text-neutral-600">
            {askCopy.panel.subtitle}
          </h2>
          <Link
            href="/ask"
            className="hidden shrink-0 text-xs font-medium text-neutral-600 underline underline-offset-4 hover:text-ink sm:inline"
          >
            {askCopy.panel.fullPage}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={askCopy.panel.close}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-ink transition hover:bg-neutral-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
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
