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
  /** Optional full sub-page URL. When set, EcosystemFooter prefers this
   * over the anchor scroll on /routines. Populated for routines that have
   * their own /routines/[slug] page (movement, recovery, strength as of
   * 2026-09-10; more to follow). */
  href?: string;
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
    href: "/routines/weekly",
  },
  movement: {
    anchor: "movement",
    label: "Movement",
    heading: "Plantar stretch sequence.",
    time: "3 min · every morning",
    action: "Do the three-move stretch sequence before your feet hit the floor for the next 14 mornings.",
    href: "/routines/movement",
  },
  strength: {
    anchor: "strength",
    label: "Strength",
    heading: "Toe spread and grip.",
    time: "5 min · 3x per week",
    action: "Three times this week: towel scrunches and toe spreads, five minutes each.",
    href: "/routines/strength",
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
    href: "/routines/recovery",
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
  // ── Symptom articles added 2026-09-10 to open the educational-query
  // acquisition channel. Currently scaffolds; Alfonso writes bodies.
  "heel-pain-first-thing-in-the-morning": {
    slug: "heel-pain-first-thing-in-the-morning",
    title: "Heel Pain First Thing in the Morning: What It Means and How to Fix It",
    category: "Pain",
    readTime: "7 min",
    imageUrl: "/images/pexels-9467290.jpg",
    excerpt:
      "Sharp heel pain in the first few steps out of bed that eases within minutes is the classic plantar fasciitis pattern. Here's the mechanism, the diagnostic self-check, and the 4-week protocol.",
    symptoms: ["pain"],
    action: "Do the 3-move morning stretch (calf, plantar fascia, wall calf) before your first step for 4 weeks.",
  },
  "plantar-fasciitis-exercises-for-men-over-40": {
    slug: "plantar-fasciitis-exercises-for-men-over-40",
    title: "Plantar Fasciitis Exercises for Men Over 40: What Actually Works",
    category: "Pain",
    readTime: "8 min",
    imageUrl: "/images/pexels-4909313.jpg",
    excerpt:
      "Ranked by evidence: the 3 morning stretches, the 3 strength moves, the weekly progression, and the mistakes that keep the pain going. Calibrated for men over 40.",
    symptoms: ["pain"],
    action: "Start the morning 3-move stretch daily; add the strength 3 moves 3x per week.",
  },
  "arches-hurt-after-walking": {
    slug: "arches-hurt-after-walking",
    title: "Why Your Arches Hurt After Walking (And How to Strengthen Them)",
    category: "Pain",
    readTime: "6 min",
    imageUrl: "/images/pexels-7205913.jpg",
    excerpt:
      "Arch pain after a long walk usually traces to weak intrinsic muscles under a fine structure, or over-supportive shoes doing the muscles' work. Here's how to tell which, and the strength protocol that fixes both.",
    symptoms: ["pain", "footwear"],
    action: "Do the short-foot activation drill: 10 reps per side, 2x daily.",
  },
  "achilles-tendon-pain-in-men-over-40": {
    slug: "achilles-tendon-pain-in-men-over-40",
    title: "Achilles Tendon Pain in Men Over 40: The Calf-Tightness Connection",
    category: "Pain",
    readTime: "7 min",
    imageUrl: "/images/pexels-17979558.jpg",
    excerpt:
      "Achilles pain that flares with running, hills, or the first few steps after sitting is usually not the tendon on its own; it's the calf that pulls on it. The mechanism, the eccentric-load protocol with the strongest evidence, and when to see a specialist.",
    symptoms: ["pain"],
    action: "Start the eccentric heel-drop protocol: 3 sets of 15, once daily, 6 to 12 weeks.",
  },
  "ball-of-foot-pain-in-men-over-40": {
    slug: "ball-of-foot-pain-in-men-over-40",
    title: "Ball-of-Foot Pain in Men Over 40 (Metatarsalgia): Causes and Fixes",
    category: "Pain",
    readTime: "7 min",
    imageUrl: "/images/pexels-8729236.jpg",
    excerpt:
      "Burning or aching under the ball of the foot at the end of a standing day is metatarsalgia, and it's almost always driven by two things: fat-pad thinning after 40 and a narrow toe box loading a small area with too much force. Here's the fix.",
    symptoms: ["pain", "footwear"],
    action: "Get measured, switch to a wider toe box, add a metatarsal pad for a 4-week trial.",
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
    // Retro-wired 2026-09-10 to reference the new symptom guides so
    // the pillar becomes the topic-cluster hub for pain queries too.
    relatedArticles: [
      "heel-pain-first-thing-in-the-morning",
      "plantar-fasciitis-exercises-for-men-over-40",
      "arches-hurt-after-walking",
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
  // ── Symptom articles (2026-09-10). Pair each with the routine that
  // actually addresses the symptom, and cross-link between symptom-
  // article pairs to build the pain topic cluster.
  "heel-pain-first-thing-in-the-morning": {
    reviews: ["superfeet-blue-insoles"],
    routine: "movement",
    relatedArticles: [
      "plantar-fasciitis-exercises-for-men-over-40",
      "why-your-feet-hurt-after-40",
      "5-minute-routine",
    ],
  },
  "plantar-fasciitis-exercises-for-men-over-40": {
    reviews: ["superfeet-blue-insoles", "kuru-atom-sneakers"],
    routine: "movement",
    relatedArticles: [
      "heel-pain-first-thing-in-the-morning",
      "arches-hurt-after-walking",
      "why-your-feet-hurt-after-40",
    ],
  },
  "arches-hurt-after-walking": {
    reviews: ["superfeet-blue-insoles", "kuru-atom-sneakers"],
    routine: "strength",
    relatedArticles: [
      "plantar-fasciitis-exercises-for-men-over-40",
      "big-toe-and-your-whole-body",
      "what-your-dress-shoes-are-doing-to-your-feet",
    ],
  },
  "achilles-tendon-pain-in-men-over-40": {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    routine: "movement",
    relatedArticles: [
      "plantar-fasciitis-exercises-for-men-over-40",
      "heel-pain-first-thing-in-the-morning",
      "why-your-feet-hurt-after-40",
    ],
  },
  "ball-of-foot-pain-in-men-over-40": {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    routine: "strength",
    relatedArticles: [
      "what-your-dress-shoes-are-doing-to-your-feet",
      "why-your-feet-hurt-after-40",
      "big-toe-and-your-whole-body",
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
