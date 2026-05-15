"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";
import Container from "@/components/Container";
import Link from "next/link";
import { type } from "@/components/typography";
import { generateAssessmentPDF } from "@/lib/generateAssessmentPDF";
import { symptomRecommendations } from "@/lib/ecosystem";
import { staticReviews } from "@/lib/reviews";
import AssessmentFeedback from "@/components/AssessmentFeedback";

/** Maps assessment-section titles to the symptom key used by the
 * ecosystem recommendation map. The full assessment redesign (see
 * MSR-Assessment-Redesign.md) will replace this with symptom-first
 * triage as Step 0; for now this lets the current results screen
 * surface specific products tied to where the user flagged. */
const symptomKeyByTitle: Record<string, keyof typeof symptomRecommendations> = {
  "Nail Health": "nails",
  "Skin & Heels": "skin",
  "Pain & Inflammation": "pain",
  "Alignment & Structure": "alignment",
  "Footwear Fit": "footwear",
};

// ── Types ────────────────────────────────────────────────────

interface CheckItem {
  id: string;
  text: string;
}

interface Step {
  section: string;
  title: string;
  subtitle: string;
  callLabel: string;
  items: CheckItem[];
  guideHref: string;
  stat?: { value: string; label: string; source: string; sourceUrl: string };
  note?: string;
}

// ── Data ─────────────────────────────────────────────────────

const steps: Step[] = [
  {
    section: "01",
    title: "Nail Health",
    subtitle: "Check both feet. Toenail problems are extremely common and very treatable — most men just don't know what they're looking at.",
    callLabel: "Look for:",
    guideHref: "/learn?cat=Nail+Care",
    items: [
      { id: "n1", text: "Nails are thick, yellowed, white, or brittle" },
      { id: "n2", text: "Nails crumble or break easily at the edges" },
      { id: "n3", text: "One or more nails are lifting away from the nail bed" },
      { id: "n4", text: "Any nail has dark spots or streaks under it" },
      { id: "n5", text: "Big toenail curves into the skin at the sides" },
      { id: "n6", text: "Nails are growing unevenly or in a curved shape" },
      { id: "n7", text: "There is pain, redness, or discharge around any nail" },
    ],
    stat: {
      value: "8.57%",
      label: "of adults have toenail fungus. OTC treatments only cure 16–23% of cases.",
      source: "Gupta et al., Mycoses 2024",
      sourceUrl: "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725",
    },
    note: "3+ checks likely points to fungal infection or an ingrown nail. Both are treatable — the guide at the end points you in the right direction.",
  },
  {
    section: "02",
    title: "Skin & Heels",
    subtitle: "Your heels have no oil glands. Cracking isn't a hygiene failure — it's biology. But it is fixable.",
    callLabel: "Look for:",
    guideHref: "/learn?cat=Daily+Routine",
    items: [
      { id: "s1", text: "Heels have visible cracks or fissures (even shallow ones)" },
      { id: "s2", text: "Skin on heels or balls of feet is hard, calloused, or rough" },
      { id: "s3", text: "Skin peels between or around toes (athlete's foot pattern)" },
      { id: "s4", text: "There is redness, scaling, or itching between toes" },
      { id: "s5", text: "Heels crack and bleed during dry months or after activity" },
      { id: "s6", text: "Skin on the soles feels tight or pulls when flexing the foot" },
    ],
    stat: {
      value: "20–40%",
      label: "of adults experience cracked heel skin. Diabetic men: 2× the rate.",
      source: "National Foot Health Assessment / AAFP",
      sourceUrl: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
    },
    note: "2+ checks: a daily emollient routine after your shower solves most of this in 2–3 weeks.",
  },
  {
    section: "03",
    title: "Pain & Inflammation",
    subtitle: "Foot pain is information. Where it hurts tells you what's causing it.",
    callLabel: "Check all that apply:",
    guideHref: "/routines",
    items: [
      { id: "p1", text: "Sharp heel pain with the first steps in the morning (then eases)" },
      { id: "p2", text: "Burning or aching in the arch during or after standing" },
      { id: "p3", text: "Ball-of-foot pain when walking or wearing dress shoes" },
      { id: "p4", text: "Any joint in the foot is swollen, red, or warm to touch" },
      { id: "p5", text: "Pain in the big toe joint — especially after rich food or alcohol" },
      { id: "p6", text: "General aching in both feet by end of day" },
    ],
    stat: {
      value: "40–60",
      label: "is the peak age window for plantar fasciitis. About 1 million US visits per year.",
      source: "NIH / NCBI StatPearls",
      sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
    },
    note: "Morning heel pain that eases after a few minutes is the classic plantar fasciitis pattern. Big toe swelling with warmth after eating is gout — see a doctor for that one.",
  },
  {
    section: "04",
    title: "Alignment & Structure",
    subtitle: "Your toes set the foundation. Misalignment doesn't stay in your feet — it travels up to your knees, hips, and lower back.",
    callLabel: "Look for:",
    guideHref: "/learn?cat=Alignment",
    items: [
      { id: "a1", text: "Big toe leans toward the second toe (early bunion formation)" },
      { id: "a2", text: "Lesser toes (2nd–4th) curl downward when you relax your foot" },
      { id: "a3", text: "You have corns or calluses on the tops of bent toes" },
      { id: "a4", text: "You feel stiffness or limited movement in your big toe joint" },
      { id: "a5", text: "Your feet turn outward when you walk (duck-footed gait)" },
    ],
    stat: {
      value: "40–60%",
      label: "of your push-off force comes from the big toe. Restrict it and your knee compensates.",
      source: "PMC / Hallux Valgus Meta-Analysis 2023",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/",
    },
    note: "Alignment issues compound over years. Toe spreader exercises and footwear changes early can slow or reverse drift.",
  },
  {
    section: "05",
    title: "Footwear Fit",
    subtitle: "The most upstream variable. Most foot problems trace back here.",
    callLabel: "Quick fit check:",
    guideHref: "/learn?cat=Footwear+Fit",
    items: [
      { id: "f1", text: "Toes feel compressed when shoes are laced or buckled" },
      { id: "f2", text: "Haven't had feet measured in the last 5 years" },
      { id: "f3", text: "Shoe width pinches the widest part of your foot" },
      { id: "f4", text: "Your heel slips out of the back when you walk" },
      { id: "f5", text: "You wear the same size you've worn since your 20s" },
    ],
    stat: {
      value: "63–72%",
      label: "of adults wear shoes that don't properly fit their feet in length or width.",
      source: "PMC / Incorrectly Fitted Footwear (Systematic Review)",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
    },
    note: "Feet change shape and size as you age. If you haven't been measured in a few years, you probably aren't in the right size.",
  },
];

// ── Result tiers ──────────────────────────────────────────────

function getResult(total: number) {
  if (total <= 2)
    return {
      tier: "0–2 Flags",
      headline: "You're in pretty good shape.",
      body: "Nothing urgent. Build a 5-minute nightly routine — wash, dry, inspect, moisturize — and check your footwear fit. Come back in 3 months and see if anything changes.",
      cta: "Start with the 5-minute routine →",
      ctaHref: "/routines",
    };
  if (total <= 5)
    return {
      tier: "3–5 Flags",
      headline: "Worth addressing now.",
      body: "You have a few things worth paying attention to. Start with the item that's causing the most pain or the one that's most visible. One condition at a time beats doing nothing because it feels overwhelming.",
      cta: "Browse the guides →",
      ctaHref: "/learn",
    };
  return {
    tier: "6+ Flags",
    headline: "It's been building a while.",
    body: "See a podiatrist for the pain and structural issues — that's the right tool for those. Everything else (skin, nails, footwear) you can address yourself with the right information. Start there.",
    cta: "Read the guide for where to start →",
    ctaHref: "/learn",
  };
}

// ── Derive per-section breakdown ──────────────────────────────

function getSectionBreakdown(checked: Record<string, boolean>) {
  return steps
    .map((step) => {
      const count = step.items.filter((item) => checked[item.id]).length;
      return { title: step.title, count, guideHref: step.guideHref };
    })
    .filter((s) => s.count > 0);
}

// ── sessionStorage helpers ─────────────────────────────────────

const SS_KEY = "msr-assessment";

function saveState(step: number, checked: Record<string, boolean>) {
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify({ step, checked }));
  } catch {
    // sessionStorage may be unavailable in some contexts — fail silently
  }
}

function loadState(): { step: number; checked: Record<string, boolean> } | null {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Component ─────────────────────────────────────────────────

export default function AssessmentPage() {
  const [step, setStep] = useState(0); // 0 = intro, 1–5 = steps, 6 = results
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Restore from sessionStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setStep(saved.step);
      setChecked(saved.checked);
    }
    setHydrated(true);
  }, []);

  // Persist to sessionStorage on every change
  useEffect(() => {
    if (!hydrated) return;
    saveState(step, checked);
  }, [step, checked, hydrated]);

  const totalSteps = steps.length;
  const currentStep = steps[step - 1];
  const isIntro = step === 0;
  const isResults = step === totalSteps + 1;

  const totalFlags = Object.values(checked).filter(Boolean).length;
  const result = getResult(totalFlags);
  const sectionBreakdown = getSectionBreakdown(checked);

  const progress = step === 0 ? 0 : step === totalSteps + 1 ? 100 : Math.round((step / totalSteps) * 100);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, totalSteps + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    try { sessionStorage.removeItem(SS_KEY); } catch { /* noop */ }
    setStep(0);
    setChecked({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <SiteLayout>
      {/* ── Hero banner ── */}
      <section className="bg-brand-900 py-12 md:py-16">
        <Container>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-400">
            5-Minute Self-Check
          </p>
          <h1 className={`${type.displaySection} text-white`}>
            The Men's Foot Health Assessment
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
            Work through five sections. Check what applies. Get a clear picture of
            where you stand — and exactly where to start.
          </p>

          {/* Progress bar */}
          {!isIntro && (
            <div className="mt-8 max-w-md">
              <div className="mb-2 flex justify-between text-xs text-white/40">
                <span>
                  {isResults
                    ? "Complete"
                    : `Section ${step} of ${totalSteps}`}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-white/10">
                <div
                  className="h-1 bg-accent-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── Content ── */}
      <section className="min-h-[60vh] bg-neutral-50 py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl">

            {/* ── INTRO ── */}
            {isIntro && (
              <div>
                {/* Warning box with exit path */}
                <div className="mb-8 border border-accent-500/30 bg-accent-500/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                    See a doctor if:
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Open wounds not healing · Severe swelling or redness ·
                    Numbness or tingling · Diabetes + any foot wound · Suspected
                    fracture · Intense sudden pain
                  </p>
                  <p className="mt-3 text-xs text-neutral-400">
                    This assessment is for non-emergency self-awareness only. It is not a medical diagnosis.
                  </p>
                  <a
                    href="https://www.apma.org/find-a-podiatrist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600 underline underline-offset-2 hover:text-accent-700 transition"
                  >
                    Find a podiatrist near you →
                  </a>
                </div>

                {/* Stat row */}
                <div className="mb-10 grid grid-cols-3 divide-x divide-neutral-200 border border-neutral-200 bg-white">
                  {[
                    { value: "77%", label: "of men have foot pain annually", source: "APMA", sourceUrl: "https://www.apma.org/" },
                    { value: "1 in 3", label: "ever seek help for it", source: "APMA", sourceUrl: "https://www.apma.org/" },
                    { value: "63–72%", label: "wear the wrong shoe size", source: "PMC", sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/" },
                  ].map((s) => (
                    <div key={s.value} className="p-5 text-center">
                      <span className="block font-display text-3xl font-bold text-brand-900">
                        {s.value}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-neutral-500">
                        {s.label}
                      </span>
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
                      >
                        {s.source}
                      </a>
                    </div>
                  ))}
                </div>

                <p className="mb-3 text-sm leading-7 text-neutral-600">
                  Five sections. 30 questions total. Check anything that applies to
                  you right now — no wrong answers. At the end you'll get a clear
                  picture of where you stand and where to start.
                </p>

                <button
                  onClick={next}
                  className="mt-6 inline-flex items-center gap-2 bg-brand-900 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                >
                  Start the assessment →
                </button>
              </div>
            )}

            {/* ── STEP ── */}
            {!isIntro && !isResults && currentStep && (
              <div>
                {/* Section label + title */}
                <div className="mb-6">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-500">
                    Section {currentStep.section}
                  </p>
                  <h2 className={`${type.displaySection} text-brand-900`}>
                    {currentStep.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-500">
                    {currentStep.subtitle}
                  </p>
                </div>

                {/* Stat callout */}
                {currentStep.stat && (
                  <div className="mb-6 flex gap-4 border-l-2 border-accent-500 bg-white p-4 shadow-sm">
                    <span className="font-display text-2xl font-bold text-accent-500 leading-none">
                      {currentStep.stat.value}
                    </span>
                    <div>
                      <p className="text-sm leading-6 text-neutral-700">
                        {currentStep.stat.label}
                      </p>
                      <a
                        href={currentStep.stat.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
                      >
                        Source: {currentStep.stat.source}
                      </a>
                    </div>
                  </div>
                )}

                {/* Call label */}
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {currentStep.callLabel}
                </p>

                {/* Checkboxes */}
                <div className="space-y-2">
                  {currentStep.items.map((item) => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                        checked[item.id]
                          ? "border-accent-400 bg-accent-500/5"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border transition ${
                          checked[item.id]
                            ? "border-accent-500 bg-accent-500"
                            : "border-neutral-300"
                        }`}
                      >
                        {checked[item.id] && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={!!checked[item.id]}
                        onChange={() => toggle(item.id)}
                        aria-label={item.text}
                      />
                      <span className="text-sm leading-6 text-neutral-700">
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Note */}
                {currentStep.note && (
                  <p className="mt-5 text-xs italic leading-6 text-neutral-400">
                    {currentStep.note}
                  </p>
                )}

                {/* Nav */}
                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={prev}
                    className="text-sm font-semibold text-neutral-400 hover:text-neutral-600 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={next}
                    className="inline-flex items-center gap-2 bg-brand-900 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    {step === totalSteps ? "See my results →" : "Next section →"}
                  </button>
                </div>
              </div>
            )}

            {/* ── RESULTS ── */}
            {isResults && (
              <div>
                {/* Micro-moment header */}
                <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Here's where you stand
                </p>

                {/* Score */}
                <div className="mb-8 bg-brand-900 p-8 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-400">
                    Your results
                  </p>
                  <p className="mt-3 font-display text-6xl font-bold text-white">
                    {totalFlags}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {totalFlags === 1 ? "flag" : "flags"} checked
                  </p>
                  <div className="mx-auto mt-4 w-16 h-0.5 bg-accent-500" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-accent-500">
                    {result.tier}
                  </p>
                  <p className={`mt-2 font-display text-2xl font-bold text-white`}>
                    {result.headline}
                  </p>
                </div>

                {/* Per-section breakdown */}
                {sectionBreakdown.length > 0 && (
                  <div className="mb-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Flags by section
                    </p>
                    <div className="space-y-2">
                      {sectionBreakdown.map((s) => (
                        <Link
                          key={s.title}
                          href={s.guideHref}
                          className="group flex items-center justify-between border border-neutral-200 bg-white px-5 py-3.5 transition hover:border-brand-300 hover:bg-neutral-50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center bg-accent-500 text-xs font-bold text-white">
                              {s.count}
                            </span>
                            <span className="text-sm font-medium text-neutral-800">
                              {s.title}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-brand-500 opacity-0 transition group-hover:opacity-100">
                            Read the guide →
                          </span>
                        </Link>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-neutral-400">
                      Each row links to the guide for that area.
                    </p>
                  </div>
                )}

                {/* Recommendation */}
                <div className="mb-8 border-l-2 border-accent-500 bg-white p-6 shadow-sm">
                  <p className="text-sm leading-7 text-neutral-700">{result.body}</p>
                  <Link
                    href={result.ctaHref}
                    className="mt-4 inline-flex items-center text-sm font-bold text-accent-600 hover:text-accent-700 transition"
                  >
                    {result.cta}
                  </Link>
                </div>

                {/* Product recs tied to flag pattern */}
                {(() => {
                  const top = [...sectionBreakdown].sort(
                    (a, b) => b.count - a.count
                  )[0];
                  if (!top || top.count === 0) return null;
                  const symptomKey = symptomKeyByTitle[top.title];
                  if (!symptomKey) return null;
                  const recSlugs =
                    symptomRecommendations[symptomKey]?.reviews.slice(0, 2) ??
                    [];
                  const recs = recSlugs
                    .map((s) => staticReviews.find((r) => r.slug === s))
                    .filter((r): r is NonNullable<typeof r> => Boolean(r));
                  if (recs.length === 0) return null;
                  return (
                    <div className="mb-8">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Products that match what you flagged
                      </p>
                      <p className="mb-4 text-xs text-neutral-500">
                        Based on your strongest area ({top.title}). Reviewed,
                        not sponsored.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {recs.map((r) => (
                          <Link
                            key={r.slug}
                            href={`/reviews/${r.slug}`}
                            className="group flex items-center gap-4 border border-neutral-200 bg-white p-4 transition hover:border-brand-300 hover:bg-neutral-50"
                          >
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-neutral-100">
                              {r.imageUrl && (
                                <Image
                                  src={r.imageUrl}
                                  alt={r.productName}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex flex-1 flex-col">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-600">
                                {r.brand}
                              </p>
                              <p className="mt-0.5 text-sm font-bold leading-tight text-brand-900 group-hover:text-brand-600">
                                {r.productName}
                              </p>
                              <p className="mt-1 text-xs text-neutral-500">
                                {r.rating != null
                                  ? `${r.rating}/10`
                                  : "See the verdict"}{" "}
                                · Read the review →
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Download personalized PDF */}
                <div className="mb-8 flex items-center gap-4 border border-neutral-200 bg-white px-5 py-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">
                      Save your results
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Download a personalized PDF with your flags and recommendations.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const allSections = steps.map((s) => {
                        const flaggedItems = s.items
                          .filter((item) => checked[item.id])
                          .map((item) => item.text);
                        return {
                          title: s.title,
                          count: flaggedItems.length,
                          items: flaggedItems,
                          guideHref: s.guideHref,
                          note: s.note,
                        };
                      });
                      generateAssessmentPDF({
                        totalFlags,
                        tier: result.tier,
                        headline: result.headline,
                        recommendation: result.body,
                        sections: allSections,
                      });
                    }}
                    className="flex-shrink-0 bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    Download PDF
                  </button>
                </div>

                {/* Feedback — Item 6 */}
                <div className="mb-8 -mx-6 border border-neutral-200 bg-white shadow-sm sm:mx-0">
                  <AssessmentFeedback totalFlags={totalFlags} />
                </div>

                {/* Sources */}
                <div className="rounded bg-neutral-100 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Sources
                  </p>
                  <ul className="space-y-1.5">
                    {[
                      { label: "APMA — Public Opinion Research on Foot Health and Care", url: "https://www.apma.org/document-server/?cfp=/apmamain/assets/file/public/resources/todayspodiatristsurvey-9-30-10.pdf" },
                      { label: "NIH / NCBI — Plantar Fasciitis StatPearls", url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/" },
                      { label: "Gupta et al., Mycoses 2024 — Global Prevalence of Onychomycosis", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725" },
                      { label: "PMC — Antifungal Selection for Onychomycosis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10922011/" },
                      { label: "PMC — Incorrectly Fitted Footwear, Foot Pain and Foot Disorders", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/" },
                      { label: "PMC — Global Prevalence and Incidence of Hallux Valgus (2023)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/" },
                      { label: "AAFP — Common Foot Problems: OTC Treatments and Home Care", url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html" },
                    ].map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Retake */}
                <div className="mt-8 text-center">
                  <button
                    onClick={restart}
                    className="text-sm text-neutral-400 underline underline-offset-2 hover:text-neutral-600 transition"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
