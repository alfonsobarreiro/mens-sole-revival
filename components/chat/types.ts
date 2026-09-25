export type Source = { title: string; url: string };

export type AssistantVariant = "answer" | "uncertain" | "out_of_scope";

export type UserMessage = { id: string; role: "user"; text: string };

export type AssistantMessage = {
  id: string;
  role: "assistant";
  text: string;
  variant: AssistantVariant;
  sources: Source[];
  streaming?: boolean;
  feedback?: "up" | "down";
  /** Server signature over `text`; only signed turns go back as history. */
  sig?: string;
};

export type ChatMessage = UserMessage | AssistantMessage;

export type RedFlagTier = "tier1" | "tier2" | "tier3";

export type Notice =
  | { kind: "error" }
  | { kind: "rate_limited" }
  | { kind: "resting" };

export type Phase = "idle" | "loading" | "streaming";

/** States the page can be opened in for design review (non-production only). */
export const PREVIEW_STATES = [
  "empty",
  "loading",
  "streaming",
  "answer",
  "uncertain",
  "scope",
  "redflag1",
  "redflag2",
  "redflag3",
  "error",
  "ratelimit",
  "resting",
  "turnlimit",
] as const;

export type PreviewState = (typeof PREVIEW_STATES)[number];
