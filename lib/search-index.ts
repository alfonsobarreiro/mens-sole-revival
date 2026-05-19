/**
 * Search index — single source of truth for the global ⌘K palette.
 *
 * Aggregates four corpora into one typed list:
 *   • Guides     — from lib/ecosystem articles
 *   • Reviews    — from lib/reviews staticReviews
 *   • Routines   — from lib/ecosystem routines
 *   • Assessment — section IDs from lib/assessment-routing
 *
 * Keep the shape narrow: title + subtitle + href + a keyword bag.
 * Matching is plain case-insensitive substring on the keyword bag, which
 * is enough for ~25 items. If the corpus grows past a few hundred,
 * swap the matcher for something like fuse.js without changing the shape.
 */

import { articleList, routines, symptomLabels } from "@/lib/ecosystem";
import { staticReviews, categoryLabel } from "@/lib/reviews";

export type SearchGroup =
  | "Guides"
  | "Product Reviews"
  | "Routines"
  | "Assessment";

export type SearchItem = {
  id: string;
  group: SearchGroup;
  title: string;
  /** One-line context shown below the title in the result row. */
  subtitle: string;
  href: string;
  /** Lowercased searchable string. Title, subtitle, tags, and synonyms
   * are all concatenated here so the matcher can do one cheap includes(). */
  keywords: string;
};

const j = (...parts: (string | undefined | null)[]) =>
  parts.filter(Boolean).join(" ").toLowerCase();

/* ── Guides ─────────────────────────────────────────────────────────── */

const guides: SearchItem[] = articleList.map((a) => ({
  id: `guide:${a.slug}`,
  group: "Guides",
  title: a.title,
  subtitle: `${a.category} · ${a.readTime} read`,
  href: `/guides/${a.slug}`,
  keywords: j(
    a.title,
    a.category,
    a.excerpt,
    a.action,
    ...a.symptoms.map((s) => symptomLabels[s])
  ),
}));

/* ── Product Reviews ────────────────────────────────────────────────── */

const reviews: SearchItem[] = staticReviews.map((r) => ({
  id: `review:${r.slug}`,
  group: "Product Reviews",
  title: r.productName,
  subtitle: [r.brand, categoryLabel(r.category)].filter(Boolean).join(" · "),
  href: `/reviews/${r.slug}`,
  keywords: j(
    r.productName,
    r.brand,
    categoryLabel(r.category),
    r.tagline,
    r.verdict
  ),
}));

/* ── Routines ───────────────────────────────────────────────────────── */

const routineItems: SearchItem[] = Object.values(routines).map((r) => ({
  id: `routine:${r.anchor}`,
  group: "Routines",
  title: r.heading,
  subtitle: `${r.label} · ${r.time}`,
  href: `/routines#${r.anchor}`,
  keywords: j(r.label, r.heading, r.time, r.action),
}));

/* ── Assessment sections ────────────────────────────────────────────── */

const assessmentSections: SearchItem[] = [
  {
    id: "assess:section:nail-health",
    group: "Assessment",
    title: "Nail Health",
    subtitle: "Thickness, color, fungal signs",
    href: "/assessment",
    keywords: j(
      "nail health",
      "nails fungus toenail discoloration brittle thickness",
      "section"
    ),
  },
  {
    id: "assess:section:skin-heels",
    group: "Assessment",
    title: "Skin & Heels",
    subtitle: "Cracks, dryness, calluses",
    href: "/assessment",
    keywords: j(
      "skin heels",
      "cracked heels dry skin callus calluses moisturizer",
      "section"
    ),
  },
  {
    id: "assess:section:pain-inflammation",
    group: "Assessment",
    title: "Pain & Inflammation",
    subtitle: "Where it hurts, when, how long",
    href: "/assessment",
    keywords: j(
      "pain inflammation",
      "plantar fasciitis arch heel pain morning stiffness ache",
      "section"
    ),
  },
  {
    id: "assess:section:alignment-structure",
    group: "Assessment",
    title: "Alignment & Structure",
    subtitle: "Toes, arches, gait",
    href: "/assessment",
    keywords: j(
      "alignment structure",
      "bunions toe alignment flat feet pronation gait posture",
      "section"
    ),
  },
  {
    id: "assess:section:footwear-fit",
    group: "Assessment",
    title: "Footwear Fit",
    subtitle: "Shoes you wear, daily and at work",
    href: "/assessment",
    keywords: j(
      "footwear fit",
      "shoes dress shoes toe box width fit running sneakers",
      "section"
    ),
  },
  {
    id: "assess:entry",
    group: "Assessment",
    title: "Take the 5-minute self-check",
    subtitle: "Start the full assessment",
    href: "/assessment",
    keywords: j(
      "assessment",
      "take the assessment self check 5 minute foot health quiz",
      "entry start"
    ),
  },
];

/* ── Combined index ─────────────────────────────────────────────────── */

export const SEARCH_ITEMS: SearchItem[] = [
  ...guides,
  ...reviews,
  ...routineItems,
  ...assessmentSections,
];

/** Display order for the result groups in the palette. Mirrors the
 * primary nav order so the user's mental model stays predictable. */
export const SEARCH_GROUP_ORDER: SearchGroup[] = [
  "Guides",
  "Product Reviews",
  "Routines",
  "Assessment",
];

/* ── Matcher ────────────────────────────────────────────────────────── */

/**
 * Substring match with light ranking. Title hits rank ahead of subtitle
 * hits, which rank ahead of keyword-bag hits. Returns at most `limit`
 * items, preserving group order for ties.
 */
export function searchItems(query: string, limit = 24): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const ranked: Array<{ item: SearchItem; score: number; idx: number }> = [];
  SEARCH_ITEMS.forEach((item, idx) => {
    const title = item.title.toLowerCase();
    const subtitle = item.subtitle.toLowerCase();
    let score = 0;
    if (title.startsWith(q)) score = 100;
    else if (title.includes(q)) score = 80;
    else if (subtitle.includes(q)) score = 50;
    else if (item.keywords.includes(q)) score = 25;
    if (score > 0) ranked.push({ item, score, idx });
  });

  ranked.sort((a, b) => (b.score - a.score) || (a.idx - b.idx));
  return ranked.slice(0, limit).map((r) => r.item);
}
