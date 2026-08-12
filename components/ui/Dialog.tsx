"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
  describedBy?: string;
};

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  className,
  children,
  labelledBy,
  describedBy,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && closeOnEsc) {
        e.stopPropagation();
        handleClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const nodes = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
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
      }
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [open, closeOnEsc, handleClose]);

  if (!open || typeof document === "undefined") return null;

  const titleId = labelledBy ?? (title ? "dialog-title" : undefined);
  const descId = describedBy ?? (description ? "dialog-desc" : undefined);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
        onClick={closeOnBackdrop ? handleClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          "relative bg-bg-elevated border border-border-subtle shadow-lg",
          "w-full",
          sizes[size],
          "max-h-[90vh] overflow-y-auto",
          className,
        )}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className={cn(
              "absolute right-4 top-4 h-8 w-8 flex items-center justify-center",
              "text-ink hover:bg-neutral-100 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-focus-ring",
            )}
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {(title || description) && (
          <div className="px-8 pt-8 pb-4 border-b border-border-subtle pr-14">
            {title && (
              <h2 id={titleId} className="text-h2 font-heading font-bold text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-2 text-[0.9375rem] text-text-muted">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn(!title && !description && "pt-8", "px-8 pb-8")}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Dialog;
