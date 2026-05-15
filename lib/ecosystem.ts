/**
 * Ecosystem relationships — the single source of truth that wires
 * articles, routines, and reviewed products together.
 *
 * Keyed by article slug or review slug. Each entry names the related
 * routine (by anchor on /routines) and the related products (review slugs).
 *
 * Used by EcosystemFooter to render "what to do next" blocks at the bottom
 * of every article + review + assessment result.
 */

export type RoutineRef = {
  /** Anchor id on /routines; e.g. "daily" → /routines#daily */
  anchor: string;
  label: string;
  heading: string;
  time: string;
};

/** Catalog of routines surfaced on /routines. Lightweight references — the
 * full descriptions live on /routines/page.tsx, but we want a compact card
 * shape for the cross-link footer. */
export const routines: Record<string, RoutineRef> = {
  daily: {
    anchor: "daily",
    label: "Daily",
    heading: "The nightly 5 minutes.",
    time: "5 min · every night",
  },
  weekly: {
    anchor: "weekly",
    label: "Weekly",
    heading: "The Sunday reset.",
    time: "20 min · once a week",
  },
  movement: {
    anchor: "movement",
    label: "Movement",
    heading: "Plantar stretch sequence.",
    time: "3 min · every morning",
  },
  strength: {
    anchor: "strength",
    label: "Strength",
    heading: "Toe spread and grip.",
    time: "5 min · 3x per week",
  },
  treatment: {
    anchor: "treatment",
    label: "Treatment",
    heading: "Antifungal protocol.",
    time: "2 min · twice daily",
  },
  recovery: {
    anchor: "recovery",
    label: "Recovery",
    heading: "Lacrosse ball work.",
    time: "6 min · daily or as needed",
  },
};

/** Lightweight article metadata used by the cross-link footer.
 * Source of truth for full content lives on /learn (article cards) and
 * on each /blog/[slug] page (full MDX). This catalog only needs the bits
 * the cross-link cards display. */
export type ArticleMeta = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
};

export const articles: Record<string, ArticleMeta> = {
  "what-your-dress-shoes-are-doing-to-your-feet": {
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "What 30 Years in Dress Shoes Actually Does to Your Feet",
    category: "Footwear Fit",
    readTime: "7 min",
    imageUrl: "/images/pexels-12031206.jpg",
  },
  "big-toe-and-your-whole-body": {
    slug: "big-toe-and-your-whole-body",
    title: "Your Big Toe Controls More of Your Body Than You Think",
    category: "Alignment",
    readTime: "6 min",
    imageUrl: "/images/pexels-11873696.jpg",
  },
  "cracked-heels-what-actually-works": {
    slug: "cracked-heels-what-actually-works",
    title: "Cracked Heels: The Fix That Isn't a Pumice Stone",
    category: "Dry Skin",
    readTime: "5 min",
    imageUrl: "/images/pexels-29145634.jpg",
  },
  "toenail-fungus-what-works": {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    imageUrl: "/images/pexels-5960467.jpg",
  },
  "why-toe-alignment-affects-knees-and-hips": {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    category: "Alignment",
    readTime: "6 min",
    imageUrl: "/images/pexels-35206081.jpg",
  },
  "5-minute-routine": {
    slug: "5-minute-routine",
    title: "A 5-Minute Daily Foot-Care Routine You Can Stick To",
    category: "Daily Routine",
    readTime: "4 min",
    imageUrl: "/images/pexels-10904211.jpg",
  },
};

/** Article slug → its ecosystem links. */
export const articleRelations: Record<
  string,
  { reviews: string[]; routine: keyof typeof routines }
> = {
  "what-your-dress-shoes-are-doing-to-your-feet": {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    routine: "strength",
  },
  "big-toe-and-your-whole-body": {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    routine: "strength",
  },
  "cracked-heels-what-actually-works": {
    reviews: ["gehwol-fusskraft-soft-feet-cream"],
    routine: "weekly",
  },
  "toenail-fungus-what-works": {
    reviews: ["lamisil-at-antifungal-cream", "gold-bond-medicated-foot-powder"],
    routine: "treatment",
  },
  "why-toe-alignment-affects-knees-and-hips": {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    routine: "movement",
  },
  "5-minute-routine": {
    reviews: ["gehwol-fusskraft-soft-feet-cream", "gold-bond-medicated-foot-powder"],
    routine: "daily",
  },
};

/** Review slug → its ecosystem links. */
export const reviewRelations: Record<
  string,
  { articles: string[]; routine: keyof typeof routines }
> = {
  "superfeet-blue-insoles": {
    articles: ["what-your-dress-shoes-are-doing-to-your-feet"],
    routine: "movement",
  },
  "lamisil-at-antifungal-cream": {
    articles: ["toenail-fungus-what-works"],
    routine: "treatment",
  },
  "gehwol-fusskraft-soft-feet-cream": {
    articles: ["cracked-heels-what-actually-works", "5-minute-routine"],
    routine: "weekly",
  },
  "gold-bond-medicated-foot-powder": {
    articles: ["toenail-fungus-what-works", "5-minute-routine"],
    routine: "daily",
  },
  "yoga-toes-gem-separators": {
    articles: [
      "big-toe-and-your-whole-body",
      "why-toe-alignment-affects-knees-and-hips",
    ],
    routine: "strength",
  },
  "kuru-atom-sneakers": {
    articles: [
      "what-your-dress-shoes-are-doing-to-your-feet",
      "why-toe-alignment-affects-knees-and-hips",
    ],
    routine: "strength",
  },
};

/** Symptom (used by assessment) → recommended product slug + supporting
 * articles. Tightens the "assessment results → product recs" loop Cate
 * called out. The full assessment redesign will use the richer map in
 * MSR-Assessment-Redesign.md; this is the lightweight wiring for the
 * current results screen. */
export const symptomRecommendations: Record<
  string,
  { reviews: string[]; articles: string[] }
> = {
  pain: {
    reviews: ["superfeet-blue-insoles", "kuru-atom-sneakers"],
    articles: [
      "what-your-dress-shoes-are-doing-to-your-feet",
      "why-toe-alignment-affects-knees-and-hips",
    ],
  },
  nails: {
    reviews: ["lamisil-at-antifungal-cream", "gold-bond-medicated-foot-powder"],
    articles: ["toenail-fungus-what-works"],
  },
  skin: {
    reviews: ["gehwol-fusskraft-soft-feet-cream"],
    articles: ["cracked-heels-what-actually-works", "5-minute-routine"],
  },
  alignment: {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    articles: [
      "big-toe-and-your-whole-body",
      "why-toe-alignment-affects-knees-and-hips",
    ],
  },
  footwear: {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    articles: ["what-your-dress-shoes-are-doing-to-your-feet"],
  },
};
