import type { ChatSnapshot } from "./AskChat";
import type { AssistantMessage, ChatMessage, PreviewState } from "./types";

/**
 * Fixed conversations for design review at /ask?state=<name> (and
 * /ask?state=gallery for every state on one page). The page only honors the
 * parameter outside production, so none of this is reachable on the live site.
 */

const heelQuestion: ChatMessage = {
  id: "p1",
  role: "user",
  text: "Why does my heel hurt when I get out of bed?",
};

const heelAnswerText = `Sharp heel pain in your first few steps that eases within minutes is the classic pattern of plantar fasciitis. The band of tissue under your foot tightens overnight, and those first steps stretch it before it has warmed up.

What the guides suggest:

- Stretch your calf and the bottom of your foot **before** you stand up.
- Wear supportive shoes in the house instead of going barefoot on hard floors.
- Add the three strength moves three times a week once the morning pain starts to ease.

Give it four weeks of steady work. If the pain is no better by then, or it gets worse, see a podiatrist.`;

const heelAnswer: AssistantMessage = {
  id: "p2",
  role: "assistant",
  variant: "answer",
  text: heelAnswerText,
  sources: [
    {
      title: "Heel Pain First Thing in the Morning",
      url: "/guides/heel-pain-first-thing-in-the-morning",
    },
    {
      title: "Plantar Fasciitis Exercises for Men Over 40",
      url: "/guides/plantar-fasciitis-exercises-for-men-over-40",
    },
  ],
};

const uncertainAnswer: AssistantMessage = {
  id: "p2",
  role: "assistant",
  variant: "uncertain",
  text: `The guides don't cover gout. The closest thing they cover is big-toe stiffness from joint wear (hallux limitus), which builds slowly over months and feels worst when you push off.

Gout usually behaves differently, so I can't tell you which one you have.

A question to bring to your doctor: "Could this be gout, and is a uric acid test worth doing?"`,
  sources: [
    {
      title: "Big Toe Stiffness in Men Over 40",
      url: "/guides/big-toe-stiffness-in-men-over-40",
    },
  ],
};

const user = (text: string): ChatMessage => ({ id: "p1", role: "user", text });

function longConversation(): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (let i = 1; i <= 10; i++) {
    out.push({ id: `q${i}`, role: "user", text: `Example question ${i}` });
    out.push({
      id: `a${i}`,
      role: "assistant",
      variant: "answer",
      text: `Example answer ${i}.`,
      sources: heelAnswer.sources.slice(0, 1),
    });
  }
  return out;
}

const idle = { phase: "idle", escalation: null, notice: null } as const;

export function previewSnapshot(state: PreviewState): ChatSnapshot {
  switch (state) {
    case "empty":
      return { ...idle, messages: [] };
    case "loading":
      return { ...idle, phase: "loading", messages: [heelQuestion] };
    case "streaming":
      return {
        ...idle,
        phase: "streaming",
        messages: [
          heelQuestion,
          { ...heelAnswer, text: heelAnswerText.slice(0, 212), streaming: true },
        ],
      };
    case "answer":
      return { ...idle, messages: [heelQuestion, heelAnswer] };
    case "uncertain":
      return {
        ...idle,
        messages: [user("Can gout cause pain in my big toe?"), uncertainAnswer],
      };
    case "scope":
      return {
        ...idle,
        messages: [
          user("What's the best mattress for back pain?"),
          { id: "p2", role: "assistant", variant: "out_of_scope", text: "", sources: [] },
        ],
      };
    case "redflag1":
      return {
        ...idle,
        escalation: "tier1",
        messages: [user("I'm diabetic and I have an open blister on my heel")],
      };
    case "redflag2":
      return {
        ...idle,
        escalation: "tier2",
        messages: [user("I have a dark streak under my big toenail")],
      };
    case "redflag3":
      return {
        ...idle,
        escalation: "tier3",
        messages: [user("I've stretched every day for three months and my heel still hurts")],
      };
    case "error":
      return { ...idle, notice: { kind: "error" }, messages: [heelQuestion] };
    case "ratelimit":
      return { ...idle, notice: { kind: "rate_limited" }, messages: [heelQuestion] };
    case "resting":
      return { ...idle, notice: { kind: "resting" }, messages: [] };
    case "turnlimit":
      return { ...idle, messages: longConversation() };
  }
}
