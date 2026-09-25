/**
 * Red-flag triage for the MSR chatbot.
 *
 * Runs BEFORE the Claude Q&A call, on the raw user message. If any Tier 1 or
 * Tier 2 pattern matches, the route handler halts Q&A and shows the
 * escalation state.
 *
 * Layer 1 (this file): regex-based fast path. Deterministic, zero-latency,
 * zero-cost. Catches the obvious patterns. Errs on the side of MORE flags
 * (false positives are safer than false negatives here).
 *
 * Runs in two places. The /ask page calls it in the browser so the escalation
 * shows at once, still works when the assistant is rate limited or out of
 * budget, and the message never leaves the device. The route handler calls it
 * again because the server never trusts the client. This is a safety net, not
 * a security boundary: a message that slips past still reaches a model whose
 * system prompt refuses to diagnose.
 *
 * A future v1.1 can add a Layer 2 LLM check that only fires when Layer 1
 * misses AND the message contains medical-sounding language. Not needed for
 * v1 launch.
 *
 * The tier decisions here match the spec at
 * alfOS/Career/Product Design/MSR/Chatbot — v1 spec.md and are self-cited to
 * ADA, IWGDF, StatPearls, and AAFP. A future v1.1 will layer a real DPT/DPM
 * signoff.
 */

export type RedFlagTier = "tier1" | "tier2" | "tier3" | null;

export type RedFlagMatch = {
  tier: Exclude<RedFlagTier, null>;
  /** Human-readable label surfaced in the escalation state and in analytics. */
  label: string;
  /** The regex or phrase that matched, for logging + debugging only. Never
   *  shown to the user (would let attackers reverse-engineer the classifier). */
  matched: string;
};

type Pattern = {
  tier: Exclude<RedFlagTier, null>;
  label: string;
  /** Any of these patterns triggers the tier. */
  patterns: RegExp[];
};

// Note on regex style: everything is lowercase; caller lowercases the message.
// Word boundaries (\b) prevent "diabetes" from matching "diabetes-friendly".
// Alternations are kept short and readable rather than pushed to one giant
// regex, because clarity is more important than perf here (regex compile
// cost is trivial vs the API call that follows).

const PATTERNS: Pattern[] = [
  // ── TIER 1 — Emergency (ER now) ────────────────────────────────────────────
  {
    tier: "tier1",
    label: "diabetes plus wound/blister/sore",
    // Requires BOTH a diabetes term AND a wound term within the message.
    // Handled specially in classify() because AND-logic needs a helper.
    patterns: [/__DIABETES_PLUS_WOUND__/],
  },
  {
    tier: "tier1",
    label: "foot turning black/blue/pale or cold foot",
    patterns: [
      // Colours of poor blood flow, for any foot word, allowing a word or two
      // in between ("my foot is suddenly pale").
      /\b(foot|toe|toes|feet|leg)\s+(is|are|turned|turning|went|going|looks?|feels?)\s+(?:\w+\s+){0,2}(black|blue|dusky|purple|pale|white)\b/,
      // Cold on its own is only a flag for ONE foot. Both feet cold is the
      // everyday complaint the cold-feet guide answers; sudden cold in both
      // feet is caught by suddenColdFoot() below.
      /\bmy\s+(left\s+|right\s+)?foot\s+(is|went|turned|feels?)\s+(?:\w+\s+){0,2}(cold|freezing|ice\s+cold|frozen)\b/,
      /\bcold\s+foot\b/,
      /\bone\s+foot\b.{0,40}\b(cold|colder)\b/,
      /\bblack(en|ening)?\s+(toe|foot|skin|tissue|nail)\b/,
      /\bgangren(e|ous)\b/,
      /\bpallor\b.*\bfoot\b/,
      /\bno\s+pulse\s+in\s+(the\s+)?(foot|feet|toe)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "spreading redness / red streaks / pus",
    patterns: [
      /\bspreading\s+(redness|red)\b/,
      /\bred\s+streaks?\b/,
      /\bstreaks?\s+up\s+(the\s+)?(leg|foot|ankle|calf)\b/,
      /\b(pus|drainage|discharge)\b/,
      /\b(foul|bad|weird)\s+smell(ing)?\b/,
      /\bcellulit(is|ic)\b/,
      /\bnecrotiz(ing|es)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "fever or chills with foot problem",
    patterns: [
      /\bfever\b/,
      /\bchills\b/,
      /\b(hot|shaking|sweating)\s+(and|plus)\s+(foot|toe|feet)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "cannot bear weight after injury",
    patterns: [
      /\bcan\W?t\s+(walk|stand|bear\s+weight|put\s+(weight|pressure))\b/,
      /\bunable\s+to\s+(walk|stand|bear\s+weight)\b/,
      /\b(fell|dropped|twisted|rolled)\b.*\b(and|now)\b.*\b(can\W?t|unable)\b.*\b(walk|stand)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "sudden severe pain out of nowhere",
    patterns: [
      /\bsudden(ly)?\s+(severe|sharp|excruciat|intense|unbearab|terrible)\b/,
      /\bout\s+of\s+nowhere\b/,
      /\b(sudden|abrupt)\s+onset\s+.*\bpain\b/,
      /\bpop(ping|ped)\s+(sound|feeling|sensation)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "chest pain or trouble breathing (call 911)",
    patterns: [
      /\bchest\s+(pain|pressure|tightness|hurts?)\b/,
      /\b(short(ness)?\s+of\s+breath|breathless(ness)?|trouble\s+breathing|difficulty\s+breathing|hard\s+to\s+breathe|struggling\s+to\s+breathe)\b/,
      /\bcan\W?t\s+(catch\s+my\s+breath|breathe)\b/,
      /\bcough(ing)?\s+(up\s+)?blood\b/,
    ],
  },
  {
    tier: "tier1",
    label: "possible blood clot (one leg or calf swollen)",
    patterns: [
      /\b(dvt|deep\s+vein\s+thrombosis|blood\s+clot)\b/,
      /\bclot\s+in\s+(my|the)\s+(leg|calf)\b/,
      /\b(swollen|swelling|puffy)\b.{0,30}\bcalf\b/,
      /\bcalf\b.{0,30}\b(swollen|swelling|puffy|bigger)\b/,
      /\b(one|only\s+one|left|right)\s+(leg|calf)\b.{0,40}\b(swollen|swelling|puffy|bigger)\b/,
      /\b(swollen|swelling)\b.{0,20}\b(one|left|right)\s+(leg|calf)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "sudden cold, pale foot (possible blocked artery)",
    patterns: [/__SUDDEN_COLD_FOOT__/],
  },
  {
    tier: "tier1",
    label: "one-sided warm swelling with no injury",
    patterns: [/__ONE_SIDED_WARM_SWELLING__/],
  },
  {
    tier: "tier1",
    label: "bruising on the sole after an injury (possible midfoot injury)",
    patterns: [/__SOLE_BRUISE__/],
  },
  {
    tier: "tier1",
    label: "Charcot signs (diabetic warm swollen foot without wound)",
    patterns: [/__CHARCOT__/],
  },

  // ── TIER 2 — Same-day / next-day clinician ────────────────────────────────
  {
    tier: "tier2",
    label: "non-healing sore/wound/blister",
    patterns: [
      /\b(sore|wound|blister|cut|ulcer|lesion)\b.*\b(won\W?t\s+heal|not\s+heal|still|weeks?|month)\b/,
      /\bopen\s+(sore|wound|cut|blister)\b/,
      /\b(hasn\W?t|has\s+not)\s+heal(ed|ing)?\b/,
    ],
  },
  {
    tier: "tier2",
    label: "new numbness/tingling after injury",
    patterns: [
      /\bnew\s+(numbness|tingling|pins\s+and\s+needles)\b/,
      /\bnumb(ness)?\b.*\b(after|since)\b.*\b(fell|hurt|injur|rolled|twisted|dropped)\b/,
      /\bnumbness\s+in\s+(toes?|foot|feet)\b/,
    ],
  },
  {
    tier: "tier2",
    label: "nighttime foot pain waking the user up",
    patterns: [
      /\bwakes?\s+(me|him|us)\s+up\b/,
      /\bpain\s+at\s+night\b.*\b(wake|sleep|bed)\b/,
      /\b(can\W?t|unable\s+to)\s+sleep\b.*\bpain\b/,
    ],
  },
  {
    tier: "tier2",
    label: "dark streak under toenail (rule out melanoma)",
    patterns: [
      // Allow up to a few intervening words between "under" and "toenail"
      // ("under my big toenail", "under one of my nails").
      /\b(dark|black|brown)\s+(streak|line|band|spot)\s+under\s+.{0,30}?(toenail|nail)\b/,
      /\b(dark|black|brown)\s+(streak|line|band)\s+.{0,30}?(toenail|nail)\b/,
      /\bmelanoma\b/,
      /\bsubungual\b/,
    ],
  },
  {
    tier: "tier2",
    label: "red, hot, swollen joint (gout or infection)",
    patterns: [
      /\b(red|hot|warm)\b.{0,30}\bswollen\b.{0,30}\b(toe|joint|knuckle)\b/,
      /\b(toe|joint|knuckle)\b.{0,30}\b(red|hot)\b.{0,30}\bswollen\b/,
      /\b(toe|joint|knuckle)\b.{0,30}\bswollen\b.{0,30}\b(red|hot)\b/,
    ],
  },
  {
    tier: "tier2",
    label: "sudden deformity or arch collapse with pain",
    patterns: [
      /\b(arch|foot|toe)\s+(collapsed|dropped|drifted)\b.*\bpain\b/,
      /\bdeform(ity|ed)\b.*\b(weeks?|month|new|recent)\b/,
    ],
  },
];

/**
 * Detect diabetes + wound in the same message. Handled separately from the
 * per-pattern list because it's an AND-condition across two vocab sets.
 */
function diabetesPlusWound(message: string): boolean {
  const diabetes = /\b(diabet(es|ic)|type\s*[12]\s*diabetes|t1d|t2d|insulin|blood\s+sugar)\b/;
  const wound = /\b(wound|sore|blister|ulcer|open|cut|scrape|scratch|abrasion)\b/;
  return diabetes.test(message) && wound.test(message);
}

/**
 * Detect Charcot foot signs — diabetic person describes warm/red/swollen foot
 * with no wound. Charcot is a diabetic-foot emergency often missed for cellulitis.
 */
function charcotSigns(message: string): boolean {
  const diabetes = /\b(diabet(es|ic))\b/;
  const warmRedSwollen = /\b(warm|hot|red|swollen|puffy)\b/;
  const noWoundMention = !/\b(cut|wound|sore|blister|open)\b/.test(message);
  return diabetes.test(message) && warmRedSwollen.test(message) && noWoundMention;
}

const FOOT_OR_LEG = /\b(foot|feet|toe|toes|leg|legs|ankle|ankles)\b/;
const INJURY = /\b(twist(ed)?|roll(ed)?|sprain(ed)?|fell|fall|injur(y|ed)|hit|stubbed|dropped|kicked|landed)\b/;

/** Sudden cold or colour change in a foot: an artery can be blocked. */
function suddenColdFoot(message: string): boolean {
  const sudden = /\b(sudden(ly)?|all\s+of\s+a\s+sudden|out\s+of\s+nowhere)\b/;
  const cold = /\b(cold|pale|white|blue|numb)\b/;
  return sudden.test(message) && cold.test(message) && FOOT_OR_LEG.test(message) && /\b(cold|pale|white|blue)\b/.test(message);
}

/** One ankle or foot swollen and warm with no injury: clot, infection, or Charcot. */
function oneSidedWarmSwelling(message: string): boolean {
  const oneSide = /\b(one|only\s+one|left|right)\s+(ankle|foot)\b/;
  const swollen = /\b(swollen|swelling|puffy)\b/;
  const warm = /\b(warm|hot|red)\b/;
  return oneSide.test(message) && swollen.test(message) && warm.test(message) && !INJURY.test(message);
}

/** Bruising on the sole after an injury points to a midfoot (Lisfranc) injury. */
function soleBruise(message: string): boolean {
  const bruise = /\bbruis(e|ed|es|ing)\b/;
  const sole = /\b(sole|bottom\s+of\s+(my|the)\s+foot|underneath|arch)\b/;
  const nail = /\b(nail|toenail)\b/;
  return bruise.test(message) && sole.test(message) && !nail.test(message) && INJURY.test(message);
}

/**
 * Main entry. Returns the matched tier + label, or null if no red flag fires.
 * Returns the HIGHEST-severity match if multiple patterns hit (Tier 1 > 2 > 3).
 *
 * The caller is expected to call this on the user's raw message BEFORE
 * embedding, BEFORE retrieval, BEFORE any Claude call. Cheap, sync, ~<1ms.
 */
export function classifyRedFlag(rawMessage: string): RedFlagMatch | null {
  const message = rawMessage.toLowerCase().trim();
  if (message.length === 0) return null;

  // Special AND-condition patterns first (order matters: Tier 1 checks).
  if (diabetesPlusWound(message)) {
    return {
      tier: "tier1",
      label: "diabetes plus wound/blister/sore",
      matched: "diabetes + wound co-occurrence",
    };
  }
  if (charcotSigns(message)) {
    return {
      tier: "tier1",
      label: "Charcot signs (diabetic warm swollen foot without wound)",
      matched: "diabetes + warm/red/swollen without wound",
    };
  }
  if (suddenColdFoot(message)) {
    return { tier: "tier1", label: "sudden cold, pale foot (possible blocked artery)", matched: "sudden + cold/pale + foot" };
  }
  if (oneSidedWarmSwelling(message)) {
    return { tier: "tier1", label: "one-sided warm swelling with no injury", matched: "one ankle/foot + swollen + warm, no injury" };
  }
  if (soleBruise(message)) {
    return { tier: "tier1", label: "bruising on the sole after an injury (possible midfoot injury)", matched: "bruise + sole + injury" };
  }

  // Regex-list patterns. Sorted so Tier 1 matches short-circuit before Tier 2.
  for (const tier of ["tier1", "tier2", "tier3"] as const) {
    for (const p of PATTERNS.filter((x) => x.tier === tier)) {
      // Skip the special AND-conditions we already handled.
      if (p.patterns[0]?.source.startsWith("__")) continue;
      for (const regex of p.patterns) {
        const m = message.match(regex);
        if (m) {
          return { tier: p.tier, label: p.label, matched: m[0] };
        }
      }
    }
  }

  return null;
}

/**
 * Sample messages for testing. Useful for the Vitest suite AND for the case
 * study's "here's what the classifier catches" section.
 */
export const RED_FLAG_TEST_CASES: {
  message: string;
  expected: RedFlagTier;
  reason: string;
}[] = [
  { message: "My heel hurts in the morning", expected: null, reason: "classic PF, not a red flag" },
  { message: "I'm diabetic and I have an open blister on my heel", expected: "tier1", reason: "diabetes + wound" },
  { message: "My foot turned blue last night", expected: "tier1", reason: "blue foot = arterial obstruction sign" },
  { message: "I have diabetes and my foot feels warm, red, and swollen", expected: "tier1", reason: "possible Charcot" },
  { message: "Sudden severe pain in my heel out of nowhere", expected: "tier1", reason: "sudden severe pain" },
  { message: "Red streaks going up my leg from the sore", expected: "tier1", reason: "lymphangitis sign" },
  { message: "I have a wound on my foot that hasn't healed in 3 weeks", expected: "tier2", reason: "non-healing wound" },
  { message: "New numbness in my toes after I twisted my ankle", expected: "tier2", reason: "post-injury nerve involvement" },
  { message: "Foot pain wakes me up at night", expected: "tier2", reason: "nighttime pain pattern" },
  { message: "I have a dark streak under my big toenail", expected: "tier2", reason: "rule out subungual melanoma" },
  { message: "What are the best insoles for standing all day?", expected: null, reason: "shopping question, not medical" },
  { message: "How do I trim my toenails to prevent ingrowth?", expected: null, reason: "how-to question" },
  // Added 2026-09-25 with the swollen-feet, cold-feet, gout, top-of-foot guides.
  { message: "my left calf is swollen and hurts and my ankle is puffy", expected: "tier1", reason: "possible DVT" },
  { message: "one leg is swollen and warm since my flight", expected: "tier1", reason: "possible DVT after travel" },
  { message: "my ankles are swollen and I get short of breath lying down", expected: "tier1", reason: "possible heart failure" },
  { message: "swollen feet and chest pain", expected: "tier1", reason: "chest pain: call 911" },
  { message: "my feet are swollen and I can't breathe well", expected: "tier1", reason: "breathing trouble: call 911" },
  { message: "my foot is suddenly cold, pale and numb", expected: "tier1", reason: "possible blocked artery" },
  { message: "my right foot is swollen and warm but I didn't hurt it", expected: "tier1", reason: "one-sided warm swelling" },
  { message: "the top of my foot is swollen after I twisted it and bruised underneath", expected: "tier1", reason: "possible Lisfranc injury" },
  { message: "my big toe joint is red hot and swollen overnight", expected: "tier2", reason: "gout or infection" },
  { message: "my feet are always cold", expected: null, reason: "everyday cold feet: the guide answers it" },
  { message: "my feet feel cold at night", expected: null, reason: "everyday cold feet" },
  { message: "my toes feel cold in winter", expected: null, reason: "everyday cold toes" },
  { message: "my foot is cold", expected: "tier1", reason: "one foot cold" },
  { message: "what causes swollen ankles at the end of the day", expected: null, reason: "everyday swelling: the guide answers it" },
  { message: "do compression socks help swollen feet", expected: null, reason: "how-to question" },
  { message: "can gout cause pain in my big toe", expected: null, reason: "information question" },
  { message: "my ankle is swollen after I rolled it", expected: null, reason: "sprain: the guide answers it" },
  { message: "I have a bruise under my toenail from running", expected: null, reason: "black toenail: the guide answers it" },
  { message: "my calves are tight after running", expected: null, reason: "no swelling" },
  { message: "calf pain when I walk that goes away when I stop", expected: null, reason: "claudication: routine visit, the guide answers it" },
];
