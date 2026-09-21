import Link from "next/link";
import { forwardRef, useId } from "react";
import { Button } from "@/components/ui";
import { type } from "@/components/typography";
import RichText from "./RichText";
import { askCopy } from "./copy";
import type { AssistantMessage, Notice, RedFlagTier, UserMessage } from "./types";

const linkClass = "text-link underline underline-offset-4 hover:text-link-hover";
const smallLabel = "text-xs font-medium tracking-[0.01em] text-neutral-600";

// ── Empty ────────────────────────────────────────────────────────────────────

export function StarterQuestions({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div>
      <h2 className={`${type.h3} text-ink`}>{askCopy.empty.heading}</h2>
      <ul className="mt-4 space-y-2">
        {askCopy.empty.starters.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onPick(q)}
              className="w-full border border-neutral-300 bg-bg-elevated px-4 py-3 text-left text-[0.9375rem] leading-[1.5] text-ink transition hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
            >
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Conversation rows ────────────────────────────────────────────────────────

export const UserRow = forwardRef<HTMLDivElement, { message: UserMessage }>(function UserRow(
  { message },
  ref,
) {
  return (
    <div ref={ref} className="scroll-mt-28 border-l-2 border-neutral-300 pl-4">
      <p className={smallLabel}>{askCopy.message.youAsked}</p>
      <p className="mt-1 whitespace-pre-wrap text-[1.0625rem] font-medium leading-[1.5] text-ink">
        {message.text}
      </p>
    </div>
  );
});

export function LoadingRow() {
  return (
    <div aria-hidden="true">
      <p className={smallLabel}>{askCopy.message.answer}</p>
      <p className="mt-1 text-[1.0625rem] leading-[1.5] text-neutral-600 motion-safe:animate-pulse">
        {askCopy.loading}
      </p>
    </div>
  );
}

export function AssistantRow({
  message,
  isLatest,
  onFeedback,
}: {
  message: AssistantMessage;
  isLatest: boolean;
  onFeedback: (id: string, value: "up" | "down") => void;
}) {
  const { variant, sources, streaming, feedback } = message;

  if (variant === "out_of_scope") {
    return (
      <div className="border border-neutral-300 bg-neutral-100 p-5">
        <h3 className={`${type.h4} text-ink`}>{askCopy.outOfScope.heading}</h3>
        <p className={`${type.body} mt-2 text-neutral-700`}>{askCopy.outOfScope.body}</p>
        <p className="mt-3 text-[0.9375rem]">
          <Link href="/guides" className={linkClass}>
            {askCopy.outOfScope.browse}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className={smallLabel}>{askCopy.message.answer}</p>

      {variant === "uncertain" && (
        <div className="mt-2 border border-neutral-300 bg-neutral-100 p-4">
          <h3 className={`${type.h4} text-ink`}>{askCopy.uncertain.heading}</h3>
          <p className={`${type.body} mt-1 text-neutral-700`}>{askCopy.uncertain.body}</p>
        </div>
      )}

      <div className="mt-2">
        <RichText text={message.text} />
        {streaming && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-ink motion-safe:animate-pulse"
          />
        )}
      </div>

      {!streaming && sources.length > 0 && (
        <p className="mt-4 text-[0.9375rem] leading-[1.5] text-neutral-700">
          {sources.length === 1 ? askCopy.message.sources : askCopy.message.sourcesPlural}{" "}
          {sources.map((s, i) => (
            <span key={s.url}>
              <Link href={s.url} className={linkClass}>
                {s.title}
              </Link>
              {i < sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}

      {!streaming && variant === "uncertain" && (
        <p className="mt-2 text-[0.9375rem]">
          <Link href="/doctor-prep" className={linkClass}>
            {askCopy.uncertain.doctorPrep}
          </Link>
        </p>
      )}

      {!streaming && (
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-3">
          {feedback ? (
            <p className="text-xs text-neutral-600" role="status">
              {askCopy.feedback.thanks}
            </p>
          ) : (
            <>
              <p className="text-xs text-neutral-600">{askCopy.feedback.prompt}</p>
              <Button variant="secondary" size="sm" onClick={() => onFeedback(message.id, "up")}>
                {askCopy.feedback.yes}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onFeedback(message.id, "down")}>
                {askCopy.feedback.no}
              </Button>
            </>
          )}
        </div>
      )}

      {!streaming && isLatest && (
        <p className="mt-3 text-[0.9375rem] leading-[1.5] text-neutral-700">
          {askCopy.nextStep.body}{" "}
          <Link href="/assessment" className={linkClass}>
            {askCopy.nextStep.link}
          </Link>
        </p>
      )}
    </div>
  );
}

// ── Red-flag escalation ──────────────────────────────────────────────────────

export const EscalationPanel = forwardRef<HTMLHeadingElement, { tier: RedFlagTier }>(
  function EscalationPanel({ tier }, headingRef) {
    const copy = askCopy.escalation[tier];
    const headingId = useId();
    return (
      <section
        aria-labelledby={headingId}
        className="border-l-4 border-ink bg-bg-elevated p-6 md:p-8"
      >
        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className={`${type.h2} text-ink focus-visible:outline-none`}
        >
          {copy.heading}
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.5] text-ink">{copy.body}</p>

        <h3 className={`${type.h4} mt-6 text-ink`}>{copy.nextHeading}</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.5] text-ink">
          <li>{copy.urgent}</li>
          {copy.otherwise && <li>{copy.otherwise}</li>}
          <li>
            <Link href="/doctor-prep" className={linkClass}>
              {askCopy.escalation.checklist}
            </Link>
            . {askCopy.escalation.checklistNote}
          </li>
        </ul>

        <p className="mt-6 text-xs text-neutral-600">{askCopy.escalation.stopped}</p>
      </section>
    );
  },
);

// ── Notices: error, rate limited, resting ────────────────────────────────────

export const NoticePanel = forwardRef<
  HTMLHeadingElement,
  { notice: Notice; onRetry?: () => void }
>(function NoticePanel({ notice, onRetry }, headingRef) {
  const copy =
    notice.kind === "error"
      ? askCopy.notice.error
      : notice.kind === "rate_limited"
        ? askCopy.notice.rateLimited
        : askCopy.notice.resting;
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="border border-neutral-300 bg-neutral-100 p-6"
    >
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className={`${type.h3} text-ink focus-visible:outline-none`}
      >
        {copy.heading}
      </h2>
      <p className={`${type.body} mt-2 text-neutral-700`}>{copy.body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {notice.kind === "error" && onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {askCopy.notice.error.retry}
          </Button>
        )}
        <Link href="/guides" className={`${linkClass} text-[0.9375rem]`}>
          {askCopy.notice.guides}
        </Link>
        {notice.kind !== "error" && (
          <Link href="/assessment" className={`${linkClass} text-[0.9375rem]`}>
            {askCopy.notice.assessment}
          </Link>
        )}
      </div>
    </section>
  );
});
