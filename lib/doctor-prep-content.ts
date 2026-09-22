/**
 * The doctor-visit prep checklist, as data.
 *
 * Rendered by app/doctor-prep/page.tsx and read by scripts/build-embeddings.ts,
 * so the assistant's search index carries the same words the page shows.
 */

export interface Section {
  eyebrow: string;
  title: string;
  items: string[];
}

export const BEFORE_VISIT: Section = {
  eyebrow: "01",
  title: "Bring this with you",
  items: [
    "The two pairs of shoes you wear most days (yes, actually bring them)",
    "A list of everything you've tried already, and whether it helped or didn't",
    "Names + doses of any current medications, including OTC and supplements",
    "Notes on when symptoms started, what makes them worse, what makes them better",
    "Your assessment results from menssolerevival.com/assessment, if you took it",
    "This page, printed, with your relevant items checked off",
  ],
};

export const HOW_TO_DESCRIBE_PAIN: Section = {
  eyebrow: "02",
  title: "How to describe what you're feeling",
  items: [
    "Where it hurts (heel, arch, ball, big toe, top of foot, back of ankle)",
    "When it hurts (first steps in the morning, end of day, during activity, after)",
    "What kind of pain (sharp, burning, aching, throbbing, tight, pins-and-needles)",
    "How long it's been going on (weeks, months, years)",
    "How severe on a 1-10 scale, and how it's changed over time",
    "What makes it worse (specific activities, footwear, standing, weather)",
    "What makes it better (rest, ice, stretch, particular shoes)",
  ],
};

export const SYMPTOM_TALKING_POINTS: Section = {
  eyebrow: "03",
  title: "Symptom-specific talking points",
  items: [
    "Nails — visible change (color, thickness, lifting) for at least a few months.",
    "Skin & heels — where it is, how long, how severe, what you've tried.",
    "Pain — when it hurts, where it hurts, what eases it, what makes it worse.",
    "Alignment — visible toe drift, which toes, how long, whether it's getting worse.",
    "Footwear — what you wear most days, what hurts, what you're considering changing.",
    "Interpretive uncertainty — items you can't tell if they apply to you, that you want help interpreting in person.",
  ],
};

export const QUESTIONS_TO_ASK: Section = {
  eyebrow: "04",
  title: "Questions worth asking",
  items: [
    "What's the specific diagnosis, in plain language?",
    "What's the first-line treatment, and how long before I should expect to notice a change?",
    "If the first-line treatment doesn't work, what's the second option?",
    "Are there specific exercises or stretches I should do at home?",
    "What footwear features should I look for or avoid?",
    "What should I watch for that would mean I need to come back sooner?",
    "Are there imaging or lab tests worth doing now, or is that a later step?",
    "How often should I be seen for this going forward?",
  ],
};

export const AFTER_VISIT: Section = {
  eyebrow: "05",
  title: "Before you leave",
  items: [
    "Repeat back the diagnosis and plan in your own words, and ask if that's right.",
    "Get the plan in writing (or ask the front desk for the visit summary).",
    "Ask what to do if the plan doesn't work by the follow-up date.",
    "Book the follow-up before you leave the office.",
  ],
};

export const ALL_SECTIONS = [
  BEFORE_VISIT,
  HOW_TO_DESCRIBE_PAIN,
  SYMPTOM_TALKING_POINTS,
  QUESTIONS_TO_ASK,
  AFTER_VISIT,
];

export const TOTAL_ITEMS = ALL_SECTIONS.reduce((n, s) => n + s.items.length, 0);

export const DOCTOR_PREP_TITLE = "Doctor Visit Prep: What to Tell Your Podiatrist";

/** The checklist as markdown, for the assistant's search index. */
export function doctorPrepAsMarkdown(): string {
  const intro =
    "A printable one-page checklist for a podiatrist or doctor visit about your feet: what to bring, how to describe the pain, what to say about nails, skin, pain, alignment, and footwear, which questions to ask, and what to settle before you leave. Print it, check off what applies, and bring it to the appointment. Use it when you're preparing for a podiatrist appointment, wondering what to tell the doctor, or what to ask about a foot problem.";
  const sections = ALL_SECTIONS.map(
    (s) => `## ${s.title}\n\n${s.items.map((i) => `- ${i}`).join("\n")}`,
  );
  return [`# ${DOCTOR_PREP_TITLE}`, intro, ...sections].join("\n\n");
}
