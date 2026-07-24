import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import InlineNewsletterForm from "@/components/InlineNewsletterForm";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "The 5-Minute Foot Check for Men Over 40",
  description:
    "A printable self-check for men over 40. Same questions the assessment asks, organized by section. Yours to keep, print, or send to a doctor.",
  alternates: { canonical: "/foot-check" },
  openGraph: {
    title: "The 5-Minute Foot Check for Men Over 40",
    description:
      "A printable self-check for men over 40. Same questions the assessment asks, organized by section.",
    url: "/foot-check",
    type: "article",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Lead magnet content — kept in sync with app/assessment/page.tsx `steps`.
// This is the printable, non-personalized version of the assessment: a
// checklist a man can print out, mark up, and take to a podiatrist. Same
// question text so the two experiences reinforce each other.
//
// TODO: extract app/assessment/page.tsx `steps` array into lib/assessment-content.ts
// so both surfaces share a single source of truth. Deferred to avoid touching
// the 500-line assessment page mid-refactor.
// ─────────────────────────────────────────────────────────────────────────────

interface ChecklistSection {
  section: string;
  title: string;
  subtitle: string;
  items: string[];
  interpret: string;
}

const CHECKLIST: ChecklistSection[] = [
  {
    section: "01",
    title: "Nail Health",
    subtitle:
      "Check both feet. Toenail problems are common and treatable. Most men just don't know what they're looking at.",
    items: [
      "Nails are thick, yellowed, white, or brittle",
      "Nails crumble or break easily at the edges",
      "One or more nails are lifting away from the nail bed",
      "Any nail has dark spots or streaks under it",
      "Big toenail curves into the skin at the sides",
      "Nails are growing unevenly or in a curved shape",
      "There is pain, redness, or discharge around any nail",
    ],
    interpret:
      "3+ checks likely points to fungal infection or an ingrown nail. Both are treatable.",
  },
  {
    section: "02",
    title: "Skin & Heels",
    subtitle:
      "Your heels have no oil glands. Cracking isn't a hygiene failure. It's biology. But it is fixable.",
    items: [
      "Heels have visible cracks or fissures (even shallow ones)",
      "Skin on heels or balls of feet is hard, calloused, or rough",
      "Skin peels between or around toes (athlete's foot pattern)",
      "There is redness, scaling, or itching between toes",
      "Heels crack and bleed during dry months or after activity",
      "Skin on the soles feels tight or pulls when flexing the foot",
    ],
    interpret:
      "2+ checks: a daily emollient routine after your shower solves most of this in 2 to 3 weeks.",
  },
  {
    section: "03",
    title: "Pain & Inflammation",
    subtitle: "Foot pain is information. Where it hurts tells you what's causing it.",
    items: [
      "Sharp heel pain with the first steps in the morning (then eases)",
      "Burning or aching in the arch during or after standing",
      "Ball-of-foot pain when walking or wearing dress shoes",
      "Any joint in the foot is swollen, red, or warm to touch",
      "Pain in the big toe joint, especially after rich food or alcohol",
      "General aching in both feet by end of day",
    ],
    interpret:
      "Morning heel pain that eases after a few minutes is the classic plantar fasciitis pattern. Big toe swelling with warmth after eating is gout. See a doctor for that one.",
  },
  {
    section: "04",
    title: "Alignment & Structure",
    subtitle:
      "Your toes set the foundation. Misalignment doesn't stay in your feet. It travels up to your knees, hips, and lower back.",
    items: [
      "Big toe leans toward the second toe (early bunion formation)",
      "Lesser toes (2nd to 4th) curl downward when you relax your foot",
      "You have corns or calluses on the tops of bent toes",
      "You feel stiffness or limited movement in your big toe joint",
      "Your feet turn outward when you walk (duck-footed gait)",
    ],
    interpret:
      "Alignment issues compound over years. Toe spreader exercises and footwear changes early can slow or reverse drift.",
  },
  {
    section: "05",
    title: "Footwear Fit",
    subtitle: "The most upstream variable. Most foot problems trace back here.",
    items: [
      "Toes feel compressed when shoes are laced or buckled",
      "Haven't had feet measured in the last 5 years",
      "Shoe width pinches the widest part of your foot",
      "Your heel slips out of the back when you walk",
      "You wear the same size you've worn since your 20s",
    ],
    interpret:
      "Feet change shape and size as you age. If you haven't been measured in a few years, you probably aren't in the right size.",
  },
];

const TOTAL_ITEMS = CHECKLIST.reduce((n, s) => n + s.items.length, 0);

export default function FootCheckPage() {
  return (
    <SiteLayout>
      {/* ── Hero ── */}
      <section className="border-b border-neutral-200 bg-brand-900 py-16 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">
              The lead-magnet
            </p>
            <h1 className={`mt-3 ${type.h1} text-white`}>
              The 5-minute foot check for men over 40.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              {TOTAL_ITEMS} questions across 5 sections. Print it, mark it up,
              or take it to your next doctor visit. This is the same self-check
              the on-site assessment uses, just quieter and on paper.
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
                Take the assessment instead →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── How to use ── */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-10 print:hidden">
        <Container>
          <div className="max-w-3xl">
            <p className={`${type.overline} text-neutral-500`}>How to use it</p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">
              Read each item. Mark the ones that apply to you. When you finish
              a section, read the short interpretation line. It tells you
              whether this section is worth acting on now, or a routine will
              cover it. The whole thing takes about five minutes.
            </p>
          </div>
        </Container>
      </section>

      {/* ── The checklist ── */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-14">
            {CHECKLIST.map((s) => (
              <div
                key={s.section}
                className="break-inside-avoid border-t border-neutral-200 pt-8"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl font-bold text-accent-500">
                    {s.section}
                  </span>
                  <h2 className={`${type.h2} text-brand-900`}>{s.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {s.subtitle}
                </p>

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

                <p className="mt-6 rounded bg-brand-50 px-4 py-3 text-sm italic leading-6 text-brand-900">
                  <span className="font-bold not-italic">How to read this:</span>{" "}
                  {s.interpret}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Footer CTA — only on screen, hidden from print ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-14 md:py-20 print:hidden">
        <Container>
          <div className="mx-auto max-w-2xl">
            <InlineNewsletterForm
              heading="Get the printable version by email."
              body="One-tap link to this page in your inbox, so you have it when you need it. Plus the occasional new guide, review, or routine."
              cta="Send me the link"
            />
          </div>
        </Container>
      </section>

      {/* ── Print-only footer — attribution and URL ── */}
      <div className="hidden print:block print:mt-8 print:border-t print:border-neutral-300 print:pt-4 print:text-center print:text-xs print:text-neutral-500">
        <p>Men's Sole Revival · menssolerevival.com/foot-check</p>
        <p className="mt-1">
          This is a self-check, not medical advice. If you're worried, see a
          podiatrist.
        </p>
      </div>

      {/* Inline script — attaches window.print() to the button.
          Kept inline so the page stays a Server Component. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.print-button');if(b){b.addEventListener('click',function(){window.print()})}})`,
        }}
      />
    </SiteLayout>
  );
}
