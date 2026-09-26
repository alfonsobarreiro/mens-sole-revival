"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { type } from "@/components/typography";
import { trackAsk } from "@/lib/analytics";
import { MAX_INPUT_CHARS, MAX_TURNS } from "@/lib/chat/limits";
import { classifyRedFlag } from "@/lib/chat/red-flags";
import { askCopy } from "./copy";
import {
  AssistantRow,
  EscalationPanel,
  LoadingRow,
  NoticePanel,
  OpeningRow,
  StarterChips,
  UserRow,
} from "./states";
import { toPlainText } from "./text";
import type {
  AssistantMessage,
  AssistantVariant,
  ChatMessage,
  Notice,
  Phase,
  RedFlagTier,
  Source,
} from "./types";

/**
 * The /ask conversation.
 *
 * Privacy: the conversation lives in React state only. Nothing is written to
 * localStorage, cookies, or analytics. Reloading the page erases it.
 *
 * Wire contract with POST /api/ask:
 *   request   { messages: [{ role, content, sig? }] }   sig: server signature on assistant turns
 *   200 JSON  { type: "red_flag", tier } | { type: "out_of_scope" }
 *   200 NDJSON stream, one event per line:
 *             { type: "meta", variant, sources } → { type: "delta", text }… → { type: "done", sig }
 *             meta arrives before the model is called, so the page can name the
 *             guide it's reading; a failure after that is { type: "notice", kind }
 *   429       rate limited
 *   503       { code: "resting" } when the monthly budget is spent
 */

export type ChatSnapshot = {
  messages: ChatMessage[];
  phase: Phase;
  escalation: RedFlagTier | null;
  notice: Notice | null;
  /** Title of the guide being read while loading (preview only). */
  reading?: string | null;
};

const EMPTY: ChatSnapshot = { messages: [], phase: "idle", escalation: null, notice: null };

type StreamEvent =
  | { type: "meta"; variant?: string; sources?: unknown }
  | { type: "delta"; text?: string }
  | { type: "done"; sig?: string }
  | { type: "error" }
  | { type: "notice"; kind?: string };

const TIERS: RedFlagTier[] = ["tier1", "tier2", "tier3"];

/** The composer grows with the draft up to this height, then scrolls inside. */
const COMPOSER_MAX_PX = 200;

/** Sources render as internal links, so only same-site paths are accepted. */
function cleanSources(raw: unknown): Source[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (s): s is Source =>
      typeof s?.title === "string" &&
      typeof s?.url === "string" &&
      s.url.startsWith("/") &&
      !s.url.startsWith("//") &&
      !s.url.includes("\\"),
  );
}

/**
 * Only turns the server signed go back as history. A stopped or failed reply
 * has no signature and is left out, and the route refuses anything unsigned,
 * so the model only ever "remembers" what it actually said.
 */
function toWire(history: ChatMessage[]) {
  return history
    .filter((m) => m.text.trim() !== "" && (m.role === "user" || m.sig))
    .map((m) =>
      m.role === "user"
        ? { role: m.role, content: m.text }
        : { role: m.role, content: m.text, sig: m.sig },
    );
}

function fitToContent(el: HTMLTextAreaElement) {
  el.style.height = "0px";
  el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_PX)}px`;
}

const iconButton =
  "flex h-11 w-11 cursor-pointer items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2";

function ArrowUpIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none">
      <path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
      <rect x="5" y="5" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

export default function AskChat({
  initial = EMPTY,
  variant = "page",
}: {
  initial?: ChatSnapshot;
  /** "panel" drops the outer frame and fills its scrolling host (the nav drawer). */
  variant?: "page" | "panel";
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [phase, setPhase] = useState<Phase>(initial.phase);
  const [escalation, setEscalation] = useState<RedFlagTier | null>(initial.escalation);
  const [notice, setNotice] = useState<Notice | null>(initial.notice);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [reading, setReading] = useState<string | null>(initial.reading ?? null);
  const [atEnd, setAtEnd] = useState(true);

  const fieldId = useId();
  const privacyId = `${fieldId}-privacy`;
  const counterId = `${fieldId}-counter`;
  const errorId = `${fieldId}-error`;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const escalationRef = useRef<HTMLHeadingElement>(null);
  const noticeRef = useRef<HTMLHeadingElement>(null);
  const turnLimitRef = useRef<HTMLHeadingElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idCounter = useRef(0);

  // Focus and scroll are requested by event handlers and applied after the
  // render that follows, so nothing moves on first paint.
  const pendingFocus = useRef<"composer" | "escalation" | "notice" | "turnLimit" | null>(null);
  const pendingScroll = useRef(false);

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (pendingScroll.current && lastUserRef.current) {
      pendingScroll.current = false;
      lastUserRef.current.scrollIntoView({
        block: "start",
        behavior: reducedMotion() ? "auto" : "smooth",
      });
    }

    const target = pendingFocus.current;
    if (!target) return;
    const el =
      target === "composer"
        ? textareaRef.current
        : target === "escalation"
          ? escalationRef.current
          : target === "notice"
            ? noticeRef.current
            : turnLimitRef.current;
    if (el) {
      pendingFocus.current = null;
      el.focus();
    }
  });

  useEffect(() => () => abortRef.current?.abort(), []);

  // The composer keeps its one-line height until the draft needs more.
  useEffect(() => {
    if (textareaRef.current) fitToContent(textareaRef.current);
  }, [draft]);

  // "Jump to latest" shows while the end of the thread sits under the composer
  // or below the fold. The margin is roughly the composer's height.
  useEffect(() => {
    const el = endRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting), {
      rootMargin: "0px 0px -150px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nextId = useCallback(() => `m${++idCounter.current}`, []);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const busy = phase !== "idle";
  const tooLong = draft.length > MAX_INPUT_CHARS;
  const nearLimit = draft.length >= MAX_INPUT_CHARS - 100;
  const atTurnLimit = !busy && !escalation && !notice && userTurns >= MAX_TURNS;
  const composerHidden =
    escalation !== null ||
    atTurnLimit ||
    notice?.kind === "rate_limited" ||
    notice?.kind === "resting";
  const hasConversation = messages.length > 0;
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const lastUserId = [...messages].reverse().find((m) => m.role === "user")?.id;
  const showJump = hasConversation && !atEnd && !composerHidden;

  const fail = useCallback((next: Notice, partialId?: string | null) => {
    if (partialId) setMessages((prev) => prev.filter((m) => m.id !== partialId));
    setPhase("idle");
    setReading(null);
    setStatus("");
    setNotice(next);
    pendingFocus.current = "notice";
    trackAsk("ask_notice", { kind: next.kind });
  }, []);

  const escalate = useCallback((tier: RedFlagTier, where: "client" | "server") => {
    abortRef.current?.abort();
    setPhase("idle");
    setReading(null);
    setStatus("");
    setNotice(null);
    setEscalation(tier);
    pendingFocus.current = "escalation";
    trackAsk("ask_red_flag", { tier, where });
  }, []);

  const request = useCallback(
    async (history: ChatMessage[]) => {
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      const turn = history.filter((m) => m.role === "user").length;
      setNotice(null);
      setReading(null);
      setPhase("loading");
      setStatus(askCopy.loading);

      let assistantId: string | null = null;

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: toWire(history) }),
          signal: controller.signal,
        });

        if (res.status === 429) return fail({ kind: "rate_limited" });
        if (res.status === 503) {
          const data = await res.json().catch(() => null);
          return fail(data?.code === "resting" ? { kind: "resting" } : { kind: "error" });
        }
        if (!res.ok || !res.body) return fail({ kind: "error" });

        // Short-circuit answers arrive as plain JSON, not a stream.
        if (res.headers.get("content-type")?.includes("application/json")) {
          const data = await res.json();
          if (data?.type === "red_flag" && TIERS.includes(data.tier)) {
            return escalate(data.tier, "server");
          }
          if (data?.type === "out_of_scope") {
            const message: AssistantMessage = {
              id: nextId(),
              role: "assistant",
              text: "",
              variant: "out_of_scope",
              sources: [],
            };
            setMessages((prev) => [...prev, message]);
            setPhase("idle");
            setStatus(`${askCopy.outOfScope.heading}. ${askCopy.outOfScope.body}`);
            trackAsk("ask_out_of_scope", { turn });
            return;
          }
          return fail({ kind: "error" });
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        let sig: string | null = null;
        let variant: AssistantVariant = "answer";
        let sources: Source[] = [];
        let noticeKind: Notice["kind"] | null = null;
        let finished = false;

        // Read until the server closes the stream, even after the done event,
        // so the browser sees a completed request rather than an aborted one.
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newline = buffer.indexOf("\n");
          while (newline >= 0) {
            const line = buffer.slice(0, newline).trim();
            buffer = buffer.slice(newline + 1);
            newline = buffer.indexOf("\n");
            if (!line) continue;

            const event = JSON.parse(line) as StreamEvent;

            if (event.type === "meta") {
              // Arrives before the model is called; the answer row waits for text.
              variant = event.variant === "uncertain" ? "uncertain" : "answer";
              sources = cleanSources(event.sources);
              const title = sources[0]?.title;
              if (title) {
                setReading(title);
                setStatus(askCopy.loadingGuide(title));
              }
            } else if (event.type === "notice") {
              noticeKind =
                event.kind === "rate_limited" || event.kind === "resting" ? event.kind : "error";
            } else if (event.type === "delta" && event.text) {
              if (!assistantId) {
                assistantId = nextId();
                const message: AssistantMessage = {
                  id: assistantId,
                  role: "assistant",
                  text: "",
                  variant,
                  sources,
                  streaming: true,
                };
                setMessages((prev) => [...prev, message]);
                setReading(null);
                setPhase("streaming");
              }
              fullText += event.text;
              const id = assistantId;
              const text = fullText;
              setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));
            } else if (event.type === "done") {
              finished = true;
              sig = typeof event.sig === "string" ? event.sig : null;
            } else if (event.type === "error") {
              throw new Error("stream error");
            }
          }
        }

        if (noticeKind) return fail({ kind: noticeKind }, assistantId);
        if (!finished || !assistantId || fullText.trim() === "") {
          throw new Error("stream ended early");
        }

        const id = assistantId;
        const signature = sig ?? undefined;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, streaming: false, sig: signature } : m)),
        );
        setPhase("idle");
        setStatus(
          `${askCopy.srAnswerReady} ${
            variant === "uncertain" ? `${askCopy.uncertain.heading}. ` : ""
          }${toPlainText(fullText)}`,
        );
        trackAsk("ask_answer_shown", { variant, source_count: sources.length, turn });
        if (turn >= MAX_TURNS) {
          // The composer is about to disappear with focus inside it; the
          // turn-limit heading takes focus so the reader hears why.
          pendingFocus.current = "turnLimit";
          trackAsk("ask_turn_limit");
        }
      } catch {
        if (controller.signal.aborted) return;
        fail({ kind: "error" }, assistantId);
      }
    },
    [escalate, fail, nextId],
  );

  const send = (raw: string, via: "typed" | "starter") => {
    const text = raw.trim();
    if (busy || composerHidden) return;
    if (text === "") {
      textareaRef.current?.focus();
      return;
    }
    if (text.length > MAX_INPUT_CHARS) {
      setStatus(askCopy.composer.tooLong);
      textareaRef.current?.focus();
      return;
    }

    const userMessage: ChatMessage = { id: nextId(), role: "user", text };
    const history = [...messages, userMessage];
    setMessages(history);
    setDraft("");
    pendingScroll.current = true;
    trackAsk("ask_question_sent", { turn: userTurns + 1, via });

    // Red flags are checked in the browser first: the escalation shows at once,
    // still works when the assistant is rate limited or resting, and the
    // message never leaves the device. The server runs the same check again.
    const flag = classifyRedFlag(text);
    if (flag) {
      escalate(flag.tier, "client");
      return;
    }

    pendingFocus.current = "composer";
    void request(history);
  };

  /** Keeps whatever has streamed so far and hands the composer back. */
  const stop = () => {
    if (!busy) return;
    abortRef.current?.abort();
    setMessages((prev) =>
      prev
        .map((m) => (m.role === "assistant" && m.streaming ? { ...m, streaming: false } : m))
        .filter((m) => m.role === "user" || m.text.trim() !== "" || m.variant === "out_of_scope"),
    );
    setPhase("idle");
    setReading(null);
    setStatus(askCopy.stopped);
    pendingFocus.current = userTurns >= MAX_TURNS ? "turnLimit" : "composer";
    trackAsk("ask_stopped", { turn: userTurns });
  };

  const retry = () => {
    if (busy) return;
    pendingFocus.current = "composer";
    void request(messages);
  };

  const startOver = (from: string) => {
    abortRef.current?.abort();
    setMessages([]);
    setPhase("idle");
    setReading(null);
    setEscalation(null);
    setNotice(null);
    setDraft("");
    setStatus("");
    pendingFocus.current = "composer";
    trackAsk("ask_restart", { from });
  };

  const giveFeedback = (id: string, value: "up" | "down") => {
    const target = messages.find((m) => m.id === id);
    if (!target || target.role !== "assistant" || target.feedback) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === id && m.role === "assistant" ? { ...m, feedback: value } : m)),
    );
    trackAsk("ask_feedback", { value, variant: target.variant });
  };

  const jumpToLatest = () => {
    endRef.current?.scrollIntoView({ block: "end", behavior: reducedMotion() ? "auto" : "smooth" });
    // The button unmounts once the end is in view; don't let focus go with it.
    textareaRef.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    send(draft, "typed");
  };

  const restartFrom = escalation ? "escalation" : notice ? notice.kind : atTurnLimit ? "turn_limit" : "conversation";

  return (
    <div
      className={
        variant === "panel"
          ? "flex min-h-full flex-col bg-white"
          : "flex min-h-[70vh] flex-col border border-neutral-200 bg-white"
      }
    >
      <p role="status" className="sr-only">
        {status}
      </p>

      {hasConversation && (
        <div className="flex min-h-12 items-center justify-end border-b border-neutral-200 px-4 md:px-6">
          {!busy && (
            <Button variant="ghost" size="sm" className="-mr-4" onClick={() => startOver(restartFrom)}>
              {askCopy.startOver}
            </Button>
          )}
        </div>
      )}

      <section
        aria-label="Conversation"
        aria-busy={busy}
        data-clarity-mask="true"
        className="flex-1 space-y-6 px-4 py-6 md:px-6"
      >
        <OpeningRow />

        {messages.map((m) =>
          m.role === "user" ? (
            <UserRow key={m.id} ref={m.id === lastUserId ? lastUserRef : undefined} message={m} />
          ) : (
            <AssistantRow
              key={m.id}
              message={m}
              isLatest={m.id === lastAssistantId && !escalation}
              onFeedback={giveFeedback}
              onCopy={(variant) => trackAsk("ask_copy", { variant })}
            />
          ),
        )}

        {phase === "loading" && <LoadingRow reading={reading} />}

        {escalation && <EscalationPanel ref={escalationRef} tier={escalation} />}

        {notice && (
          <NoticePanel
            ref={noticeRef}
            notice={notice}
            onRetry={notice.kind === "error" && hasConversation ? retry : undefined}
          />
        )}

        {atTurnLimit && (
          <section className="border border-neutral-300 bg-neutral-100 p-6">
            <h2
              ref={turnLimitRef}
              tabIndex={-1}
              className={`${type.h3} text-ink focus-visible:outline-none`}
            >
              {askCopy.turnLimit.heading}
            </h2>
            <p className={`${type.body} mt-2 text-neutral-700`}>{askCopy.turnLimit.body}</p>
          </section>
        )}

        {/* Scroll margin keeps "jump to latest" from landing under the sticky composer. */}
        <div ref={endRef} aria-hidden="true" className="h-px scroll-mb-44" />
      </section>

      {!composerHidden && (
        <div className="sticky bottom-0 border-t border-neutral-200 bg-white px-4 py-3 md:px-6 md:py-4">
          {showJump && (
            <div className="absolute -top-12 right-4 md:right-6">
              <Button variant="secondary" size="sm" className="bg-white" onClick={jumpToLatest}>
                {askCopy.jumpToLatest} ↓
              </Button>
            </div>
          )}

          {!hasConversation && !notice && (
            <div className="mb-3">
              <StarterChips onPick={(q) => send(q, "starter")} />
            </div>
          )}

          <form
            data-clarity-mask="true"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft, "typed");
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              {askCopy.composer.label}
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                id={fieldId}
                rows={1}
                value={draft}
                placeholder={askCopy.composer.placeholder}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                enterKeyHint="send"
                aria-invalid={tooLong || undefined}
                aria-describedby={`${privacyId}${nearLimit ? ` ${counterId}` : ""}${tooLong ? ` ${errorId}` : ""}`}
                className="block min-h-[3.25rem] w-full resize-none border border-border-input bg-bg-elevated py-3.5 pl-4 pr-16 text-[0.9375rem] leading-[1.5] text-ink placeholder:text-neutral-600 transition-colors focus:border-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-600/40 aria-[invalid=true]:border-signal-error"
              />
              <div className="absolute bottom-1 right-1">
                {busy ? (
                  <button
                    type="button"
                    onClick={stop}
                    aria-label={askCopy.composer.stop}
                    className={`${iconButton} bg-ink text-white hover:bg-neutral-800`}
                  >
                    <StopIcon />
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label={askCopy.composer.send}
                    aria-disabled={tooLong || undefined}
                    className={`${iconButton} bg-cta-fill text-cta-text hover:bg-cta-fill-hover aria-disabled:cursor-not-allowed aria-disabled:opacity-40`}
                  >
                    <ArrowUpIcon />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-start justify-between gap-4">
              <p id={privacyId} className="text-xs leading-[1.5] text-neutral-600">
                {askCopy.composer.privacy}
              </p>
              {nearLimit && (
                <p
                  id={counterId}
                  className={`shrink-0 text-xs tabular-nums ${tooLong ? "font-medium text-signal-error" : "text-neutral-600"}`}
                >
                  {draft.length} / {MAX_INPUT_CHARS}
                </p>
              )}
            </div>
            {tooLong && (
              <p id={errorId} className="mt-1 text-xs text-signal-error">
                {askCopy.composer.tooLong}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
