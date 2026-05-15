"use client";

import type { SectionId } from "@/lib/assessment-routing";

export interface SidebarSection {
  id: SectionId;
  title: string;
  status: "done" | "current" | "upcoming";
}

interface AssessmentSidebarProps {
  sections: SidebarSection[];
  /** Called when the user confirms "Skip this section". */
  onSkip?: () => void;
}

/**
 * Vertical sidebar showing the user's section progress. Renders a
 * checkmark next to completed sections, an accent dot for the current
 * section, and neutral state for upcoming sections. Built for the
 * assessment redesign (see MSR-Assessment-Redesign.md §3.2).
 */
export default function AssessmentSidebar({
  sections,
  onSkip,
}: AssessmentSidebarProps) {
  const handleSkip = () => {
    if (!onSkip) return;
    const ok = window.confirm(
      "Skip this section? You can come back to the assessment any time."
    );
    if (ok) onSkip();
  };

  return (
    <nav
      aria-label="Assessment sections"
      className="border border-neutral-200 bg-white p-5"
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
        Your sections
      </p>
      <ol className="space-y-3">
        {sections.map((s) => {
          const isCurrent = s.status === "current";
          const isDone = s.status === "done";
          return (
            <li
              key={s.id}
              aria-current={isCurrent ? "step" : undefined}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center text-xs font-bold ${
                  isDone
                    ? "bg-accent-500 text-white"
                    : isCurrent
                    ? "border-2 border-accent-500 bg-white text-accent-600"
                    : "border border-neutral-300 bg-white text-neutral-300"
                }`}
              >
                {isDone ? "✓" : isCurrent ? "●" : ""}
              </span>
              <span
                className={`text-sm leading-5 ${
                  isCurrent
                    ? "font-bold text-brand-900"
                    : isDone
                    ? "text-neutral-700"
                    : "text-neutral-400"
                }`}
              >
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>
      {onSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="mt-5 text-xs font-semibold uppercase tracking-wider text-neutral-500 underline underline-offset-4 transition hover:text-brand-700"
        >
          Skip this section →
        </button>
      )}
    </nav>
  );
}
