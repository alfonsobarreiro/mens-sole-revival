"use client";

import { useState, useEffect, useMemo } from "react";
import SiteLayout from "@/components/SiteLayout";
import Container from "@/components/Container";
import { type } from "@/components/typography";
import { generateAssessmentPDF } from "@/lib/generateAssessmentPDF";
import AssessmentFeedback from "@/components/AssessmentFeedback";
import AssessmentResults from "@/components/AssessmentResults";
import AssessmentSidebar, {
  type SidebarSection,
} from "@/components/AssessmentSidebar";
import {
  composeResult,
  symptomDisplay,
  symptomOrder,
  symptomToSections,
  durationLabels,
  type Duration,
  type SectionId,
  type Symptom,
} from "@/lib/assessment-routing";
import { trackAssessment } from "@/lib/analytics";

// ── Types ────────────────────────────────────────────────────

interface CheckItem {
  id: string;
  text: string;
}

interface StepDef {
  /** Stable section id used by the routing engine. */
  sectionId: SectionId;
  section: string;
  title: string;
  subtitle: string;
  callLabel: string;
  items: CheckItem[];
  guideHref: string;
  stat?: { value: string; label: string; source: string; sourceUrl: string };
  note?: string;
}

// ── Section data ─────────────────────────────────────────────

const steps: StepDef[] = [
  {
    sectionId: "nail-health",
    section: "01",
    title: "Nail Health",
    subtitle:
      "Check both feet. Toenail problems are extremely common and very treatable. Most men just don't know what they're looking at.",
    callLabel: "Look for:",
    guideHref: "/guides?symptom=nails",
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
      label:
        "of adults have toenail fungus. OTC treatments only cure 16–23% of cases.",
      source: "Gupta et al., Mycoses 2024",
      sourceUrl:
        "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725",
    },
    note: "3+ checks likely points to fungal infection or an ingrown nail. Both are treatable. The guide at the end points you in the right direction.",
  },
  {
    sectionId: "skin-heels",
    section: "02",
    title: "Skin & Heels",
    subtitle:
      "Your heels have no oil glands. Cracking isn't a hygiene failure. It's biology. But it is fixable.",
    callLabel: "Look for:",
    guideHref: "/guides?symptom=skin",
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
      label:
        "of adults experience cracked heel skin. Diabetic men: 2× the rate.",
      source: "National Foot Health Assessment / AAFP",
      sourceUrl: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
    },
    note: "2+ checks: a daily emollient routine after your shower solves most of this in 2 to 3 weeks.",
  },
  {
    sectionId: "pain-inflammation",
    section: "03",
    title: "Pain & Inflammation",
    subtitle: "Foot pain is information. Where it hurts tells you what's causing it.",
    callLabel: "Check all that apply (Yes / No / Not sure):",
    guideHref: "/routines",
    items: [
      { id: "p1", text: "Sharp heel pain with the first steps in the morning (then eases)" },
      { id: "p2", text: "Burning or aching in the arch during or after standing" },
      { id: "p3", text: "Ball-of-foot pain when walking or wearing dress shoes" },
      { id: "p4", text: "Any joint in the foot is swollen, red, or warm to touch" },
      { id: "p5", text: "Pain in the big toe joint, especially after rich food or alcohol" },
      { id: "p6", text: "General aching in both feet by end of day" },
    ],
    stat: {
      value: "40–60",
      label:
        "is the peak age window for plantar fasciitis. About 1 million US visits per year.",
      source: "NIH / NCBI StatPearls",
      sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
    },
    note: "Morning heel pain that eases after a few minutes is the classic plantar fasciitis pattern. Big toe swelling with warmth after eating is gout. See a doctor for that one.",
  },
  {
    sectionId: "alignment-structure",
    section: "04",
    title: "Alignment & Structure",
    subtitle:
      "Your toes set the foundation. Misalignment doesn't stay in your feet. It travels up to your knees, hips, and lower back.",
    callLabel: "Look for:",
    guideHref: "/guides?symptom=alignment",
    items: [
      { id: "a1", text: "Big toe leans toward the second toe (early bunion formation)" },
      { id: "a2", text: "Lesser toes (2nd to 4th) curl downward when you relax your foot" },
      { id: "a3", text: "You have corns or calluses on the tops of bent toes" },
      { id: "a4", text: "You feel stiffness or limited movement in your big toe joint" },
      { id: "a5", text: "Your feet turn outward when you walk (duck-footed gait)" },
    ],
    stat: {
      value: "40–60%",
      label:
        "of your push-off force comes from the big toe. Restrict it and your knee compensates.",
      source: "PMC / Hallux Valgus Meta-Analysis 2023",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/",
    },
    note: "Alignment issues compound over years. Toe spreader exercises and footwear changes early can slow or reverse drift.",
  },
  {
    sectionId: "footwear-fit",
    section: "05",
    title: "Footwear Fit",
    subtitle: "The most upstream variable. Most foot problems trace back here.",
    callLabel: "Quick fit check:",
    guideHref: "/guides?symptom=footwear",
    items: [
      { id: "f1", text: "Toes feel compressed when shoes are laced or buckled" },
      { id: "f2", text: "Haven't had feet measured in the last 5 years" },
      { id: "f3", text: "Shoe width pinches the widest part of your foot" },
      { id: "f4", text: "Your heel slips out of the back when you walk" },
      { id: "f5", text: "You wear the same size you've worn since your 20s" },
    ],
    stat: {
      value: "63–72%",
      label:
        "of adults wear shoes that don't properly fit their feet in length or width.",
      source: "PMC / Incorrectly Fitted Footwear (Systematic Review)",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
    },
    note: "Feet change shape and size as you age. If you haven't been measured in a few years, you probably aren't in the right size.",
  },
];

// ── Session persistence ──────────────────────────────────────

const SS_KEY = "msr-assessment-v2";

type Phase = "intro" | "triage" | "section" | "ack" | "results";

interface PersistedState {
  phase: Phase;
  sectionIndex: number;
  selectedSymptoms: Symptom[];
  showAll: boolean;
  checked: Record<string, boolean>;
  notSure: Record<string, boolean>;
  durationBySection: Partial<Record<SectionId, Duration>>;
}

function saveState(s: PersistedState) {
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify(s));
  } catch {
    /* fail silently — sessionStorage may be unavailable */
  }
}

function loadState(): PersistedState | null {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

// ── Component ────────────────────────────────────────────────

export default function AssessmentPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notSure, setNotSure] = useState<Record<string, boolean>>({});
  const [durationBySection, setDurationBySection] = useState<
    Partial<Record<SectionId, Duration>>
  >({});
  const [hydrated, setHydrated] = useState(false);

  // ── Restore on mount ──
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setPhase(saved.phase);
      setSectionIndex(saved.sectionIndex);
      setSelectedSymptoms(saved.selectedSymptoms);
      setShowAll(saved.showAll);
      setChecked(saved.checked);
      setNotSure(saved.notSure);
      setDurationBySection(saved.durationBySection ?? {});
    }
    setHydrated(true);
  }, []);

  // ── Persist on change ──
  useEffect(() => {
    if (!hydrated) return;
    saveState({
      phase,
      sectionIndex,
      selectedSymptoms,
      showAll,
      checked,
      notSure,
      durationBySection,
    });
  }, [
    phase,
    sectionIndex,
    selectedSymptoms,
    showAll,
    checked,
    notSure,
    durationBySection,
    hydrated,
  ]);

  // ── Derived ──
  const visibleSteps: StepDef[] = useMemo(() => {
    if (showAll || selectedSymptoms.length === 0) return steps;
    const sectionIds = new Set<SectionId>();
    for (const sym of selectedSymptoms) {
      symptomToSections[sym].forEach((sid) => sectionIds.add(sid));
    }
    return steps.filter((s) => sectionIds.has(s.sectionId));
  }, [selectedSymptoms, showAll]);

  const totalSections = visibleSteps.length;
  const currentStep = visibleSteps[sectionIndex];

  // Duration validation: if any item in the current section is flagged,
  // the duration radio becomes required before the user can advance.
  const flaggedInSection = currentStep
    ? currentStep.items.some((it) => checked[it.id])
    : false;
  const durationMissing =
    flaggedInSection && !durationBySection[currentStep!.sectionId];
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);

  // Reset the validation flag whenever the user changes section so the
  // error doesn't carry over into a fresh section.
  useEffect(() => {
    setAttemptedAdvance(false);
  }, [sectionIndex]);

  const totalFlags = Object.entries(checked).filter(([, v]) => v).length;
  const notSureCount = Object.entries(notSure).filter(([, v]) => v).length;

  const flagsBySection: Partial<Record<SectionId, number>> = useMemo(() => {
    const out: Partial<Record<SectionId, number>> = {};
    for (const step of steps) {
      const count = step.items.filter((it) => checked[it.id]).length;
      if (count > 0) out[step.sectionId] = count;
    }
    return out;
  }, [checked]);

  // Per-section list of the user-visible text for every checked item.
  // Mirrors flagsBySection but carries the strings so the results
  // screen (and any print/PDF of it) can name what was flagged.
  const itemsBySection: Partial<Record<SectionId, string[]>> = useMemo(() => {
    const out: Partial<Record<SectionId, string[]>> = {};
    for (const step of steps) {
      const flagged = step.items
        .filter((it) => checked[it.id])
        .map((it) => it.text);
      if (flagged.length > 0) out[step.sectionId] = flagged;
    }
    return out;
  }, [checked]);

  const attemptedSections: SectionId[] = useMemo(
    () => visibleSteps.map((s) => s.sectionId),
    [visibleSteps]
  );

  const sidebarSections: SidebarSection[] = useMemo(() => {
    return visibleSteps.map((s, idx) => ({
      id: s.sectionId,
      title: s.title,
      status:
        idx < sectionIndex
          ? ("done" as const)
          : idx === sectionIndex
          ? ("current" as const)
          : ("upcoming" as const),
    }));
  }, [visibleSteps, sectionIndex]);

  const progress =
    phase === "section"
      ? Math.round(((sectionIndex + 1) / Math.max(totalSections, 1)) * 100)
      : phase === "results" || phase === "ack"
      ? 100
      : 0;

  // Estimated time remaining — drives a "≈ N min left" indicator next to the
  // progress bar. Heuristic: ~15 items per minute (4 seconds each: read, scan,
  // decide). Rounded up so the estimate never lies low. Floors at 1 min until
  // the user is genuinely past the last section.
  const minutesRemaining = useMemo(() => {
    if (phase !== "section") return 0;
    const remainingItems = visibleSteps
      .slice(sectionIndex)
      .reduce((sum, s) => sum + s.items.length, 0);
    if (remainingItems === 0) return 0;
    return Math.max(1, Math.ceil(remainingItems / 15));
  }, [phase, visibleSteps, sectionIndex]);

  // ── Actions ──
  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // Selecting Yes clears Not-sure on the same item.
      return next;
    });
    if (notSure[id]) {
      setNotSure((prev) => ({ ...prev, [id]: false }));
    }
  }

  function toggleNotSure(id: string) {
    setNotSure((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
    if (checked[id]) {
      setChecked((prev) => ({ ...prev, [id]: false }));
    }
  }

  function selectSymptom(s: Symptom) {
    setShowAll(false);
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function setDurationForCurrent(d: Duration) {
    if (!currentStep) return;
    setDurationBySection((prev) => ({ ...prev, [currentStep.sectionId]: d }));
  }

  function startTriage() {
    trackAssessment("assessment_started", {});
    setPhase("triage");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSections() {
    if (!showAll && selectedSymptoms.length === 0) return;
    trackAssessment("assessment_triage_done", {
      mode: showAll ? "show_all" : "filtered",
      symptoms: selectedSymptoms.join(","),
      symptom_count: showAll ? 0 : selectedSymptoms.length,
    });
    setSectionIndex(0);
    setPhase("section");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextSection() {
    if (currentStep) {
      const flags = currentStep.items.filter((it) => checked[it.id]).length;
      trackAssessment("assessment_section_done", {
        section: currentStep.sectionId,
        flags,
        duration: durationBySection[currentStep.sectionId] ?? "skipped",
      });
    }
    if (sectionIndex + 1 < totalSections) {
      setSectionIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPhase("ack");
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Auto-advance after the acknowledgment hold.
      const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hold = motionOk ? 1000 : 0;
      setTimeout(() => {
        setPhase("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, hold);
    }
  }

  function prevSection() {
    if (sectionIndex > 0) {
      setSectionIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPhase("triage");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function skipCurrentSection() {
    if (currentStep) {
      trackAssessment("assessment_section_skip", {
        section: currentStep.sectionId,
      });
    }
    nextSection();
  }

  function restart() {
    try {
      sessionStorage.removeItem(SS_KEY);
    } catch {
      /* noop */
    }
    setPhase("intro");
    setSectionIndex(0);
    setSelectedSymptoms([]);
    setShowAll(false);
    setChecked({});
    setNotSure({});
    setDurationBySection({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function downloadPdf() {
    // The PDF is the doctor-visit artifact (spec §3.5): prep bullets on
    // top, then flagged items per section, then routine + articles.
    // Reuses the same composeResult() the on-screen results use.
    const composed = composeResult({
      flagsBySection,
      durationBySection,
      notSureCount,
    });
    const sectionsForPdf = visibleSteps.map((s) => {
      const flaggedItems = s.items
        .filter((it) => checked[it.id])
        .map((it) => it.text);
      return {
        title: s.title,
        count: flaggedItems.length,
        items: flaggedItems,
        duration: durationBySection[s.sectionId],
        guideHref: s.guideHref,
      };
    });
    try {
      await generateAssessmentPDF({
        totalFlags,
        notSureCount,
        recommendsClinic: composed.recommendsClinic,
        sections: sectionsForPdf,
        prepBullets: composed.prepBullets,
        routine: composed.routine,
        articles: composed.articles,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[PDF download] failed:", err);
      alert(
        "Sorry — the PDF download hit an error. Try again, or use the Email option to send yourself a copy. (Error logged to the browser console.)"
      );
    }
  }

  const isIntro = phase === "intro";
  const isTriage = phase === "triage";
  const isSectionPhase = phase === "section";
  const isAck = phase === "ack";
  const isResults = phase === "results";

  return (
    <SiteLayout>
      {/* ── Hero banner ── */}
      <section className="bg-brand-900 py-8 md:py-12">
        <Container>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-400">
            5-Minute Self-Check
          </p>
          <h1 className={`${type.displaySection} text-white`}>
            The Men's Foot Health Assessment
          </h1>
          {/* Intro copy stays for the first two screens (intro + triage)
              where the user hasn't started yet. Once the assessment is
              in motion, the hero collapses to the H1 + progress so the
              content area gets the real estate. */}
          {(isIntro || isTriage) && (
            <p className="mt-3 max-w-xl text-base leading-7 text-white/65">
              Pick what brought you here, answer the questions for those
              sections, and get a specific next step.
            </p>
          )}

          {/* Progress moved out of the hero into a sticky strip below it
              (per Cate's review: "the actual progress tracking disappears
              while scrolling"). The "minutes left" copy goes with it; the
              sticky strip keeps Section X of Y, the section title, the bar,
              and the percentage so users keep their bearings during the flow. */}
          {isSectionPhase && totalSections > 0 && minutesRemaining > 0 && (
            <p className="mt-4 text-[11px] uppercase tracking-widest text-white/35">
              About {minutesRemaining} min left
            </p>
          )}

          {/* Mid-flow restart affordance. Lives in the hero so it's reachable
              from any phase past the intro without scrolling. Confirms before
              wiping the session so a stray click doesn't lose progress. */}
          {!isIntro && (
            <button
              type="button"
              onClick={() => {
                const ok = window.confirm(
                  "Restart the assessment? Your current answers will be cleared."
                );
                if (ok) restart();
              }}
              className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-white/40 underline underline-offset-4 transition hover:text-white/70"
            >
              Restart from the beginning
            </button>
          )}
        </Container>
      </section>

      {/* ── Sticky progress strip ──
          Pins below the site header (top-16) so users always see where they
          are in the flow. Per Cate's review: "make the progress bar itself
          sticky, even if simplified, so users maintain constant awareness
          of progression." Visually distinct from the dark hero above it:
          accent-color top edge, solid bg, drop shadow once pinned, slightly
          thicker bar. So the strip reads as a discrete element rather than
          an extension of the hero. */}
      {isSectionPhase && totalSections > 0 && (
        <div className="sticky top-16 z-30 border-t-2 border-accent-500 bg-brand-900 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)]">
          <Container>
            <div className="flex items-center gap-3 py-3.5 sm:gap-4">
              <p className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-white/85 sm:text-[11px]">
                Section {sectionIndex + 1} of {totalSections}
              </p>
              {currentStep?.title && (
                <p className="hidden truncate text-xs font-medium text-white sm:block sm:flex-1">
                  {currentStep.title}
                </p>
              )}
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15 sm:max-w-xs">
                <div
                  className="h-1.5 rounded-full bg-accent-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="shrink-0 text-[10px] font-semibold tabular-nums text-white sm:text-[11px]">
                {progress}%
              </span>
            </div>
          </Container>
        </div>
      )}

      {/* ── Content ── */}
      <section className="min-h-[60vh] bg-neutral-50 py-14 md:py-20">
        <Container>
          {/* ── INTRO ── */}
          {isIntro && (
            <div className="mx-auto max-w-2xl">
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
                  This assessment is for non-emergency self-awareness only. It
                  is not a medical diagnosis.
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
                Five possible sections, about three minutes if you pick a few,
                about five if you take all of them. You'll end with specific
                articles to read, a routine to try, and a list of bullets you
                can bring to a podiatrist.
              </p>

              <button
                onClick={startTriage}
                className="mt-6 inline-flex items-center gap-2 bg-brand-900 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
              >
                Start the assessment →
              </button>
            </div>
          )}

          {/* ── TRIAGE (Step 0) ── */}
          {isTriage && (
            <div className="mx-auto max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                Step 0 · Pick what applies
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-brand-900">
                Where's the trouble?
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Pick what brought you here. We'll only show you the sections
                that apply. About three minutes if you pick a few, about five
                if you select everything.
              </p>

              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                Select all that apply to you:
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {symptomOrder.map((s) => {
                  const selected = !showAll && selectedSymptoms.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => selectSymptom(s)}
                      className={`px-5 py-3 text-sm font-bold uppercase tracking-wider transition ${
                        selected
                          ? "bg-brand-900 text-white"
                          : "border border-neutral-300 bg-white text-neutral-700 hover:border-brand-500"
                      }`}
                    >
                      {symptomDisplay[s]}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAll(true);
                  setSelectedSymptoms([]);
                }}
                className={`mt-5 inline-block text-xs font-semibold uppercase tracking-wider underline underline-offset-4 transition ${
                  showAll
                    ? "text-brand-900"
                    : "text-neutral-500 hover:text-brand-700"
                }`}
              >
                {showAll ? "✓ Showing everything" : "Not sure, show me everything"}
              </button>

              <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6">
                <button
                  onClick={() => setPhase("intro")}
                  className="text-sm font-semibold text-neutral-400 hover:text-neutral-600 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={startSections}
                  disabled={!showAll && selectedSymptoms.length === 0}
                  className="inline-flex items-center gap-2 bg-brand-900 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  Start the assessment →
                </button>
              </div>

              <p className="mt-5 text-xs text-neutral-400">
                Don't use this for an active medical issue.{" "}
                <a
                  href="https://www.apma.org/find-a-podiatrist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-neutral-600"
                >
                  Find a podiatrist
                </a>{" "}
                instead.
              </p>
            </div>
          )}

          {/* ── SECTION ── */}
          {isSectionPhase && currentStep && (
            <div className="grid gap-8 md:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <aside className="md:sticky md:top-24 md:self-start">
                <AssessmentSidebar
                  sections={sidebarSections}
                  onSkip={skipCurrentSection}
                />
              </aside>

              {/* Section body */}
              <div className="min-w-0">
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

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {currentStep.callLabel}
                </p>

                {/* Items: pain section uses three-state (Yes/No/Not sure),
                    other sections stay binary (check / unchecked). */}
                <div className="space-y-2">
                  {currentStep.items.map((item) => {
                    const isPain = currentStep.sectionId === "pain-inflammation";
                    const isChecked = !!checked[item.id];
                    const isNotSure = !!notSure[item.id];

                    if (!isPain) {
                      return (
                        <label
                          key={item.id}
                          className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                            isChecked
                              ? "border-accent-400 bg-accent-500/5"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border transition ${
                              isChecked
                                ? "border-accent-500 bg-accent-500"
                                : "border-neutral-300"
                            }`}
                          >
                            {isChecked && (
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
                            checked={isChecked}
                            onChange={() => toggleCheck(item.id)}
                            aria-label={item.text}
                          />
                          <span className="text-sm leading-6 text-neutral-700">
                            {item.text}
                          </span>
                        </label>
                      );
                    }

                    // Pain three-state row
                    return (
                      <div
                        key={item.id}
                        className={`border p-4 transition ${
                          isChecked
                            ? "border-accent-400 bg-accent-500/5"
                            : isNotSure
                            ? "border-neutral-300 bg-neutral-50"
                            : "border-neutral-200 bg-white"
                        }`}
                      >
                        <p className="text-sm leading-6 text-neutral-700">
                          {item.text}
                        </p>
                        <div
                          role="radiogroup"
                          aria-label={item.text}
                          className="mt-3 flex flex-wrap gap-2"
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isChecked}
                            onClick={() => {
                              if (!isChecked) toggleCheck(item.id);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                              isChecked
                                ? "bg-accent-500 text-white"
                                : "border border-neutral-300 bg-white text-neutral-700 hover:border-accent-500"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={!isChecked && !isNotSure}
                            onClick={() => {
                              if (isChecked) toggleCheck(item.id);
                              if (isNotSure) toggleNotSure(item.id);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                              !isChecked && !isNotSure
                                ? "bg-brand-900 text-white"
                                : "border border-neutral-300 bg-white text-neutral-700 hover:border-brand-500"
                            }`}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isNotSure}
                            onClick={() => {
                              if (!isNotSure) toggleNotSure(item.id);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                              isNotSure
                                ? "bg-neutral-400 text-white"
                                : "border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                            }`}
                          >
                            Not sure
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Duration question — only shown when the user has
                    flagged at least one item in this section. Drives
                    severity-aware routing in lib/assessment-routing.ts.
                    Required to advance once any item is flagged. */}
                {(() => {
                  if (!flaggedInSection) return null;
                  const current = durationBySection[currentStep.sectionId];
                  const showError = durationMissing && attemptedAdvance;
                  const options: Duration[] = ["recent", "ongoing", "chronic"];
                  return (
                    <div className="mt-8 border-t border-neutral-200 pt-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        How long has this been going on?{" "}
                        <span className="text-accent-600">*</span>
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        For the items you flagged in this section. Best guess
                        is fine.
                      </p>
                      <div
                        role="radiogroup"
                        aria-label="Duration"
                        aria-required="true"
                        aria-invalid={showError}
                        className={`mt-3 flex flex-wrap gap-2 ${
                          showError ? "rounded border border-red-300 p-2" : ""
                        }`}
                      >
                        {options.map((d) => {
                          const selected = current === d;
                          return (
                            <button
                              key={d}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => {
                                setDurationForCurrent(d);
                                setAttemptedAdvance(false);
                              }}
                              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                                selected
                                  ? "bg-brand-900 text-white"
                                  : "border border-neutral-300 bg-white text-neutral-700 hover:border-brand-500"
                              }`}
                            >
                              {durationLabels[d]}
                            </button>
                          );
                        })}
                      </div>
                      {showError && (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          Pick one before you continue. Best guess is fine.
                        </p>
                      )}
                    </div>
                  );
                })()}

                {currentStep.note && (
                  <p className="mt-5 text-xs italic leading-6 text-neutral-400">
                    {currentStep.note}
                  </p>
                )}

                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={prevSection}
                    className="text-sm font-semibold text-neutral-400 hover:text-neutral-600 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      if (durationMissing) {
                        setAttemptedAdvance(true);
                        return;
                      }
                      setAttemptedAdvance(false);
                      nextSection();
                    }}
                    className="inline-flex items-center gap-2 bg-brand-900 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    {sectionIndex + 1 === totalSections
                      ? "See my results →"
                      : "Next section →"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── ACKNOWLEDGMENT ── */}
          {isAck && (
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                One moment
              </p>
              <p className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-brand-900">
                Got it. Here's where you stand.
              </p>
              <div
                aria-hidden="true"
                className="mx-auto mt-6 h-1 w-32 overflow-hidden bg-neutral-200"
              >
                <div className="h-1 w-full bg-accent-500 motion-safe:animate-pulse" />
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {isResults && (
            <div className="mx-auto max-w-2xl">
              <AssessmentResults
                flagsBySection={flagsBySection}
                durationBySection={durationBySection}
                itemsBySection={itemsBySection}
                totalFlags={totalFlags}
                attemptedSections={attemptedSections}
                notSureCount={notSureCount}
                onDownloadPdf={downloadPdf}
                onRestart={restart}
                onBackToLastSection={() => {
                  if (visibleSteps.length === 0) return;
                  setSectionIndex(visibleSteps.length - 1);
                  setPhase("section");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />

              {/* Feedback form (Item 6) */}
              <div className="mt-12 border border-neutral-200 bg-white shadow-sm">
                <AssessmentFeedback totalFlags={totalFlags} />
              </div>

              {/* Sources */}
              <div className="mt-8 rounded bg-neutral-100 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Sources
                </p>
                <ul className="space-y-1.5">
                  {[
                    { label: "APMA · Public Opinion Research on Foot Health and Care", url: "https://www.apma.org/document-server/?cfp=/apmamain/assets/file/public/resources/todayspodiatristsurvey-9-30-10.pdf" },
                    { label: "NIH / NCBI · Plantar Fasciitis StatPearls", url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/" },
                    { label: "Gupta et al., Mycoses 2024 · Global Prevalence of Onychomycosis", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725" },
                    { label: "PMC · Antifungal Selection for Onychomycosis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10922011/" },
                    { label: "PMC · Incorrectly Fitted Footwear, Foot Pain and Foot Disorders", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/" },
                    { label: "PMC · Global Prevalence and Incidence of Hallux Valgus (2023)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/" },
                    { label: "AAFP · Common Foot Problems: OTC Treatments and Home Care", url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html" },
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
            </div>
          )}
        </Container>
      </section>
    </SiteLayout>
  );
}

