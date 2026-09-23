import Anthropic from "@anthropic-ai/sdk";
import { checkBotId } from "botid/server";
import { EmbeddingError, embedTexts } from "@/lib/chat/embed";
import index from "@/lib/chat/embeddings.json";
import { MAX_INPUT_CHARS, MAX_TURNS } from "@/lib/chat/limits";
import { classifyRedFlag } from "@/lib/chat/red-flags";
import {
  classifyRetrievalConfidence,
  formatContext,
  retrieveTopK,
  sourcesFromHits,
  type EmbeddedChunk,
} from "@/lib/chat/retrieve";
import { CHATBOT_SYSTEM_PROMPT, buildContextMessage } from "@/lib/chat/system-prompt";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ask
//
// Order of operations, cheapest and safest first:
//   1. Same-site + bot check, then input limits
//   2. Red-flag triage (regex, free). A match ends the request here.
//   3. Embed the question, find the closest guide passages
//   4. Weak match? Decline without calling the model (costs nothing)
//   5. Open the stream, name the guides, then stream the answer from Haiku 4.5
//
// Privacy: nothing about the conversation is stored or logged. Logs carry
// error types and status codes only, never message text.
//
// Response contract is documented in components/chat/AskChat.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "claude-haiku-4-5";
const MAX_OUTPUT_TOKENS = 1024; // replies are capped near 200 words; this is the cost ceiling
const HISTORY_MESSAGES = 6; // prior turns sent to the model, to bound cost
const MAX_BODY_BYTES = 32_000;
// A reply capped at 1024 output tokens cannot exceed ~4,500 characters, so a
// replayed assistant turn longer than this was never written by the model.
const MAX_ASSISTANT_CHARS = 5000;

const chunks = (index as unknown as { chunks: EmbeddedChunk[] }).chunks;

/**
 * House style bans em-dashes and models slip them in anyway, so the stream is
 * cleaned on the way out rather than trusting the prompt. Trailing commas and
 * spaces are held back one chunk so a dash split across chunks still comes out
 * as a single ", ".
 */
function createDashFilter() {
  let carry = "";
  return (text: string, flush = false): string => {
    let s = (carry + text).replace(/\s*\u2014\s*/g, ", ").replace(/,\s*,/g, ",").replace(/, {2,}/g, ", ");
    if (flush) {
      carry = "";
      return s.replace(/[,\s]+$/, "");
    }
    const tail = s.match(/[,\s]+$/)?.[0] ?? "";
    carry = tail;
    s = s.slice(0, s.length - tail.length);
    return s;
  };
}

type WireMessage = { role: "user" | "assistant"; content: string };

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const resting = () => json({ code: "resting" }, 503);
const snag = () => json({ code: "error" }, 503);

function parseMessages(body: unknown): WireMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TURNS * 2) return null;

  const messages: WireMessage[] = [];
  for (const m of raw) {
    if (
      (m?.role !== "user" && m?.role !== "assistant") ||
      typeof m?.content !== "string" ||
      m.content.trim() === ""
    ) {
      return null;
    }
    // Visitor text is capped at the composer limit; assistant text gets headroom.
    const cap = m.role === "user" ? MAX_INPUT_CHARS : MAX_ASSISTANT_CHARS;
    if (m.content.length > cap) return null;
    messages.push({ role: m.role, content: m.content });
  }

  if (messages[messages.length - 1].role !== "user") return null;
  if (messages.filter((m) => m.role === "user").length > MAX_TURNS) return null;
  return messages;
}

export async function POST(request: Request) {
  // 1. Same-site only. Browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameSite = false;
    try {
      sameSite = new URL(origin).host === request.headers.get("host");
    } catch {
      // "null" (sandboxed frames, some redirects) or malformed: not same-site.
    }
    if (!sameSite) return json({ code: "forbidden" }, 403);
  }

  // Fail closed: if the bot check itself cannot run, the visitor gets the
  // generic notice rather than a raw 500, and the model is never called.
  let isBot = true;
  try {
    isBot = (await checkBotId()).isBot;
  } catch (err) {
    console.error("[ask] bot check unavailable", { type: err instanceof Error ? err.name : typeof err });
    return snag();
  }
  if (isBot) return json({ code: "forbidden" }, 403);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ code: "too_large" }, 413);

  // Chunked requests carry no Content-Length, so the cap is also applied to
  // the bytes actually read, before anything is parsed.
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return json({ code: "too_large" }, 413);
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    body = null;
  }
  const messages = parseMessages(body);
  if (!messages) return json({ code: "bad_request" }, 400);

  const question = messages[messages.length - 1].content.trim();

  // 2. Red flags. The page checks too; the server never trusts the client.
  const flag = classifyRedFlag(question);
  if (flag) return json({ type: "red_flag", tier: flag.tier });

  // 3. Retrieval. A short follow-up ("what about at night?") only makes sense
  //    next to the question before it, so both go into the search text.
  const previousQuestion = messages
    .slice(0, -1)
    .reverse()
    .find((m) => m.role === "user")?.content;
  const searchText = previousQuestion ? `${previousQuestion}\n${question}` : question;

  let queryEmbedding: number[];
  try {
    const { vectors } = await embedTexts([searchText]);
    queryEmbedding = vectors[0];
  } catch (err) {
    const status = err instanceof EmbeddingError ? err.status : 0;
    console.error("[ask] embedding failed", { status });
    // 402 = the gateway key's monthly budget is spent.
    return status === 402 ? resting() : snag();
  }

  const hits = retrieveTopK({ queryEmbedding, chunks, k: 4 });
  const confidence = classifyRetrievalConfidence(hits);

  // 4. Nothing close in the guides: decline without spending a model call.
  if (confidence === "low") return json({ type: "out_of_scope" });

  const variant = confidence === "high" ? "answer" : "uncertain";
  const sources = sourcesFromHits(hits);

  // 5. Ask the model. The final user turn carries the context and the question.
  const history = messages.slice(0, -1).slice(-HISTORY_MESSAGES);
  while (history.length > 0 && history[0].role !== "user") history.shift();

  const modelMessages: Anthropic.MessageParam[] = [
    ...history,
    {
      role: "user",
      content: buildContextMessage({
        retrievedContext: formatContext(hits),
        userMessage: question,
        weakMatch: variant === "uncertain",
      }),
    },
  ];

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[ask] ANTHROPIC_API_KEY is not set");
    return snag();
  }

  const client = new Anthropic({ maxRetries: 1, timeout: 25_000 });
  const encoder = new TextEncoder();
  const line = (event: unknown) => encoder.encode(`${JSON.stringify(event)}\n`);

  // The stream opens before the model is called so the page can name the guide
  // being read during the slowest part of the wait. A model failure after this
  // point travels as a notice event, since the status is already 200.
  let stream: Awaited<ReturnType<typeof openStream>> | null = null;

  const bodyStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(line({ type: "meta", variant, sources }));

      let opened: Awaited<ReturnType<typeof openStream>>;
      try {
        opened = await openStream(client, modelMessages, request.signal);
      } catch (err) {
        controller.enqueue(line({ type: "notice", kind: noticeKind(err) }));
        controller.close();
        return;
      }
      stream = opened;

      const clean = createDashFilter();
      let sentText = false;
      let stopReason: string | null = null;

      try {
        for await (const event of opened) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = clean(event.delta.text);
            if (text) {
              sentText = true;
              controller.enqueue(line({ type: "delta", text }));
            }
          } else if (event.type === "message_delta") {
            stopReason = event.delta.stop_reason;
          }
        }
        const rest = clean("", true);
        if (rest) controller.enqueue(line({ type: "delta", text: rest }));
        // A refusal or an empty reply has nothing worth showing.
        const ok = sentText && stopReason !== "refusal";
        controller.enqueue(line({ type: ok ? "done" : "error" }));
      } catch {
        if (!request.signal.aborted) {
          console.error("[ask] stream interrupted");
          controller.enqueue(line({ type: "error" }));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream?.controller.abort();
    },
  });

  return new Response(bodyStream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

/** Which notice the page shows for a failed model call. Logs carry status only. */
function noticeKind(err: unknown): "rate_limited" | "resting" | "error" {
  if (err instanceof Anthropic.RateLimitError) {
    console.error("[ask] model rate limited");
    return "rate_limited";
  }
  if (err instanceof Anthropic.PermissionDeniedError) {
    console.error("[ask] model permission denied", { type: err.type });
    return "resting";
  }
  if (err instanceof Anthropic.APIError) {
    console.error("[ask] model error", { status: err.status, type: err.type });
    // 402 billing_error = credits or the workspace spend limit are used up.
    return err.status === 402 ? "resting" : "error";
  }
  console.error("[ask] model connection failed");
  return "error";
}

function openStream(client: Anthropic, messages: Anthropic.MessageParam[], signal: AbortSignal) {
  return client.messages.create(
    {
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.2,
      system: CHATBOT_SYSTEM_PROMPT,
      messages,
      stream: true,
    },
    { signal },
  );
}
