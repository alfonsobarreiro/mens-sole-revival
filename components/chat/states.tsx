import Link from "next/link";
import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import AlfredMark from "./AlfredMark";
import { Button } from "@/components/ui";
import { type } from "@/components/typography";
import RichText from "./RichText";
import { askCopy } from "./copy";
import { toPlainText } from "./text";
import type { AssistantMessage, Notice, RedFlagTier, UserMessage } from "./types";

const linkClass = "text-link underline underline-offset-4 hover:text-link-hover";

/** An answer that sends the reader to a clinician gets the checklist as its next step. */
const CLINICIAN = /\b(podiatrist|doctor|clinician|physician|urgent care)\b/i;
const nameLabel = "text-xs font-medium tracking-[0.01em] text-neutral-600";
const chipClass =
  "inline-flex min-h-9 cursor-pointer items-center border border-neutral-300 bg-bg-elevated px-4 py-2 text-xs font-medium tracking-[0.01em] text-neutral-700 transition hover:border-ink hover:text-ink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2";

/**
 * Heading level for the chat's own headings (warnings, notices, "not in the
 * guides"): 2 on /ask, under the page's h1; 3 in the drawer, under its h2
 * title. AskChat provides it from its variant.
 */
export const ChatHeadingLevel = createContext<2 | 3>(2);

type HeadingTag = "h2" | "h3" | "h4";
function useHeading(offset = 0): HeadingTag {
  const base = useContext(ChatHeadingLevel);
  return `h${Math.min(base + offset, 4)}` as HeadingTag;
}

// ── Speaker identity ─────────────────────────────────────────────────────────

/** Alfred's shield in the accent: the site's identity signal, on the one
 *  surface where the site is speaking back. */
export function AssistantMark() {
  return (
    <span aria-hidden="true" className="block h-8 w-8 shrink-0 text-accent-500">
      <AlfredMark className="h-8 w-auto" />
    </span>
  );
}

/** Left column mark plus a name label; the body is whatever the caller passes. */
function AssistantFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <AssistantMark />
      <div className="min-w-0 flex-1 pt-0.5">
        <p className={nameLabel}>{askCopy.assistant.name}</p>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
}

// ── Thread rows ──────────────────────────────────────────────────────────────

/** The assistant speaks first. Always the first row, never part of the history. */
export function OpeningRow() {
  return (
    <AssistantFrame>
      <p className="text-[1.0625rem] leading-[1.5] text-ink">{askCopy.assistant.opening}</p>
    </AssistantFrame>
  );
}

export const UserRow = forwardRef<HTMLDivElement, { message: UserMessage }>(function UserRow(
  { message },
  ref,
) {
  return (
    <div ref={ref} className="flex scroll-mt-28 justify-end">
      <div className="max-w-[85%] bg-neutral-100 px-4 py-3">
        <span className="sr-only">{askCopy.message.you}: </span>
        <p className="whitespace-pre-wrap break-words text-[1.0625rem] leading-[1.5] text-ink">{message.text}</p>
      </div>
    </div>
  );
});

export function LoadingRow({ reading }: { reading?: string | null }) {
  return (
    <div aria-hidden="true">
      <AssistantFrame>
        <p className="flex items-center gap-2 text-[1.0625rem] leading-[1.5] text-neutral-600">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent-500 motion-safe:animate-pulse" />
          {reading ? askCopy.loadingGuide(reading) : askCopy.loading}
        </p>
      </AssistantFrame>
    </div>
  );
}

export function StarterChips({ onPick }: { onPick: (question: string) => void }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Example questions">
      {askCopy.starters.map((s) => (
        <li key={s.question}>
          <button type="button" onClick={() => onPick(s.question)} className={chipClass}>
            {s.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function CopyButton({ text, onCopy }: { text: string; onCopy: (ok: boolean) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-4"
      onClick={() => {
        if (!navigator.clipboard) {
          onCopy(false);
          return;
        }
        navigator.clipboard
          .writeText(toPlainText(text))
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onCopy(true);
          })
          .catch(() => onCopy(false));
      }}
    >
      {copied ? (
        askCopy.message.copied
      ) : (
        <>
          {askCopy.message.copy}
          <span className="sr-only"> {askCopy.message.copyWhat}</span>
        </>
      )}
    </Button>
  );
}

export function AssistantRow({
  message,
  isLatest,
  onFeedback,
  onCopy,
}: {
  message: AssistantMessage;
  isLatest: boolean;
  onFeedback: (id: string, value: "up" | "down") => void;
  onCopy: (variant: AssistantMessage["variant"], ok: boolean) => void;
}) {
  const { variant, sources, streaming, feedback } = message;
  const Heading = useHeading();

  if (variant === "out_of_scope") {
    return (
      <AssistantFrame>
        <div className="border border-neutral-300 bg-neutral-100 p-4">
          <Heading className={`${type.h4} text-ink`}>{askCopy.outOfScope.heading}</Heading>
          <p className={`${type.body} mt-2 text-neutral-700`}>{askCopy.outOfScope.body}</p>
          <p className="mt-3 text-[0.9375rem]">
            <Link href="/guides" className={linkClass}>
              {askCopy.outOfScope.browse}
            </Link>
          </p>
        </div>
      </AssistantFrame>
    );
  }

  return (
    <AssistantFrame>
      {variant === "uncertain" && (
        <div className="mb-3 border border-neutral-300 bg-neutral-100 p-4">
          <Heading className={`${type.h4} text-ink`}>{askCopy.uncertain.heading}</Heading>
          <p className={`${type.body} mt-1 text-neutral-700`}>{askCopy.uncertain.body}</p>
        </div>
      )}

      <div>
        <RichText text={message.text} />
        {streaming && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-ink motion-safe:animate-pulse"
          />
        )}
      </div>

      {!streaming && sources.length > 0 && (
        <div className="mt-4">
          <p className={nameLabel}>{askCopy.message.sources}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {sources.map((s) => (
              <li key={s.url}>
                <Link href={s.url} className={chipClass}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!streaming && variant === "uncertain" && (
        <p className="mt-3 text-[0.9375rem]">
          <Link href="/doctor-prep" className={linkClass}>
            {askCopy.uncertain.doctorPrep}
          </Link>
        </p>
      )}

      {!streaming && (
        <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2">
          <CopyButton text={message.text} onCopy={(ok) => onCopy(variant, ok)} />
          <span aria-hidden="true" className="text-neutral-300">
            ·
          </span>
          <Feedback feedback={feedback} onVote={(value) => onFeedback(message.id, value)} />
        </div>
      )}

      {!streaming && isLatest && (
        <p className="mt-3 text-[0.9375rem] leading-[1.5] text-neutral-700">
          {variant !== "uncertain" && CLINICIAN.test(message.text) ? (
            <>
              {askCopy.nextStep.doctorBody}{" "}
              <Link href="/doctor-prep" className={linkClass}>
                {askCopy.nextStep.doctorLink}
              </Link>
            </>
          ) : (
            <>
              {askCopy.nextStep.body}{" "}
              <Link href="/assessment" className={linkClass}>
                {askCopy.nextStep.link}
              </Link>
            </>
          )}
        </p>
      )}
    </AssistantFrame>
  );
}

// ── Red-flag escalation ──────────────────────────────────────────────────────

export const EscalationPanel = forwardRef<HTMLHeadingElement, { tier: RedFlagTier }>(
  function EscalationPanel({ tier }, headingRef) {
    const copy = askCopy.escalation[tier];
    const headingId = useId();
    const urgentId = useId();
    const Heading = useHeading();
    const SubHeading = useHeading(1);
    return (
      <section
        aria-labelledby={headingId}
        className="border-l-4 border-ink bg-neutral-100 p-6 md:p-8"
      >
        <Heading
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          aria-describedby={urgentId}
          className={`${type.h2} text-ink focus-visible:outline-none`}
        >
          {copy.heading}
        </Heading>
        <p className="mt-4 text-[1.0625rem] leading-[1.5] text-ink">{copy.body}</p>

        <SubHeading className={`${type.h4} mt-6 text-ink`}>{copy.nextHeading}</SubHeading>
        <ul className="mt-3 list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.5] text-ink">
          <li id={urgentId}>{copy.urgent}</li>
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
  const Heading = useHeading();

  return (
    <section
      aria-labelledby={headingId}
      className="border border-neutral-300 bg-neutral-100 p-6"
    >
      <Heading
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className={`${type.h3} text-ink focus-visible:outline-none`}
      >
        {copy.heading}
      </Heading>
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
          <>
            <Link href="/assessment" className={`${linkClass} text-[0.9375rem]`}>
              {askCopy.notice.assessment}
            </Link>
            <Link href="/doctor-prep" className={`${linkClass} text-[0.9375rem]`}>
              {askCopy.notice.checklist}
            </Link>
          </>
        )}
      </div>
    </section>
  );
});

/**
 * "Helpful? Yes / No". Voting swaps the buttons for a thank-you line. The
 * line's live region is on the page from the start (empty), so screen
 * readers announce the thanks, and focus moves onto it so keyboard users
 * aren't dropped at the top of the page when the button they pressed goes.
 */
function Feedback({
  feedback,
  onVote,
}: {
  feedback: AssistantMessage["feedback"];
  onVote: (value: "up" | "down") => void;
}) {
  const thanksRef = useRef<HTMLParagraphElement>(null);
  const promptId = useId();
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => {
    if (justVoted && feedback) thanksRef.current?.focus({ preventScroll: true });
  }, [justVoted, feedback]);

  const vote = (value: "up" | "down") => {
    setJustVoted(true);
    onVote(value);
  };

  return (
    <>
      {!feedback && (
        <div role="group" aria-labelledby={promptId} className="flex items-center gap-x-1">
          <p id={promptId} className="pl-3 text-xs text-neutral-600">
            {askCopy.feedback.prompt}
          </p>
          <Button variant="ghost" size="sm" onClick={() => vote("up")}>
            {askCopy.feedback.yes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => vote("down")}>
            {askCopy.feedback.no}
          </Button>
        </div>
      )}
      <p
        ref={thanksRef}
        tabIndex={-1}
        role="status"
        className={feedback ? "px-3 text-xs text-neutral-600 outline-none" : "sr-only"}
      >
        {feedback ? askCopy.feedback.thanks : ""}
      </p>
    </>
  );
}
