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

/** Composed result for the three-block result screen. Spec §6.3. */
export interface ComposedResult {
  articles: ArticleMeta[];
  routine?: RoutineRef;
  prepBullets: string[];
  /** The single section that contributed the routine, used for the
   * "Based on..." line on the result block. */
  routineSource?: SectionId;
}

export function composeResult(
  flagsBySection: Partial<Record<SectionId, number>>
): ComposedResult {
  const articleSlugs = new Set<string>();
  const prepBullets: string[] = [];

  // Walk every section that has flags, accumulate articles + prep bullets.
  for (const sectionId of Object.keys(flagsBySection) as SectionId[]) {
    const count = flagsBySection[sectionId] ?? 0;
    const bucket = bucketForFlags(count);
    if (!bucket) continue;
    const outputs = sectionOutputs[sectionId][bucket];
    outputs.articles.forEach((slug) => articleSlugs.add(slug));
    if (outputs.prep) prepBullets.push(outputs.prep);
  }

  // Articles capped at 4, in priority order so the most relevant land first.
  const orderedSlugs = sectionPriority
    .flatMap((sid) => {
      const count = flagsBySection[sid] ?? 0;
      const bucket = bucketForFlags(count);
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
    const count = flagsBySection[sid] ?? 0;
    const bucket = bucketForFlags(count);
    if (!bucket) continue;
    const r = sectionOutputs[sid][bucket].routine;
    if (r) {
      routine = routines[r];
      routineSource = sid;
      break;
    }
  }

  return { articles: articleMeta, routine, prepBullets, routineSource };
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
