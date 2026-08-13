import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import InlineNewsletterForm from "@/components/InlineNewsletterForm";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Doctor Visit Prep: What to Tell Your Podiatrist",
  description:
    "A printable one-pager for men over 40 to bring to a podiatrist visit. What to say, what to ask, what to bring — organized by symptom so you don't leave the exam room having forgotten the important stuff.",
  alternates: { canonical: "/doctor-prep" },
  openGraph: {
    title: "Doctor Visit Prep: What to Tell Your Podiatrist",
    description:
      "Printable one-pager for men over 40. What to say, what to ask, what to bring.",
    url: "/doctor-prep",
    type: "article",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Doctor-visit prep — public, print-optimized page.
//
// Extracts the "Talk to a professional" prep pattern from the assessment
// into a standalone tool. Same voice, same audience, but reachable by
// anyone (not gated behind completing the assessment). Printable checklist
// they can mark up + bring to their appointment.
//
// Content is intentionally static (no interactivity) — this reduces cognitive
// load in a stressful context (upcoming doctor visit) and makes the whole
// page work in print without JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

interface Section {
  eyebrow: string;
  title: string;
  items: string[];
}

const BEFORE_VISIT: Section = {
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

const HOW_TO_DESCRIBE_PAIN: Section = {
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

const SYMPTOM_TALKING_POINTS: Section = {
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

const QUESTIONS_TO_ASK: Section = {
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

const AFTER_VISIT: Section = {
  eyebrow: "05",
  title: "Before you leave",
  items: [
    "Repeat back the diagnosis and plan in your own words, and ask if that's right.",
    "Get the plan in writing (or ask the front desk for the visit summary).",
    "Ask what to do if the plan doesn't work by the follow-up date.",
    "Book the follow-up before you leave the office.",
  ],
};

const ALL_SECTIONS = [
  BEFORE_VISIT,
  HOW_TO_DESCRIBE_PAIN,
  SYMPTOM_TALKING_POINTS,
  QUESTIONS_TO_ASK,
  AFTER_VISIT,
];

const TOTAL_ITEMS = ALL_SECTIONS.reduce((n, s) => n + s.items.length, 0);

export default function DoctorPrepPage() {
  return (
    <SiteLayout>
      {/* ── Hero ── */}
      <section className="border-b border-neutral-200 bg-brand-900 py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">
              The doctor-visit prep tool
            </p>
            <h1 className={`mt-3 ${type.h1} text-white`}>
              Don't walk out having forgotten the important stuff.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              A printable one-pager for men over 40. {TOTAL_ITEMS} items across 5
              sections: what to bring, how to describe what you're feeling, which
              symptom-specific things to raise, questions worth asking, and how
              to leave the visit with a real plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="print-button inline-flex items-center gap-2 rounded bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 active:bg-accent-700"
              >
                Print or save as PDF
              </button>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Take the assessment first →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── How to use ── */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-10 print:hidden">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm leading-7 text-neutral-700">
              Read through the checklist. Mark the items that apply to your
              situation. Print the page and bring it to your appointment. The
              boxes give you something to reference during the visit so you don't
              lose the thread when the podiatrist starts asking questions.
            </p>
          </div>
        </Container>
      </section>

      {/* ── The checklist ── */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-14">
            {ALL_SECTIONS.map((s) => (
              <div
                key={s.eyebrow}
                className="break-inside-avoid border-t border-neutral-200 pt-8"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl font-bold text-accent-500">
                    {s.eyebrow}
                  </span>
                  <h2 className={`${type.h2} text-brand-900`}>{s.title}</h2>
                </div>

                <ul className="mt-6 space-y-3">
                  {s.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm leading-6 text-neutral-800"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-block h-4 w-4 flex-shrink-0 border border-neutral-400"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Related tools — hidden from print ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-14 md:py-20 print:hidden">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className={`${type.h2} text-brand-900`}>
              While you're here.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link
                href="/assessment"
                className="group block border border-neutral-200 bg-white p-5 transition hover:border-brand-300 hover:bg-neutral-50"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                  Take the assessment
                </p>
                <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-brand-900 group-hover:text-brand-600">
                  Bring specific answers to your doctor.
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  The 5-minute self-check flags what's actually going on so your
                  visit isn't a fishing expedition.
                </p>
              </Link>
              <Link
                href="/foot-check"
                className="group block border border-neutral-200 bg-white p-5 transition hover:border-brand-300 hover:bg-neutral-50"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                  Foot check checklist
                </p>
                <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-brand-900 group-hover:text-brand-600">
                  All the assessment questions, printable.
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Same questions the assessment asks, formatted for reading and
                  marking up on paper.
                </p>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-2xl border-t border-neutral-200 pt-10">
            <InlineNewsletterForm
              heading="Get updates when we publish new tools."
              body="Same list as the 5-minute foot check. One confirmation email, unsubscribe anytime."
              cta="Send it to me"
            />
          </div>
        </Container>
      </section>

      {/* ── Print-only footer ── */}
      <div className="hidden print:block print:mt-8 print:border-t print:border-neutral-300 print:pt-4 print:text-center print:text-xs print:text-neutral-500">
        <p>Men's Sole Revival · menssolerevival.com/doctor-prep</p>
        <p className="mt-1">
          This is a preparation guide, not medical advice. Your podiatrist's
          judgment supersedes anything on this page.
        </p>
      </div>

      {/* Inline print handler */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.print-button');if(b){b.addEventListener('click',function(){window.print()})}})`,
        }}
      />
    </SiteLayout>
  );
}
