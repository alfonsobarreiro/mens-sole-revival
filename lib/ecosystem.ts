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
    href: "/routines/daily",
  },
  "office-day": {
    anchor: "office-day",
    label: "Office day",
    heading: "Desk micro-routines.",
    time: "2 min · every hour",
    action: "Every 90 minutes at the desk: 10 seated calf pumps, 20 ankle circles, 10 toe spreads.",
    href: "/routines/office-day",
  },
  "post-workout": {
    anchor: "post-workout",
    label: "Post-workout",
    heading: "Recovery after a run or lift.",
    time: "8 min · after training",
    action: "Straight after training: 3 minutes calf release, plantar stretch, and toe extension work.",
    href: "/routines/post-workout",
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

// Insertion order = /guides page render order (articleList = Object.values).
// Rule per feedback_new_articles_top_of_list: NEW articles go at the TOP,
// not appended. Reverse-chronological by default so the [[new-badge]] lands
// where users scan first.
export const articles: Record<string, ArticleMeta> = {
  "is-it-toenail-fungus": {
    slug: "is-it-toenail-fungus",
    title: "Is It Toenail Fungus? The Self-Check and What Else It Could Be",
    category: "Nails",
    readTime: "7 min",
    imageUrl: "/images/pexels-5960467.jpg",
    excerpt:
      "About half of thick, yellow toenails aren't fungal, and no antifungal touches those. The patterns that mean fungus, the look-alikes in men over 40, why a five-minute clipping test beats a year of guessing, and the one streak that is never a wait-and-see.",
    symptoms: ["nails", "skin"],
    action: "Photograph the nail, treat any peeling skin between the toes, and book a nail clipping test before you buy anything for the nail.",
  },
  "toenail-fungus-treatments-compared": {
    slug: "toenail-fungus-treatments-compared",
    title: "Toenail Fungus Treatments, Compared: Pills, Topicals, Laser, and What Cures",
    category: "Nails",
    readTime: "9 min",
    imageUrl: "/images/pexels-5960467.jpg",
    excerpt:
      "Five ways to treat toenail fungus, and they don't work equally. Cure rates side by side for the pill, the prescription topicals, the drugstore shelf, laser, and nail thinning, plus the liver test and the statin interaction that decide the route for a man over 40.",
    symptoms: ["nails"],
    action: "With a confirmed diagnosis, bring your medication list to the podiatrist and ask about terbinafine first; get the nail thinned whatever you choose.",
  },
  "toenail-fungus-12-month-protocol": {
    slug: "toenail-fungus-12-month-protocol",
    title: "The 12-Month Toenail Fungus Protocol",
    category: "Nails",
    readTime: "8 min",
    imageUrl: "/images/pexels-5960467.jpg",
    excerpt:
      "A toenail grows a millimetre a month, so clear nail takes a year to reach the tip. Month by month: what to do, what you should see at the base, when to worry, and why most men quit at month three when nothing is wrong.",
    symptoms: ["nails"],
    action: "Photograph every affected nail today, file it thin, treat the skin, and judge progress by the clear band at the cuticle, never the tip.",
  },
  "keeping-toenail-fungus-from-coming-back": {
    slug: "keeping-toenail-fungus-from-coming-back",
    title: "Keeping Toenail Fungus From Coming Back",
    category: "Nails",
    readTime: "7 min",
    imageUrl: "/images/pexels-5960467.jpg",
    excerpt:
      "Between one in ten and one in two treated nails get reinfected, mostly from the same shoes, socks, and showers that grew it. Shoes in rotation and treated, thirty seconds of drying, the skin caught at the first peel, nails checked monthly, and the twice-weekly topical podiatrists use as prevention.",
    symptoms: ["nails", "skin", "footwear"],
    action: "Rotate two treated pairs of shoes, dry between the toes after every shower, and treat any peeling skin the week you see it.",
  },
  "toenail-fungus-home-remedies-and-laser": {
    slug: "toenail-fungus-home-remedies-and-laser",
    title: "Home Remedies and Laser for Toenail Fungus: What the Evidence Says",
    category: "Nails",
    readTime: "7 min",
    imageUrl: "/images/pexels-5960467.jpg",
    excerpt:
      "Vicks, tea tree oil, vinegar, baking soda, garlic, mouthwash, drugstore kits, and laser, in order of evidence. One small study, one old trial, a lot of nothing, and the single drugstore ingredient worth buying. What to try alongside real treatment and what is a year lost.",
    symptoms: ["nails"],
    action: "Get the diagnosis, take the treatment with the best odds, and keep any remedy in a supporting role with filing and drying.",
  },
  // ── Latest: 2026-09-22 expansion (gout, skin, cramps, bunions, diabetes,
  // nerves, sprains). Eight new guides, newest first.
  "gout-in-the-big-toe-men-over-40": {
    slug: "gout-in-the-big-toe-men-over-40",
    title: "Gout in the Big Toe: How to Tell It From Stiffness (and What to Do)",
    category: "Pain",
    readTime: "7 min",
    imageUrl: "/images/pexels-18300650.jpg",
    excerpt:
      "A red, hot, swollen big toe that came on overnight is a different animal from stiffness that built over years. How to tell the two apart, what a flare needs, what a doctor will check, and what shoes do in between.",
    symptoms: ["pain", "alignment"],
    action: "If the joint is hot, red, and swollen and it started overnight, book a doctor this week; don't stretch it.",
  },
  "athletes-foot-and-foot-odor-what-works": {
    slug: "athletes-foot-and-foot-odor-what-works",
    title: "Athlete's Foot and Foot Odor: What Works (and Why It Comes Back)",
    category: "Skin",
    readTime: "7 min",
    imageUrl: "/images/pexels-17082339.jpg",
    excerpt:
      "Peeling between the toes and a smell that survives the shower are the same problem from two angles: a warm, damp shoe. The antifungal protocol, the sock and shoe rotation that stops the relapse, and when it's not fungus.",
    symptoms: ["skin", "footwear"],
    action: "Start a 4-week antifungal cream course and rotate two pairs of shoes; never wear the same pair two days running.",
  },
  "calluses-and-corns-men-over-40": {
    slug: "calluses-and-corns-men-over-40",
    title: "Calluses and Corns: What to Remove, What to Leave, and What's Causing Them",
    category: "Skin",
    readTime: "7 min",
    imageUrl: "/images/pexels-19613251.jpg",
    excerpt:
      "A callus is your skin answering pressure. Shave it and it comes back, because the pressure didn't leave. Where they form and why, the safe way to thin them, the corn-versus-callus difference, and the diabetes rule.",
    symptoms: ["skin", "footwear", "pain"],
    action: "Find the pressure source (shoe, toe, gait) before you thin the skin; file after a shower, never cut.",
  },
  "foot-and-calf-cramps-at-night": {
    slug: "foot-and-calf-cramps-at-night",
    title: "Foot and Calf Cramps at Night: Why They Happen After 40 and What Stops Them",
    category: "Pain",
    readTime: "7 min",
    imageUrl: "/images/pexels-7298421.jpg",
    excerpt:
      "The 2 a.m. calf cramp is common after 40 and mostly mechanical: shortened calves, a long day on your feet, dehydration, and a few medications. What to do in the moment, the two-minute bedtime stretch that cuts them, and the signs it's something else.",
    symptoms: ["pain"],
    action: "Do the 2-minute calf and sole stretch before bed for two weeks and track whether the cramps drop.",
  },
  "bunions-men-over-40": {
    slug: "bunions-men-over-40",
    title: "Bunions in Men Over 40: What Slows Them, Which Shoes, and When Surgery Is the Honest Answer",
    category: "Alignment",
    readTime: "8 min",
    imageUrl: "/images/pexels-9616030.jpg",
    excerpt:
      "A bunion is the big toe drifting toward its neighbors while the joint behind it drifts out. Shoes don't reverse it and spacers don't either, but both change how fast it moves and how much it hurts. The honest map, including when surgery earns the recovery.",
    symptoms: ["alignment", "footwear", "pain"],
    action: "Switch to a wide toe box now; photograph both feet from above every 3 months to track the drift.",
  },
  "diabetic-foot-care-men-over-40": {
    slug: "diabetic-foot-care-men-over-40",
    title: "Diabetic Foot Care: The Daily Check, the Shoe Rules, and When a Small Thing Is an Emergency",
    category: "Foot Health",
    readTime: "8 min",
    imageUrl: "/images/pexels-8637976.jpg",
    excerpt:
      "With diabetes, the nerves that report pain and the vessels that heal it both work less well, so a blister can become an ulcer without ever hurting. The 60-second daily check, the shoe and sock rules, what never to do at home, and the same-day list.",
    symptoms: ["skin", "pain", "footwear"],
    action: "Check both feet every night with a mirror or phone camera; any break in the skin that hasn't started closing in a day is a same-day call.",
  },
  "numbness-and-tingling-in-the-feet": {
    slug: "numbness-and-tingling-in-the-feet",
    title: "Numbness and Tingling in the Feet: Nerve, Shoe, or Something Upstream",
    category: "Foot Health",
    readTime: "8 min",
    imageUrl: "/images/pexels-13065922.jpg",
    excerpt:
      "Pins and needles in the toes has four common causes that need different fixes: a shoe pinching a nerve, a nerve trapped at the ankle or forefoot, a back problem sending signals down the leg, or neuropathy. How to narrow it down, and the version that needs a doctor this week.",
    symptoms: ["pain", "footwear"],
    action: "Note whether it's one foot or both, and whether it changes with shoes; that decides your next step.",
  },
  "sprained-ankle-recovery-over-40": {
    slug: "sprained-ankle-recovery-over-40",
    title: "Sprained Ankle After 40: How to Recover Without Turning It Into a Weak Ankle for Life",
    category: "Pain",
    readTime: "8 min",
    imageUrl: "/images/pexels-7298407.jpg",
    excerpt:
      "Most sprains heal; the ankle you don't rehab is the one that keeps rolling. The first 48 hours (and why total rest is out), the Ottawa rules for when it needs an X-ray, the six-week balance-and-strength progression, and the shoe that helps while it heals.",
    symptoms: ["pain"],
    action: "If you can't take four steps on it or it's tender on the bone behind the ankle, get an X-ray; otherwise start protected walking today.",
  },
  // ── Latest: 2026-09-18 expansion (nails + alignment + occupation + kinetic-
  // chain + runners). Five new symptom articles, newest first.
  "ingrown-toenail-what-actually-stops-the-cycle": {
    slug: "ingrown-toenail-what-actually-stops-the-cycle",
    title: "Ingrown Toenail: What Actually Stops the Cycle",
    category: "Nails",
    readTime: "6 min",
    imageUrl: "/images/pexels-5036256.jpg",
    excerpt:
      "Most ingrown toenails come back because the trim technique keeps reproducing the same edge that grew in. The specific fix, when to soak vs when to see a podiatrist, and the boring cutting rule that ends the cycle.",
    symptoms: ["nails"],
    action: "Switch to straight-across nail trims and stop rounding the corners; soak nightly during a flare.",
  },
  "big-toe-stiffness-in-men-over-40": {
    slug: "big-toe-stiffness-in-men-over-40",
    title: "Big Toe Stiffness in Men Over 40 (Hallux Limitus and Rigidus)",
    category: "Alignment",
    readTime: "7 min",
    imageUrl: "/images/pexels-11873696.jpg",
    excerpt:
      "Big toe joint stiffness is progressive: hallux limitus reduces range, hallux rigidus locks it. Both start with cartilage wear from decades of restrictive shoes. The mobility protocol that keeps it moving before it locks.",
    symptoms: ["alignment", "pain"],
    action: "Do the big-toe mobilization drill daily for 8 weeks: 30 gentle extensions per side, morning and night.",
  },
  "foot-pain-from-standing-all-day": {
    slug: "foot-pain-from-standing-all-day",
    title: "Foot Pain from Standing All Day: The On-Shift Protocol",
    category: "Pain",
    readTime: "7 min",
    imageUrl: "/images/pexels-13122754.jpg",
    excerpt:
      "Standing 8+ hours on hard floors flattens the fat pad, fatigues the arch, and inflames the plantar fascia within weeks. The shoe fit, insole, and micro-break protocol that keeps you upright without the end-of-shift ache.",
    symptoms: ["pain", "footwear"],
    action: "Do 10 seated calf pumps every 90 minutes on shift; swap to a wider-toe-box shoe by end of month.",
  },
  "knee-pain-that-starts-in-the-feet": {
    slug: "knee-pain-that-starts-in-the-feet",
    title: "Knee Pain That Starts in the Feet: The Pronation Chain",
    category: "Kinetic Chain",
    readTime: "7 min",
    imageUrl: "/images/pexels-34806666.jpg",
    excerpt:
      "Knee pain over 40 often traces to the feet: overpronation rotates the shin inward and pulls the kneecap off its track. The self-check that tells you if this is you, and the strengthening + footwear fix that unwinds it.",
    symptoms: ["alignment", "pain", "footwear"],
    action: "Do the single-leg-squat mirror check tonight; if the knee caves inward, start the arch-support trial.",
  },
  "runners-over-40-foot-pain": {
    slug: "runners-over-40-foot-pain",
    title: "Runners Over 40: Foot Pain That Wasn't There at 30",
    category: "Pain",
    readTime: "8 min",
    imageUrl: "/images/pexels-33360918.jpg",
    excerpt:
      "The four foot problems that show up in runners after 40 (plantar fasciitis, metatarsalgia, Achilles tendinopathy, big-toe stiffness), why they cluster in this decade, and the mileage + shoe adjustments that keep you running through them.",
    symptoms: ["pain"],
    action: "Cap weekly mileage increases at 10%; swap to a wider-toe-box shoe with a firm forefoot rocker.",
  },
  // ── 2026-09-10 pain-cluster expansion.
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
  // ── Evergreen: pillar + earlier guides.
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
    imageUrl: "/images/pexels-22739369.jpg",
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
  "is-it-toenail-fungus": {
    routine: "daily",
    relatedArticles: ["toenail-fungus-treatments-compared", "athletes-foot-and-foot-odor-what-works", "toenail-fungus-what-works"],
    reviews: [],
  },
  "toenail-fungus-treatments-compared": {
    routine: "daily",
    relatedArticles: ["toenail-fungus-12-month-protocol", "is-it-toenail-fungus", "toenail-fungus-home-remedies-and-laser"],
    reviews: [],
  },
  "toenail-fungus-12-month-protocol": {
    routine: "weekly",
    relatedArticles: ["toenail-fungus-treatments-compared", "keeping-toenail-fungus-from-coming-back", "ingrown-toenail-what-actually-stops-the-cycle"],
    reviews: [],
  },
  "keeping-toenail-fungus-from-coming-back": {
    routine: "daily",
    relatedArticles: ["athletes-foot-and-foot-odor-what-works", "toenail-fungus-12-month-protocol", "what-your-dress-shoes-are-doing-to-your-feet"],
    reviews: [],
  },
  "toenail-fungus-home-remedies-and-laser": {
    routine: "daily",
    relatedArticles: ["toenail-fungus-treatments-compared", "is-it-toenail-fungus", "toenail-fungus-what-works"],
    reviews: [],
  },
  "gout-in-the-big-toe-men-over-40": {
    reviews: ["kuru-atom-sneakers"],
    routine: "movement",
    relatedArticles: ["big-toe-stiffness-in-men-over-40", "big-toe-and-your-whole-body", "why-your-feet-hurt-after-40"],
  },
  "athletes-foot-and-foot-odor-what-works": {
    reviews: ["lamisil-at-antifungal-cream", "gold-bond-medicated-foot-powder"],
    routine: "daily",
    relatedArticles: ["toenail-fungus-what-works", "cracked-heels-what-actually-works", "what-your-dress-shoes-are-doing-to-your-feet"],
  },
  "calluses-and-corns-men-over-40": {
    reviews: ["gehwol-fusskraft-soft-feet-cream", "superfeet-blue-insoles"],
    routine: "weekly",
    relatedArticles: ["cracked-heels-what-actually-works", "ball-of-foot-pain-in-men-over-40", "what-your-dress-shoes-are-doing-to-your-feet"],
  },
  "foot-and-calf-cramps-at-night": {
    reviews: [],
    routine: "recovery",
    relatedArticles: ["plantar-fasciitis-exercises-for-men-over-40", "why-your-feet-hurt-after-40", "runners-over-40-foot-pain"],
  },
  "bunions-men-over-40": {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    routine: "movement",
    relatedArticles: ["big-toe-stiffness-in-men-over-40", "why-toe-alignment-affects-knees-and-hips", "what-your-dress-shoes-are-doing-to-your-feet"],
  },
  "diabetic-foot-care-men-over-40": {
    reviews: ["gehwol-fusskraft-soft-feet-cream"],
    routine: "daily",
    relatedArticles: ["cracked-heels-what-actually-works", "toenail-fungus-what-works", "foot-pain-from-standing-all-day"],
  },
  "numbness-and-tingling-in-the-feet": {
    reviews: ["kuru-atom-sneakers"],
    routine: "movement",
    relatedArticles: ["ball-of-foot-pain-in-men-over-40", "what-your-dress-shoes-are-doing-to-your-feet", "diabetic-foot-care-men-over-40"],
  },
  "sprained-ankle-recovery-over-40": {
    reviews: ["kuru-atom-sneakers"],
    routine: "strength",
    relatedArticles: ["achilles-tendon-pain-in-men-over-40", "runners-over-40-foot-pain", "knee-pain-that-starts-in-the-feet"],
  },
  // ── 2026-09-18 expansion. Each newer article funnels users toward the
  // most-relevant routine sub-page + 2-3 sibling articles.
  "ingrown-toenail-what-actually-stops-the-cycle": {
    reviews: ["gold-bond-medicated-foot-powder", "gehwol-fusskraft-soft-feet-cream"],
    routine: "weekly",
    relatedArticles: [
      "toenail-fungus-what-works",
      "cracked-heels-what-actually-works",
      "5-minute-routine",
    ],
  },
  "big-toe-stiffness-in-men-over-40": {
    reviews: ["yoga-toes-gem-separators", "kuru-atom-sneakers"],
    routine: "strength",
    relatedArticles: [
      "big-toe-and-your-whole-body",
      "why-toe-alignment-affects-knees-and-hips",
      "what-your-dress-shoes-are-doing-to-your-feet",
    ],
  },
  "foot-pain-from-standing-all-day": {
    reviews: ["superfeet-blue-insoles", "kuru-atom-sneakers"],
    routine: "recovery",
    relatedArticles: [
      "ball-of-foot-pain-in-men-over-40",
      "what-your-dress-shoes-are-doing-to-your-feet",
      "why-your-feet-hurt-after-40",
    ],
  },
  "knee-pain-that-starts-in-the-feet": {
    reviews: ["superfeet-blue-insoles", "kuru-atom-sneakers"],
    routine: "strength",
    relatedArticles: [
      "why-toe-alignment-affects-knees-and-hips",
      "big-toe-and-your-whole-body",
      "arches-hurt-after-walking",
    ],
  },
  "runners-over-40-foot-pain": {
    reviews: ["kuru-atom-sneakers", "superfeet-blue-insoles"],
    routine: "movement",
    relatedArticles: [
      "achilles-tendon-pain-in-men-over-40",
      "plantar-fasciitis-exercises-for-men-over-40",
      "ball-of-foot-pain-in-men-over-40",
    ],
  },
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
