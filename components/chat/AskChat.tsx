"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button, Textarea } from "@/components/ui";
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
  StarterQuestions,
  UserRow,
} from "./states";
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
 *   request   { messages: [{ role, content }] }
 *   200 JSON  { type: "red_flag", tier } | { type: "out_of_scope" }
 *   200 NDJSON stream, one event per line:
 *             { type: "meta", variant, sources } → { type: "delta", text }… → { type: "done" }
 *   429       rate limited
 *   503       { code: "resting" } when the monthly budget is spent
 */

export type ChatSnapshot = {
  messages: ChatMessage[];
  phase: Phase;
  escalation: RedFlagTier | null;
  notice: Notice | null;
};

const EMPTY: ChatSnapshot = { messages: [], phase: "idle", escalation: null, notice: null };

type StreamEvent =
  | { type: "meta"; variant?: string; sources?: unknown }
  | { type: "delta"; text?: string }
  | { type: "done" }
  | { type: "error" };

const TIERS: RedFlagTier[] = ["tier1", "tier2", "tier3"];

/** Sources render as internal links, so only same-site paths are accepted. */
function cleanSources(raw: unknown): Source[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (s): s is Source =>
      typeof s?.title === "string" &&
      typeof s?.url === "string" &&
      s.url.startsWith("/") &&
      !s.url.startsWith("//"),
  );
}

/** Screen readers get the answer as plain sentences, without markdown symbols. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*(?:[-*]|\d+[.)])\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,3}\s+/gm, "");
}

function toWire(history: ChatMessage[]) {
  return history
    .filter((m) => m.text.trim() !== "")
    .map((m) => ({ role: m.role, content: m.text }));
}

export default function AskChat({ initial = EMPTY }: { initial?: ChatSnapshot }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [phase, setPhase] = useState<Phase>(initial.phase);
  const [escalation, setEscalation] = useState<RedFlagTier | null>(initial.escalation);
  const [notice, setNotice] = useState<Notice | null>(initial.notice);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  const fieldId = useId();
  const privacyId = `${fieldId}-privacy`;
  const counterId = `${fieldId}-counter`;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const escalationRef = useRef<HTMLHeadingElement>(null);
  const noticeRef = useRef<HTMLHeadingElement>(null);
  const turnLimitRef = useRef<HTMLHeadingElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idCounter = useRef(0);

  // Focus and scroll are requested by event handlers and applied after the
  // render that follows, so nothing moves on first paint.
  const pendingFocus = useRef<"composer" | "escalation" | "notice" | "turnLimit" | null>(null);
  const pendingScroll = useRef(false);

  useEffect(() => {
    if (pendingScroll.current && lastUserRef.current) {
      pendingScroll.current = false;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      lastUserRef.current.scrollIntoView({
        block: "start",
        behavior: reduced ? "auto" : "smooth",
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

  const nextId = useCallback(() => `m${++idCounter.current}`, []);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const busy = phase !== "idle";
  const tooLong = draft.length > MAX_INPUT_CHARS;
  const atTurnLimit = !busy && !escalation && !notice && userTurns >= MAX_TURNS;
  const composerHidden =
    escalation !== null ||
    atTurnLimit ||
    notice?.kind === "rate_limited" ||
    notice?.kind === "resting";
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const lastUserId = [...messages].reverse().find((m) => m.role === "user")?.id;

  const fail = useCallback((next: Notice, partialId?: string | null) => {
    if (partialId) setMessages((prev) => prev.filter((m) => m.id !== partialId));
    setPhase("idle");
    setStatus("");
    setNotice(next);
    pendingFocus.current = "notice";
    trackAsk("ask_notice", { kind: next.kind });
  }, []);

  const escalate = useCallback((tier: RedFlagTier, where: "client" | "server") => {
    abortRef.current?.abort();
    setPhase("idle");
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
        let variant: AssistantVariant = "answer";
        let sourceCount = 0;
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
              variant = event.variant === "uncertain" ? "uncertain" : "answer";
              const sources = cleanSources(event.sources);
              sourceCount = sources.length;
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
              setPhase("streaming");
            } else if (event.type === "delta" && assistantId && event.text) {
              fullText += event.text;
              const id = assistantId;
              const text = fullText;
              setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));
            } else if (event.type === "done") {
              finished = true;
            } else if (event.type === "error") {
              throw new Error("stream error");
            }
          }
        }

        if (!finished || !assistantId || fullText.trim() === "") {
          throw new Error("stream ended early");
        }

        const id = assistantId;
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)));
        setPhase("idle");
        setStatus(
          `${askCopy.srAnswerReady} ${
            variant === "uncertain" ? `${askCopy.uncertain.heading}. ` : ""
          }${toPlainText(fullText)}`,
        );
        trackAsk("ask_answer_shown", { variant, source_count: sourceCount, turn });
        if (turn >= MAX_TURNS) trackAsk("ask_turn_limit");
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

    if (via === "starter") pendingFocus.current = "composer";
    void request(history);
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    send(draft, "typed");
  };

  const hasConversation = messages.length > 0;
  const restartFrom = escalation ? "escalation" : notice ? notice.kind : atTurnLimit ? "turn_limit" : "conversation";

  return (
    <div className="border border-neutral-200 bg-white">
      <p role="status" className="sr-only">
        {status}
      </p>

      {hasConversation && (
        <section aria-label="Conversation" aria-busy={busy} className="space-y-8 p-6 md:p-8">
          {messages.map((m) =>
            m.role === "user" ? (
              <UserRow key={m.id} ref={m.id === lastUserId ? lastUserRef : undefined} message={m} />
            ) : (
              <AssistantRow
                key={m.id}
                message={m}
                isLatest={m.id === lastAssistantId && !escalation}
                onFeedback={giveFeedback}
              />
            ),
          )}
          {phase === "loading" && <LoadingRow />}
        </section>
      )}

      {escalation && (
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <EscalationPanel ref={escalationRef} tier={escalation} />
        </div>
      )}

      {notice && (
        <div className={`px-6 pb-6 md:px-8 md:pb-8 ${hasConversation ? "" : "pt-6 md:pt-8"}`}>
          <NoticePanel
            ref={noticeRef}
            notice={notice}
            onRetry={notice.kind === "error" && hasConversation ? retry : undefined}
          />
        </div>
      )}

      {atTurnLimit && (
        <div className="px-6 pb-6 md:px-8 md:pb-8">
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
        </div>
      )}

      {!composerHidden && (
        <form
          className={`p-6 md:p-8 ${hasConversation ? "border-t border-neutral-200" : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            send(draft, "typed");
          }}
        >
          <Textarea
            ref={textareaRef}
            id={fieldId}
            label={askCopy.composer.label}
            placeholder={askCopy.composer.placeholder}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            error={tooLong ? askCopy.composer.tooLong : undefined}
            // Textarea wires its own error id; privacy note and counter are added here.
            aria-describedby={`${privacyId} ${counterId}${tooLong ? ` ${fieldId}-error` : ""}`}
            enterKeyHint="send"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <Button
              type="submit"
              aria-disabled={busy || tooLong}
              className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            >
              {askCopy.composer.submit}
            </Button>
            <p className="text-xs text-neutral-600">
              <span className="hidden sm:inline">{askCopy.composer.keys} </span>
              <span id={counterId} className={tooLong ? "font-medium text-signal-error" : undefined}>
                {draft.length} / {MAX_INPUT_CHARS}
              </span>
            </p>
          </div>

          <p id={privacyId} className="mt-4 max-w-prose text-xs leading-[1.5] text-neutral-600">
            {askCopy.composer.privacy}
          </p>
        </form>
      )}

      {!hasConversation && !notice && (
        <div className="border-t border-neutral-200 p-6 md:p-8">
          <StarterQuestions onPick={(q) => send(q, "starter")} />
        </div>
      )}

      {hasConversation && !busy && (
        <div className="border-t border-neutral-200 px-6 py-4 md:px-8">
          <Button variant="link" className="text-[0.8125rem]" onClick={() => startOver(restartFrom)}>
            {askCopy.startOver}
          </Button>
        </div>
      )}
    </div>
  );
}
