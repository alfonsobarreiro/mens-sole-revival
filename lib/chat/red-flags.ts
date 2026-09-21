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
      /\b(foot|toe|toes|feet)\s+(is|turned|turning|went|going|looks?|feels?)\s+(black|blue|dusky|purple|pale|white|cold|frozen)\b/,
      /\bcold\s+foot\b/,
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
];
