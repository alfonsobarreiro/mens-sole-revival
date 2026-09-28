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

/** emergency: call 911 now (heart or lungs). stroke: call 911 now, with
 *  stroke-specific instructions. tier1: see a doctor today. tier2: see a
 *  clinician this week. */
export type RedFlagTier = "emergency" | "stroke" | "tier1" | "tier2" | null;

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
      // A smell is a flag when it comes from a wound, not from feet or shoes.
      /\b(wound|sore|ulcer|cut|blister)\b.{0,40}\b(smells?|stinks|odor)\b/,
      /\b(foul|bad|weird)\s+smell(ing)?\b.{0,40}\b(wound|sore|ulcer|cut|blister)\b/,
      /\bcellulit(is|ic)\b/,
      /\bnecrotiz(ing|es)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "fever or chills with foot problem",
    patterns: [
      // "I have a fever", "with a fever", "fever and a red toe"; not "does X cause a fever?"
      /\b(i\s+(have|had|got|'ve\s+got|am\s+running|'m\s+running)|running|have|has|got|with|plus|and|also)\s+(a\s+)?(high\s+|low\s+|slight\s+)?(fever|temperature)\b/,
      /^\s*fever\b/,
      /\bfever\s+(and|with|plus|since)\b/,
      /\bfeverish\b/,
      /\bchills\b/,
      /\b(hot|shaking|sweating)\s+(and|plus)\s+(foot|toe|feet)\b/,
    ],
  },
  {
    tier: "tier1",
    label: "cannot bear weight after injury",
    patterns: [
      /\b(can\W?t|cannot|unable\s+to)\s+(bear\s+weight|put\s+(any\s+)?(weight|pressure))\b/,
      // "Can't walk / can't stand" on its own is usually a long day on the
      // feet ("I can't stand for long at work"); cantWalkAfterInjury() below
      // flags it only after an injury or a sudden onset.
      /__CANT_WALK_AFTER_INJURY__/,
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
    tier: "emergency",
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
      /\bnumb(ness)?\b.{0,30}\b(spreading|spreads|getting\s+worse|won\W?t\s+go\s+away|all\s+the\s+time|constant(ly)?)\b/,
      /\b(spreading|constant)\s+numbness\b/,
    ],
  },
  {
    tier: "tier2",
    label: "nighttime foot pain waking the user up",
    // Night pain is a classic flag; night cramps are not (the cramps guide
    // answers them), so nightPain() skips messages that name a cramp.
    patterns: [/__NIGHT_PAIN__/],
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
    label: "pus or drainage (possible infection)",
    patterns: [/\b(pus|drainage|discharge|oozing)\b/],
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

/** Can't walk or stand, but only after an injury or a sudden onset. */
function cantWalkAfterInjury(message: string): boolean {
  const cant = /\b(can\W?t|cannot|unable\s+to)\s+(walk|stand)\b/;
  return cant.test(message) && (INJURY.test(message) || /\bsudden(ly)?\b/.test(message));
}

/** Pain that wakes you at night, unless it's a cramp. */
function nightPain(message: string): boolean {
  const night = [
    /\bwakes?\s+(me|him|us)\s+up\b/,
    /\bpain\s+at\s+night\b.*\b(wake|sleep|bed)\b/,
    /\b(can\W?t|unable\s+to)\s+sleep\b.*\bpain\b/,
  ];
  return night.some((r) => r.test(message)) && !/\bcramp(s|ing|ed)?\b/.test(message);
}

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

const SUDDEN = /\b(sudden(ly)?|all\s+of\s+a\s+sudden|out\s+of\s+nowhere)\b/;

/**
 * Stroke signs, per CDC and B.E. F.A.S.T.: a drooping face, slurred speech,
 * one side of the body going weak or numb, and, when they come on suddenly,
 * arm or leg weakness, trouble seeing, confusion, a severe headache, or loss
 * of balance. Balance questions arrive with the balance routine, so everyday
 * unsteadiness ("wobbly when I stand up") and trips stay out.
 */
function strokeSigns(message: string): boolean {
  const face = /\b(face|mouth|smile)\b.{0,30}\b(droop\w*|sag\w*|lopsided|crooked)\b|\bdroop\w*\s+(face|mouth|smile)\b/;
  const speech =
    /\bslurr(ed|ing)\b|\b(words|speech)\s+(keeps?\s+)?(come|comes|came|coming)\s+out\s+(wrong|garbled|jumbled|funny|strange)\b|\bgarbled\s+(speech|words)\b|\b(trouble|difficulty|problems?)\s+(speaking|talking|getting\s+(my\s+)?words\s+out|finding\s+(the\s+)?words)\b(?!\s+(to|with|about))|\b(can\W?t|cannot|couldn\W?t)\s+(speak|talk|get\s+(my\s+)?words\s+out)\b(?!\s+(to|with|about))/;
  if (face.test(message) || speech.test(message)) return true;

  const weakOrNumb = /\b(weak\w*|numb\w*|tingl\w*|paraly\w*|limp|can\W?t\s+(move|lift|feel))\b/;
  const oneSide = /\b(one|left|right)\s+side\s+of\s+(my\s+|his\s+|the\s+)?(body|face)\b|\bhalf\s+(of\s+)?(my|his)\s+(body|face)\b/;
  if (oneSide.test(message) && weakOrNumb.test(message)) return true;

  if (!SUDDEN.test(message)) return false;
  if (/\b(arm|hand|face)\b/.test(message) && /\b(weak\w*|numb\w*|paraly\w*|limp|can\W?t\s+(move|lift|feel))\b/.test(message)) return true;
  if (/\bleg\b/.test(message) && /\b(weak\w*|paraly\w*|can\W?t\s+(move|lift))\b/.test(message)) return true;
  const vision =
    /\b(lost|losing|loss\s+of|blurr?(y|ed)|double|dim)\s+(my\s+|the\s+)?(vision|sight|eyesight)\b|\b(vision|sight|eyesight)\s+(went|is|got|has\s+gone)\s+(\w+\s+)?(blurr?\w*|black|dark|dim|double)\b|\b(can\W?t|cannot|couldn\W?t)\s+see\s+(out\s+of|anything|clearly|properly)\b|\bblind\s+in\s+one\s+eye\b/;
  if (vision.test(message)) return true;
  if (/\bconfus(ed|ion)\b/.test(message)) return true;
  if (/\b(severe|worst|terrible|excruciating)\s+headache\b/.test(message)) return true;
  // Loss of balance or dizziness, unless something tripped you or it only
  // comes with standing up or turning over (the balance routine covers those).
  const balance =
    /\b(lost|lose|losing|loss\s+of)\s+(my\s+)?balance\b|\boff\s+balance\b|\b(can\W?t|cannot|trouble)\s+walk(ing)?\s+straight\b|\b(keep|kept)\s+falling\b|\bfalling\s+over\b|\bdizz(y|iness)\b/;
  const tripped = /\b(trip(ped)?|slip(ped)?|twist(ed)?|roll(ed)?|sprain(ed)?|stairs?|curb|ice|icy|wet\s+floor)\b/;
  const positional = /\b(stand(ing)?\s+up|get(ting)?\s+up|roll(ing)?\s+over|turn(ing)?\s+my\s+head|bend(ing)?\s+(over|down)|lie\s+down|lying\s+down)\b/;
  return balance.test(message) && !tripped.test(message) && !positional.test(message);
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

  const fromPatterns = (tier: Exclude<RedFlagTier, null>): RedFlagMatch | null => {
    for (const p of PATTERNS.filter((x) => x.tier === tier)) {
      for (const regex of p.patterns) {
        // Sentinels ("__NAME__") stand for the AND-conditions handled below.
        if (regex.source.startsWith("__")) continue;
        const m = message.match(regex);
        if (m) return { tier: p.tier, label: p.label, matched: m[0] };
      }
    }
    return null;
  };

  // 1. Call 911: always wins, whatever else the message says.
  const emergency = fromPatterns("emergency");
  if (emergency) return emergency;
  if (strokeSigns(message)) {
    return { tier: "stroke", label: "stroke signs (call 911)", matched: "face, speech, one side, or sudden B.E. F.A.S.T. sign" };
  }

  // 2. Doctor today: AND-conditions first, then the pattern list.
  if (diabetesPlusWound(message)) {
    return { tier: "tier1", label: "diabetes plus wound/blister/sore", matched: "diabetes + wound co-occurrence" };
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
  if (cantWalkAfterInjury(message)) {
    return { tier: "tier1", label: "cannot bear weight after injury", matched: "can't walk/stand + injury or sudden" };
  }
  const tier1 = fromPatterns("tier1");
  if (tier1) return tier1;

  // 3. This week.
  if (nightPain(message)) {
    return { tier: "tier2", label: "nighttime foot pain waking the user up", matched: "night pain, not cramps" };
  }
  return fromPatterns("tier2");
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
  { message: "my ankles are swollen and I get short of breath lying down", expected: "emergency", reason: "possible heart failure" },
  { message: "swollen feet and chest pain", expected: "emergency", reason: "chest pain: call 911" },
  { message: "my feet are swollen and I can't breathe well", expected: "emergency", reason: "breathing trouble: call 911" },
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
  // Added 2026-09-28 after the copy review: everyday questions that used to trip a warning.
  { message: "I can't stand for long at work because my feet hurt", expected: null, reason: "long day on the feet, not an injury" },
  { message: "I can't walk far without heel pain", expected: null, reason: "heel pain guide answers it" },
  { message: "I twisted my ankle and now I can't walk", expected: "tier1", reason: "can't walk after an injury" },
  { message: "I suddenly can't stand on my left foot", expected: "tier1", reason: "sudden loss of weight-bearing" },
  { message: "does athlete's foot cause a fever?", expected: null, reason: "asking about fever, not reporting one" },
  { message: "I have a fever and my toe is red and swollen", expected: "tier1", reason: "fever with a foot problem" },
  { message: "my ingrown toenail has a little pus", expected: "tier2", reason: "pus alone: this week" },
  { message: "my wound smells bad", expected: "tier1", reason: "smell from a wound" },
  { message: "my feet have a bad smell", expected: null, reason: "foot odor: the guide answers it" },
  { message: "calf cramps wake me up at night", expected: null, reason: "night cramps: the cramps guide answers it" },
  { message: "my heel pain wakes me up", expected: "tier2", reason: "night pain stays a flag" },
  { message: "numbness in toes when I run", expected: null, reason: "shoe-related numbness: the guide answers it" },
  { message: "the numbness in my foot keeps spreading", expected: "tier2", reason: "spreading numbness" },
  { message: "I get chest pain when I walk and my feet swell", expected: "emergency", reason: "chest pain wins over everything" },
  // Added 2026-09-28 with the balance routine: stroke signs call 911, everyday unsteadiness doesn't.
  { message: "I suddenly lost my balance and my left arm feels weak", expected: "stroke", reason: "sudden balance loss + arm weakness" },
  { message: "all of a sudden I can't walk straight and my speech is slurred", expected: "stroke", reason: "slurred speech" },
  { message: "my face is drooping and I keep falling over", expected: "stroke", reason: "face droop" },
  { message: "the left side of my body went numb", expected: "stroke", reason: "one side of the body numb" },
  { message: "I suddenly can't see out of one eye and my foot feels numb", expected: "stroke", reason: "sudden vision loss" },
  { message: "sudden severe headache and my leg feels weak", expected: "stroke", reason: "sudden severe headache" },
  { message: "I suddenly lost my balance for no reason", expected: "stroke", reason: "sudden balance loss, no trip" },
  { message: "I feel wobbly when I stand up in the morning", expected: null, reason: "everyday unsteadiness: the balance routine answers it" },
  { message: "what exercises help my balance after 60", expected: null, reason: "how-to question" },
  { message: "I suddenly lost my balance on the stairs and twisted my ankle", expected: null, reason: "a trip, not a stroke sign" },
  { message: "I get suddenly dizzy when I stand up", expected: null, reason: "positional dizziness: see a doctor, not 911" },
  { message: "numbness on one side of my foot", expected: null, reason: "one side of the foot, not the body" },
  { message: "can a stroke cause foot drop?", expected: null, reason: "information question" },
  { message: "my words keep coming out wrong", expected: "stroke", reason: "speech trouble" },
  { message: "I have trouble talking to my doctor about my feet", expected: null, reason: "not a speech problem" },
  { message: "I suddenly got a blister on my sole and can't see it well", expected: null, reason: "can't see the blister, not vision loss" },
];
