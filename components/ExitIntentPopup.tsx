"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import InlineNewsletterForm from "@/components/InlineNewsletterForm";

// ─────────────────────────────────────────────────────────────────────────────
// ExitIntentPopup — one-shot modal that surfaces the lead magnet at the
// least-disruptive moment (when the reader is about to leave).
//
// Triggers:
//   - Desktop: mouseleave through the top of the viewport (classic exit
//     intent — mouse moving toward the tab close / URL bar).
//   - Mobile / touch: no mouseleave signal exists, so we fire after
//     45 seconds of continuous session time WITHOUT a click on the
//     assessment or foot-check CTA. If they've engaged with either
//     of those, they've already found the funnel; don't interrupt.
//
// Suppression:
//   - Once dismissed OR submitted: sets localStorage flag with a 30-day
//     expiry so it does not reappear on every page load.
//   - Suppressed on /newsletter, /newsletter/confirm, /newsletter/confirmed,
//     /foot-check, and /assessment routes so it never fires on top of the
//     forms it duplicates.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "msr-exit-popup-suppressed";
const SUPPRESS_DAYS = 30;
const MOBILE_DELAY_MS = 45_000;

const SUPPRESS_PATHS = [
  "/newsletter",
  "/newsletter/confirm",
  "/newsletter/confirmed",
  "/foot-check",
  "/assessment",
];

function isSuppressed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const expiry = Number.parseInt(raw, 10);
    if (Number.isNaN(expiry)) return false;
    return Date.now() < expiry;
  } catch {
    return true;
  }
}

function markSuppressed() {
  try {
    const expiry = Date.now() + SUPPRESS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(expiry));
  } catch {
    /* localStorage unavailable — accept re-appearance next session */
  }
}

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  // Route suppression — recomputed on every SPA navigation via usePathname().
  // The old version read window.location.pathname once on mount, which meant
  // navigating to /assessment (or /newsletter, etc.) from another page kept
  // the popup armed and it could fire on top of the very forms it duplicates.
  const isSuppressedRoute = SUPPRESS_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Landed on a suppressed route — close any open popup + disarm.
    if (isSuppressedRoute) {
      setOpen(false);
      setArmed(false);
      return;
    }

    if (isSuppressed()) return;

    // Arm after a brief warmup so the popup doesn't fire the instant a
    // fast-moving cursor blows past the top of a slow-loading page.
    const armTimer = window.setTimeout(() => setArmed(true), 2_000);

    return () => window.clearTimeout(armTimer);
  }, [pathname, isSuppressedRoute]);

  useEffect(() => {
    if (!armed) return;
    if (typeof window === "undefined") return;

    // Desktop exit-intent — mouse leaves through the top edge.
    const onMouseOut = (e: MouseEvent) => {
      const to = (e.relatedTarget || (e as unknown as { toElement?: Node }).toElement) as Node | null;
      // toElement/relatedTarget null → cursor left the document entirely.
      if (to) return;
      if (e.clientY > 0) return;
      setOpen(true);
    };
    document.addEventListener("mouseout", onMouseOut);

    // Mobile fallback — fire after MOBILE_DELAY_MS unless they engage with
    // the primary funnel CTAs.
    let mobileTimer: number | null = null;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) {
      mobileTimer = window.setTimeout(() => setOpen(true), MOBILE_DELAY_MS);
      const cancelOnFunnelClick = (e: Event) => {
        const el = e.target as HTMLElement | null;
        const link = el?.closest("a");
        if (!link) return;
        const href = link.getAttribute("href") || "";
        if (href.startsWith("/assessment") || href.startsWith("/foot-check")) {
          if (mobileTimer) window.clearTimeout(mobileTimer);
        }
      };
      document.addEventListener("click", cancelOnFunnelClick);
      return () => {
        document.removeEventListener("mouseout", onMouseOut);
        document.removeEventListener("click", cancelOnFunnelClick);
        if (mobileTimer) window.clearTimeout(mobileTimer);
      };
    }

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [armed]);

  useEffect(() => {
    if (!open) return;
    // ESC closes.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Lock scroll while modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    markSuppressed();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-brand-900/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-600">
            Before you go
          </p>
          <div id="exit-popup-title" className="mt-4">
            <InlineNewsletterForm
              heading="Get the 5-minute foot check."
              body="Printable checklist, same questions the assessment asks. Yours to keep whether you subscribe long-term or not."
              cta="Send it to me"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
