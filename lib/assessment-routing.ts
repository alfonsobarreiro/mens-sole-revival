/**
 * Assessment routing — symptom → section map, plus section + flag-count →
 * recommended outputs. Implements the routing model defined in
 * `MSR-Assessment-Redesign.md` §6, adapted to the article catalog that
 * actually exists on the site.
 */

import { articles, routines, type ArticleMeta, type RoutineRef } from "@/lib/ecosystem";

/** Section IDs match the section title slugified — keeps the wiring readable. */
export type SectionId =
  | "nail-health"
  | "skin-heels"
  | "pain-inflammation"
  | "alignment-structure"
  | "footwear-fit";

/** Symptom keys exposed on the Step 0 triage screen. */
export type Symptom =
  | "pain"
  | "nails"
  | "skin"
  | "alignment"
  | "footwear";

export const symptomDisplay: Record<Symptom, string> = {
  pain: "Pain",
  nails: "Nails",
  skin: "Skin",
  alignment: "Alignment",
  footwear: "Footwear fit",
};

export const symptomOrder: Symptom[] = [
  "pain",
  "nails",
  "skin",
  "alignment",
  "footwear",
];

/** Spec §6.1 — which sections each symptom triggers. */
export const symptomToSections: Record<Symptom, SectionId[]> = {
  pain: ["pain-inflammation", "footwear-fit"],
  nails: ["nail-health", "skin-heels"],
  skin: ["skin-heels"],
  alignment: ["alignment-structure", "footwear-fit"],
  footwear: ["footwear-fit"],
};

/** Section priority (Spec §6.3): when multiple sections trigger, the
 * single recommended routine comes from the highest-priority section.  */
export const sectionPriority: SectionId[] = [
  "pain-inflammation",
  "nail-health",
  "skin-heels",
  "alignment-structure",
  "footwear-fit",
];

/** Buckets: 0 flags returns nothing for that section. */
export type FlagBucket = "low" | "mid" | "high"; // 1-2, 3-4, 5+

export function bucketForFlags(count: number): FlagBucket | null {
  if (count <= 0) return null;
  if (count <= 2) return "low";
  if (count <= 4) return "mid";
  return "high";
}

/** Duration the user reports for each section (asked once per section
 * that has at least one flag). Drives severity-aware routing: a chronic
 * issue widens the podiatrist-prep band; a recent issue keeps the user
 * on the routine-first track. */
export type Duration = "recent" | "ongoing" | "chronic";
//  recent   = less than 1 month
//  ongoing  = 1 to 6 months
//  chronic  = more than 6 months

export const durationLabels: Record<Duration, string> = {
  recent: "Less than a month",
  ongoing: "1 to 6 months",
  chronic: "More than 6 months",
};

/** Severity-aware bucket promotion.
 *
 * Rules of thumb:
 * - Chronic + low flags → promote to mid (long-running matters even at low count).
 * - Chronic + mid flags → promote to high (unlocks the podiatrist-prep bullet).
 * - Recent + high flags → demote to mid (acute presentation often resolves with routine).
 * - Anything else keeps its raw bucket.
 *
 * The base bucket comes from flag count; duration shifts up or down by one.
 */
export function bucketForFlagsAndDuration(
  count: number,
  duration?: Duration
): FlagBucket | null {
  const base = bucketForFlags(count);
  if (!base) return null;
  if (!duration) return base;
  if (duration === "chronic") {
    if (base === "low") return "mid";
    if (base === "mid") return "high";
    return "high";
  }
  if (duration === "recent") {
    if (base === "high") return "mid";
    return base;
  }
  return base; // "ongoing" tracks the raw count
}

/** What each section + flag bucket recommends. Article slugs map to
 * the real catalog in lib/ecosystem.ts; routine keys map to /routines
 * anchors. Each level inherits the lower level's articles + routine. */
interface SectionOutputs {
  articles: string[]; // article slugs
  routine?: keyof typeof routines;
  /** Podiatrist-prep bullet for the "talk to a professional" block. */
  prep?: string;
}

const sectionOutputs: Record<SectionId, Record<FlagBucket, SectionOutputs>> = {
  "nail-health": {
    low: {
      articles: ["toenail-fungus-what-works"],
    },
    mid: {
      articles: ["toenail-fungus-what-works", "5-minute-routine"],
      routine: "treatment",
    },
    high: {
      articles: ["toenail-fungus-what-works", "5-minute-routine"],
      routine: "treatment",
      prep: "I've had visible toenail change (color, thickness, lifting) for at least a few months.",
    },
  },
  "skin-heels": {
    low: {
      articles: ["cracked-heels-what-actually-works"],
    },
    mid: {
      articles: ["cracked-heels-what-actually-works", "5-minute-routine"],
      routine: "weekly",
    },
    high: {
      articles: ["cracked-heels-what-actually-works", "5-minute-routine"],
      routine: "weekly",
      prep: "Skin condition on my heels or between my toes: where it is, how long, how severe.",
    },
  },
  "pain-inflammation": {
    low: {
      articles: ["why-toe-alignment-affects-knees-and-hips"],
    },
    mid: {
      articles: ["why-toe-alignment-affects-knees-and-hips", "big-toe-and-your-whole-body"],
      routine: "movement",
    },
    high: {
      articles: ["why-toe-alignment-affects-knees-and-hips", "big-toe-and-your-whole-body"],
      routine: "movement",
      prep: "Pain pattern: when it hurts, where it hurts, what eases it, what makes it worse.",
    },
  },
  "alignment-structure": {
    low: {
      articles: ["big-toe-and-your-whole-body"],
    },
    mid: {
      articles: ["big-toe-and-your-whole-body", "why-toe-alignment-affects-knees-and-hips"],
      routine: "strength",
    },
    high: {
      articles: ["big-toe-and-your-whole-body", "why-toe-alignment-affects-knees-and-hips"],
      routine: "strength",
      prep: "Visible toe drift: which toes, how long, and whether it's getting worse.",
    },
  },
  "footwear-fit": {
    low: {
      articles: ["what-your-dress-shoes-are-doing-to-your-feet"],
    },
    mid: {
      articles: ["what-your-dress-shoes-are-doing-to-your-feet"],
      routine: "strength",
    },
    high: {
      articles: ["what-your-dress-shoes-are-doing-to-your-feet"],
      routine: "strength",
      prep: "Footwear pattern: what I wear most days, what hurts, what I'm considering changing.",
    },
  },
};

/** Composed result for the three-block result screen. Spec §6.3,
 * extended with severity- and not-sure-driven routing signals. */
export interface ComposedResult {
  articles: ArticleMeta[];
  routine?: RoutineRef;
  prepBullets: string[];
  /** The single section that contributed the routine, used for the
   * "Based on..." line on the result block. */
  routineSource?: SectionId;
  /** True if the result set leans toward "see a podiatrist" — either
   * because severity bumped a section into the high band, or because
   * the user marked enough pain items as "Not sure" that self-routing
   * isn't safe. */
  recommendsClinic: boolean;
  /** Per-section bucket actually used after severity adjustment.
   * Surfaces in the per-section summary on the results screen so the
   * user can see *why* a section was treated the way it was. */
  bucketBySection: Partial<Record<SectionId, FlagBucket>>;
}

export interface ComposeInput {
  flagsBySection: Partial<Record<SectionId, number>>;
  /** Optional duration the user reported per section. */
  durationBySection?: Partial<Record<SectionId, Duration>>;
  /** Count of pain items the user marked "Not sure" (interoceptive
   * uncertainty). Above the threshold this routes the user to a
   * professional rather than a self-resolve recommendation. */
  notSureCount?: number;
}

/** When the user marked at least this many pain items as "Not sure",
 * surface an explicit "see a podiatrist" callout on the results
 * screen rather than relying on self-routing. */
export const NOT_SURE_CLINIC_THRESHOLD = 3;

const NOT_SURE_PREP_BULLET =
  "I had trouble telling whether some pain items applied to me. I'd like help interpreting them with you in person.";

export function composeResult(input: ComposeInput): ComposedResult {
  const { flagsBySection, durationBySection = {}, notSureCount = 0 } = input;

  const articleSlugs = new Set<string>();
  const prepBullets: string[] = [];
  const bucketBySection: Partial<Record<SectionId, FlagBucket>> = {};

  // Walk every section that has flags, accumulate articles + prep bullets.
  for (const sectionId of Object.keys(flagsBySection) as SectionId[]) {
    const count = flagsBySection[sectionId] ?? 0;
    const bucket = bucketForFlagsAndDuration(count, durationBySection[sectionId]);
    if (!bucket) continue;
    bucketBySection[sectionId] = bucket;
    const outputs = sectionOutputs[sectionId][bucket];
    outputs.articles.forEach((slug) => articleSlugs.add(slug));
    if (outputs.prep) prepBullets.push(outputs.prep);
  }

  // Not-sure-heavy pain answers: add an explicit prep bullet about the
  // interpretive uncertainty so a podiatrist visit gets the right frame.
  const notSureTriggersClinic = notSureCount >= NOT_SURE_CLINIC_THRESHOLD;
  if (notSureTriggersClinic) {
    prepBullets.push(NOT_SURE_PREP_BULLET);
  }

  // Articles capped at 4, in priority order so the most relevant land first.
  const orderedSlugs = sectionPriority
    .flatMap((sid) => {
      const bucket = bucketBySection[sid];
      if (!bucket) return [];
      return sectionOutputs[sid][bucket].articles;
    })
    .filter((slug) => articleSlugs.has(slug));

  const dedupedSlugs = Array.from(new Set(orderedSlugs)).slice(0, 4);
  const articleMeta = dedupedSlugs
    .map((s) => articles[s])
    .filter((a): a is ArticleMeta => Boolean(a));

  // Routine: highest-priority section that has a routine.
  let routine: RoutineRef | undefined;
  let routineSource: SectionId | undefined;
  for (const sid of sectionPriority) {
    const bucket = bucketBySection[sid];
    if (!bucket) continue;
    const r = sectionOutputs[sid][bucket].routine;
    if (r) {
      routine = routines[r];
      routineSource = sid;
      break;
    }
  }

  const hasHighBucket = Object.values(bucketBySection).some((b) => b === "high");
  const recommendsClinic = hasHighBucket || notSureTriggersClinic;

  return {
    articles: articleMeta,
    routine,
    prepBullets,
    routineSource,
    recommendsClinic,
    bucketBySection,
  };
}

/** Helper: section title labels for display. Mirrors `steps` in
 * app/assessment/page.tsx — kept here to avoid circular import. */
export const sectionTitle: Record<SectionId, string> = {
  "nail-health": "Nail Health",
  "skin-heels": "Skin & Heels",
  "pain-inflammation": "Pain & Inflammation",
  "alignment-structure": "Alignment & Structure",
  "footwear-fit": "Footwear Fit",
};
