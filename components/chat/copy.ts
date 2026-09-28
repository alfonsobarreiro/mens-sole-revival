/**
 * Every visitor-facing string on /ask lives here so the voice pass happens in
 * one file. House rules: plain US English, no em-dashes, no aphorisms, and none
 * of: leverage, seamless, robust, elevate, delve, crucial, journey (as metaphor).
 */

export const askCopy = {
  hero: {
    title: "Ask a foot question",
    body: "Alfred, your Sole Assistant.",
  },

  assistant: {
    name: "Alfred",
    opening:
      "Men over 40 look after everyone but themselves, and their feet come last. That's why this site exists. I'm Alfred. I answer from its guides and nothing else, I link the one I used, and I won't diagnose you. If something needs a doctor, I'll say so. What's going on with your feet?",
  },

  // The field answers the assistant's opening question, so it reads as a
  // reply, not a form prompt.
  composer: {
    // The accessible name matches the visible placeholder (WCAG 2.5.3).
    label: "Describe what's going on",
    placeholder: "Describe what's going on",
    send: "Send",
    stop: "Stop answer",
    /** Read by screen readers only, with the field. */
    hint: "Enter sends. Shift and Enter starts a new line.",
    /** Announced when Enter is pressed while an answer is still coming. */
    busy: "Alfred is still answering. Stop the answer to ask something new.",
    /** Read after the counter, e.g. "450 / 500 characters". */
    characters: "characters",
    privacy:
      "Alfred isn't a doctor. What you type goes to Claude, by Anthropic, and isn't saved. Leave out your name and contact details.",
    tooLong: "Keep it under 500 characters.",
  },

  /** Short chip labels; the full question is what gets sent. */
  starters: [
    { label: "Heel pain in the morning", question: "Why does my heel hurt when I get out of bed?" },
    { label: "Trimming toenails", question: "How should I trim my toenails?" },
    { label: "Desk job, tired feet", question: "I sit at a desk all day. What can I do for my feet?" },
    { label: "Knee pain from my feet?", question: "My knee hurts. Could it be my feet?" },
  ],

  loading: "Reading the guides…",
  /** Once retrieval has picked the guides, the wait names the first one. */
  loadingGuide: (title: string) => `Reading ${title}…`,
  srAnswerReady: "Answer ready.",
  stopped: "Stopped.",
  jumpToLatest: "Jump to latest",

  message: {
    you: "You",
    sources: "From the guides",
    copy: "Copy",
    /** Read by screen readers after "Copy", so each button says what it copies. */
    copyWhat: "answer",
    copied: "Copied",
    copiedAnnounce: "Answer copied.",
    copyFailed: "Couldn't copy. Select the text to copy it.",
    /** Read by screen readers after a link that opens a new tab. */
    newTab: "(opens in a new tab)",
  },

  uncertain: {
    heading: "I'm not sure about this one",
    body: "The guides only partly cover your question. Here is the closest thing I can tell you, and a question worth bringing to a doctor.",
    doctorPrep: "Print the doctor-prep checklist",
  },

  outOfScope: {
    heading: "That's outside what I cover",
    body: "I can help with pain anywhere in the foot or ankle, toes and toenails (including fungus), skin problems, swelling, circulation, numbness, shoe fit, and daily foot care.",
    browse: "Browse all guides",
  },

  feedback: {
    prompt: "Helpful?",
    yes: "Yes",
    no: "No",
    thanks: "Thanks. Noted.",
  },

  // Under each finished answer. The doctor line shows when the answer itself
  // points the reader to a clinician; the assessment line otherwise.
  nextStep: {
    body: "Not sure which problem is yours?",
    link: "Take the 5-minute assessment",
    doctorBody: "Seeing a podiatrist about this?",
    doctorLink: "Bring the doctor-prep checklist",
  },

  startOver: "New conversation",

  turnLimit: {
    heading: "This conversation has reached its limit",
    body: "Alfred handles 10 questions per conversation. Start a new one to keep going.",
  },

  escalation: {
    // Chest pain, trouble breathing, coughing blood. Shown instead of tier 1.
    emergency: {
      heading: "Chest pain or trouble breathing needs care now",
      body: "These can come from the heart or from a blood clot in the lungs, with or without a foot problem. Don't wait to see if it passes.",
      nextHeading: "What to do next",
      urgent:
        "Call 911 now if it's happening now, came on suddenly, or comes with sweating, nausea, or pain spreading to your arm, jaw, or back. Don't drive yourself. If it has been building over days or weeks, see a doctor today.",
      otherwise: "",
    },
    // Face, speech, one-sided weakness, sudden vision or balance loss (CDC,
    // B.E. F.A.S.T.). Its own copy because the 911 instructions differ.
    stroke: {
      heading: "These can be signs of a stroke",
      body: "A drooping face, slurred speech, weakness or numbness on one side, sudden trouble seeing, or a sudden loss of balance can mean a stroke. The treatments that work best have to start within about three hours, so don't wait to see if it passes.",
      nextHeading: "What to do next",
      urgent:
        "Call 911 now. Note the time the symptoms started and tell the dispatcher. Don't drive yourself or let someone drive you; paramedics can start treatment on the way.",
      otherwise:
        "If the symptoms came and went, get medical care right away anyway. A brief episode can be a mini-stroke (TIA), a warning that needs treatment.",
    },
    tier1: {
      heading: "This is something to check with a doctor today",
      body: "What you described is on the short list of foot symptoms that need in-person care before any self-treatment. A clinician can rule out the serious causes in one visit, and most of these are easier to treat when they're seen early.",
      nextHeading: "What to do next",
      urgent:
        "Call 911 if you also have chest pain or trouble breathing. Go to urgent care or an ER now if any of these are true: the foot is black, blue, or very pale; one calf or leg is suddenly swollen, warm, or painful; you have a fever; you can't put weight on it; redness is spreading; the pain came on suddenly and is severe; or you have diabetes and an open wound.",
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
    checklist: "Bring the doctor-prep checklist",
    checklistNote: "It's a printable one-pager that keeps a 20-minute visit focused.",
    stopped: "Alfred has stopped answering in this conversation.",
  },

  // The nav entry and the slide-in panel that hosts the same conversation.
  panel: {
    trigger: "Ask",
    triggerLabel: "Ask Alfred a foot question",
    subtitle: "Alfred, your Sole Assistant.",
    fullPage: "Open full page",
    close: "Close",
  },

  // Shown outside /ask: under every article and on assessment results.
  promo: {
    body: "Have a question this page didn't answer?",
    link: "Ask Alfred",
    note: "Answers come only from these guides, with a link to the one used.",
    fromAssessment: "Ask a question about your results →",
  },

  notice: {
    error: {
      heading: "Alfred hit a snag",
      body: "Something went wrong on our end. The guides are still here.",
      retry: "Try again",
    },
    rateLimited: {
      heading: "Alfred is pausing",
      body: "You've asked a lot in a short time. Try again in about 10 minutes, or start with the 5-minute assessment.",
    },
    resting: {
      heading: "Alfred is resting for the month",
      body: "This month's budget for answers is used up. Every guide is still here.",
    },
    guides: "Browse all guides",
    assessment: "Take the 5-minute assessment",
    checklist: "Print the doctor-prep checklist",
  },
} as const;
