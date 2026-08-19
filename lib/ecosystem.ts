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
  /** Single-sentence "do this" instruction surfaced on the assessment
   * results screen so the recommendation is actionable, not just a
   * read-this link. */
  action: string;
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
    action: "Start tonight: wash, dry between toes, inspect, moisturize. Five minutes before bed.",
  },
  weekly: {
    anchor: "weekly",
    label: "Weekly",
    heading: "The Sunday reset.",
    time: "20 min · once a week",
    action: "Pick a Sunday: foot soak, nail trim, heel cream with socks overnight.",
  },
  movement: {
    anchor: "movement",
    label: "Movement",
    heading: "Plantar stretch sequence.",
    time: "3 min · every morning",
    action: "Do the three-move stretch sequence before your feet hit the floor for the next 14 mornings.",
  },
  strength: {
    anchor: "strength",
    label: "Strength",
    heading: "Toe spread and grip.",
    time: "5 min · 3x per week",
    action: "Three times this week: towel scrunches and toe spreads, five minutes each.",
  },
  treatment: {
    anchor: "treatment",
    label: "Treatment",
    heading: "Antifungal protocol.",
    time: "2 min · twice daily",
    action: "Apply an OTC terbinafine cream twice daily for 4 to 6 weeks. Don't stop when it looks better.",
  },
  recovery: {
    anchor: "recovery",
    label: "Recovery",
    heading: "Lacrosse ball work.",
    time: "6 min · daily or as needed",
    action: "Roll the arch of each foot on a lacrosse ball for three minutes. Hold on tender spots.",
  },
};

/** Lightweight article metadata used by the cross-link footer.
 * Source of truth for full content lives on /learn (article cards) and
 * on each /blog/[slug] page (full MDX). This catalog only needs the bits
 * the cross-link cards display. */
export type Symptom = "pain" | "nails" | "skin" | "alignment" | "footwear";

/** Human-readable labels + ordering for symptom chips in the UI. */
export const symptomLabels: Record<Symptom, string> = {
  pain: "Pain",
  nails: "Nails",
  skin: "Skin",
  alignment: "Alignment",
  footwear: "Footwear",
};

export const symptomOrder: Symptom[] = [
  "pain",
  "nails",
  "skin",
  "alignment",
  "footwear",
];

export type ArticleMeta = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  /** Short, scannable excerpt used by /guides cards and search results. */
  excerpt: string;
  /** Symptom tags — drive symptom-first search/filter on /guides. */
  symptoms: Symptom[];
  /** Single-line "first move" instruction surfaced on the assessment
   * results screen so the recommendation is actionable, not just a
   * read-this link. */
  action: string;
};

export const articles: Record<string, ArticleMeta> = {
  "why-your-feet-hurt-after-40": {
    slug: "why-your-feet-hurt-after-40",
    title: "Why Your Feet Hurt After 40 (and What's Actually Going On)",
    category: "Foot Health",
    readTime: "7 min",
    imageUrl: "/images/pexels-7787491.jpg",
    excerpt:
      "\"Age\" isn't a diagnosis. Four specific things change in your feet after 40 — and because your feet are the foundation, you feel them travel up to your knees, hips, and back. Here's what's actually going on.",
    symptoms: ["pain", "alignment", "footwear"],
    action: "Take the 5-minute self-check to find which pattern is driving your pain.",
  },
  "what-your-dress-shoes-are-doing-to-your-feet": {
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "What 30 Years in Dress Shoes Actually Does to Your Feet",
    category: "Footwear Fit",
    readTime: "7 min",
    imageUrl: "/images/pexels-12031206.jpg",
    excerpt:
      "Most men don't connect the shoes they wore for decades to the foot problems they have now. Here's the chain of cause and effect.",
    symptoms: ["footwear", "alignment", "pain"],
    action: "This week: try one pair of wider-toe-box shoes for daily wear.",
  },
  "big-toe-and-your-whole-body": {
    slug: "big-toe-and-your-whole-body",
    title: "Your Big Toe Controls More of Your Body Than You Think",
    category: "Alignment",
    readTime: "6 min",
    imageUrl: "/images/pexels-11873696.jpg",
    excerpt:
      "The big toe is responsible for 40 to 60% of your push-off force. Most men have spent decades restricting it and wondering why their knee hurts.",
    symptoms: ["alignment", "pain"],
    action: "Try a 5-minute toe spread and grip session three times this week.",
  },
  "cracked-heels-what-actually-works": {
    slug: "cracked-heels-what-actually-works",
    title: "Cracked Heels: The Fix That Isn't a Pumice Stone",
    category: "Dry Skin",
    readTime: "5 min",
    imageUrl: "/images/pexels-29145634.jpg",
    excerpt:
      "Scrubbing dry, cracked heel skin is the wrong starting point. Here's what's actually happening, and the routine that addresses it.",
    symptoms: ["skin"],
    action: "Tonight: apply a 10% urea cream to damp heels, put cotton socks on, sleep.",
  },
  "toenail-fungus-what-works": {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    imageUrl: "/images/pexels-5960467.jpg",
    excerpt:
      "The evidence on OTC treatments, prescription options, and home remedies, ranked by how well they actually work.",
    symptoms: ["nails", "skin"],
    action: "Start an OTC terbinafine (Lamisil) protocol twice daily for 4 to 6 weeks.",
  },
  "why-toe-alignment-affects-knees-and-hips": {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    category: "Alignment",
    readTime: "6 min",
    imageUrl: "/images/pexels-35206081.jpg",
    excerpt:
      "When your big toe can't extend and stabilize, your knee, hip, and lower back pick up the slack every single step. Here's how it travels up the chain.",
    symptoms: ["alignment", "pain", "footwear"],
    action: "Start the morning plantar stretch sequence: 3 moves, 3 minutes, every day.",
  },
  "5-minute-routine": {
    slug: "5-minute-routine",
    title: "A 5-Minute Daily Foot-Care Routine You Can Stick To",
    category: "Daily Routine",
    readTime: "4 min",
    imageUrl: "/images/pexels-10904211.jpg",
    excerpt:
      "Consistency beats intensity. A five-minute habit done after your shower produces dramatically better long-term outcomes than anything more ambitious you'll quit.",
    symptoms: ["skin", "nails"],
    action: "Tonight, anchor a 5-minute foot-care habit to your shower or bedtime routine.",
  },
};

/** Convenience: array form for list iteration. */
export const articleList: ArticleMeta[] = Object.values(articles);

/** Article slug → its ecosystem links.
 *  SEO Bundle 5 (2026-08-14): added relatedArticles field. Pillar
 *  (why-your-feet-hurt-after-40) had ZERO inbound internal links before;
 *  now referenced from every other guide. Every guide links to 3 siblings. */
export const articleRelations: Record<
  string,
  {
    reviews: string[];
    routine: keyof typeof routines;
    relatedArticles: string[];
  }
> = {
  "why-your-feet-hurt-after-40": {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    routine: "daily",
    relatedArticles: [
      "what-your-dress-shoes-are-doing-to-your-feet",
      "cracked-heels-what-actually-works",
      "toenail-fungus-what-works",
    ],
  },
  "what-your-dress-shoes-are-doing-to-your-feet": {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    routine: "strength",
    relatedArticles: [
      "why-your-feet-hurt-after-40",
      "big-toe-and-your-whole-body",
      "5-minute-routine",
    ],
  },
  "big-toe-and-your-whole-body": {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    routine: "strength",
    relatedArticles: [
      "why-toe-alignment-affects-knees-and-hips",
      "what-your-dress-shoes-are-doing-to-your-feet",
      "why-your-feet-hurt-after-40",
    ],
  },
  "cracked-heels-what-actually-works": {
    reviews: ["gehwol-fusskraft-soft-feet-cream"],
    routine: "weekly",
    relatedArticles: [
      "why-your-feet-hurt-after-40",
      "5-minute-routine",
      "toenail-fungus-what-works",
    ],
  },
  "toenail-fungus-what-works": {
    reviews: ["lamisil-at-antifungal-cream", "gold-bond-medicated-foot-powder"],
    routine: "treatment",
    relatedArticles: [
      "why-your-feet-hurt-after-40",
      "cracked-heels-what-actually-works",
      "5-minute-routine",
    ],
  },
  "why-toe-alignment-affects-knees-and-hips": {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    routine: "movement",
    relatedArticles: [
      "big-toe-and-your-whole-body",
      "what-your-dress-shoes-are-doing-to-your-feet",
      "why-your-feet-hurt-after-40",
    ],
  },
  "5-minute-routine": {
    reviews: ["gehwol-fusskraft-soft-feet-cream", "gold-bond-medicated-foot-powder"],
    routine: "daily",
    relatedArticles: [
      "why-your-feet-hurt-after-40",
      "cracked-heels-what-actually-works",
      "toenail-fungus-what-works",
    ],
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
