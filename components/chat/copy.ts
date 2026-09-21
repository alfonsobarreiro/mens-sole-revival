/**
 * Every visitor-facing string on /ask lives here so the voice pass happens in
 * one file. House rules: plain US English, no em-dashes, no aphorisms, and none
 * of: leverage, seamless, robust, elevate, delve, crucial, journey (as metaphor).
 */

export const askCopy = {
  hero: {
    title: "Ask a foot question",
    body: "Answers come only from the guides on this site, and each one links to the guide it used. The assistant can't diagnose you. It will tell you when something needs a doctor.",
  },

  composer: {
    label: "Your question",
    placeholder: "For example: why does my heel hurt when I get out of bed?",
    privacy:
      "Leave out your name and contact details. Your question is sent to an AI model (Claude, by Anthropic) to write the answer. This site doesn't save it.",
    keys: "Enter to send. Shift + Enter for a new line.",
    submit: "Ask",
    tooLong: "Keep it under 500 characters.",
  },

  empty: {
    heading: "Not sure what to ask?",
    starters: [
      "Why does my heel hurt when I get out of bed?",
      "How should I trim my toenails?",
      "I sit at a desk all day. What can I do for my feet?",
      "My knee hurts. Could it be my feet?",
    ],
  },

  loading: "Reading the guides…",
  srAnswerReady: "Answer ready.",

  message: {
    youAsked: "You asked",
    answer: "Answer",
    sources: "From the guide:",
    sourcesPlural: "From these guides:",
  },

  uncertain: {
    heading: "I'm not sure about this one",
    body: "The guides only partly cover your question. Here is the closest thing I can tell you, and a question worth bringing to a doctor.",
    doctorPrep: "Print the doctor-prep checklist",
  },

  outOfScope: {
    heading: "That's outside what I cover",
    body: "I can help with heel and arch pain, ball-of-foot pain, Achilles pain, big-toe stiffness, toenails, cracked heels, shoe fit, and daily foot-care routines.",
    browse: "Browse all guides",
  },

  feedback: {
    prompt: "Was this helpful?",
    yes: "Yes",
    no: "No",
    thanks: "Thanks. Noted.",
  },

  nextStep: {
    body: "Not sure which problem is yours?",
    link: "Take the 5-minute assessment",
  },

  startOver: "Start a new conversation",

  turnLimit: {
    heading: "This conversation has reached its limit",
    body: "The assistant handles 10 questions at a time. Start a new conversation to keep going.",
  },

  escalation: {
    tier1: {
      heading: "This is something to check with a doctor today",
      body: "What you described is on the short list of foot symptoms that need in-person care before any self-treatment. That doesn't mean it's serious. When it is serious, waiting is what turns a fixable problem into a hard one.",
      nextHeading: "What to do next",
      urgent:
        "Go to urgent care or an ER now if any of these are true: the foot is black, blue, or very pale; you have a fever; you can't put weight on it; redness is spreading; the pain came on suddenly and is severe; or you have diabetes and an open wound.",
      otherwise:
        "Otherwise, call a podiatrist and ask for a same-day or next-day appointment. Many keep slots for urgent problems.",
    },
    tier2: {
      heading: "This is worth a clinician visit this week",
      body: "What you described isn't an emergency, but it's the kind of symptom that should be looked at in person rather than treated at home. A podiatrist or your regular doctor can sort it out in one visit.",
      nextHeading: "What to do next",
      urgent:
        "Book a podiatrist or your regular doctor within the next few days. If it gets worse before then (spreading redness, fever, severe pain, or you can't put weight on the foot), go to urgent care.",
      otherwise: "",
    },
    tier3: {
      heading: "A podiatrist should look at this",
      body: "You've given home care a fair try. When a problem holds on this long, the next useful step is an exam, not another routine.",
      nextHeading: "What to do next",
      urgent: "Book a podiatrist visit within the next week or two.",
      otherwise: "",
    },
    checklist: "Bring the doctor-prep checklist",
    checklistNote: "It's a printable one-pager that keeps a 20-minute visit focused.",
    stopped: "The assistant has stopped answering in this conversation.",
  },

  // Shown outside /ask: under every article and on assessment results.
  promo: {
    body: "Have a question this page didn't answer?",
    link: "Ask the assistant",
    note: "It answers only from these guides and links to the one it used.",
    fromAssessment: "Ask a question about your results →",
  },

  notice: {
    error: {
      heading: "The assistant hit a snag",
      body: "Something went wrong on our end. The guides are still here.",
      retry: "Try again",
    },
    rateLimited: {
      heading: "The assistant is pausing",
      body: "You've asked a lot in a short time. Try again in about 10 minutes, or start with the 5-minute assessment.",
    },
    resting: {
      heading: "The assistant is resting for the month",
      body: "It has answered as many questions as its budget allows. Every guide is still here.",
    },
    guides: "Browse all guides",
    assessment: "Take the 5-minute assessment",
  },
} as const;
