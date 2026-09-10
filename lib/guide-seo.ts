// ─────────────────────────────────────────────────────────────────────────────
// Per-guide SEO/AEO data + structured-data builders.
//
// metaTitle / metaDescription / faq / sources are authored from each article's
// actual body text. The faq and sources here are ALSO rendered visibly on the
// guide (components/GuideExtras.tsx) so the FAQPage/Article JSON-LD matches what
// the user sees — required for valid structured data.
//
// datePublished is a best-effort editorial date; update per guide as content is
// revised (feeds Article schema datePublished/dateModified).
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { articles } from "@/lib/ecosystem";
import { buildBreadcrumb } from "@/lib/breadcrumb";

export type GuideFaq = { q: string; a: string };
export type GuideSource = { label: string; url: string };

export type GuideSeo = {
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  /** Optional — falls back to datePublished. Bump when the article body
   *  meaningfully changes (Bundle 2 SEO fix: split freshness signals). */
  dateModified?: string;
  faq: GuideFaq[];
  sources: GuideSource[];
};

export const guideSeo: Record<string, GuideSeo> = {
  "why-your-feet-hurt-after-40": {
    metaTitle: "Why Do My Feet Hurt After 40? The Real Causes",
    metaDescription:
      "Foot pain after 40 isn't 'just age.' Four specific things change in your feet — and because they're your foundation, you feel it in your knees, hips, and back.",
    datePublished: "2026-06-15",
    faq: [
      {
        q: "Why do my feet suddenly hurt after 40?",
        a: "Four specific things change: the fat pad that cushions your heel and forefoot thins and loses elasticity, tendons and ligaments stiffen (which is part of why plantar fasciitis peaks between 40 and 60), decades of narrow and elevated footwear catch up as toe drift, bunions, and a stiffer big toe, and recovery slows so small irritations linger. \"Age\" is a label for those addressable changes, not a diagnosis.",
      },
      {
        q: "Can foot problems really cause knee, hip, or back pain?",
        a: "Yes. Your foot is the base of the kinetic chain, so when it shifts the body compensates and that compensation travels up to the knee, hip, and lower back. A foot that collapses inward rotates the shin and changes how the knee tracks; a big toe that can't extend shortens your stride and offloads work onto the hip.",
      },
      {
        q: "What's the first thing to do about foot pain after 40?",
        a: "Find out which pattern is yours before you buy or change anything — a 5-minute self-check points you to the specific cause. Then fix the most upstream variable (footwear fit: get measured, both feet, end of day), build a short daily routine, and see a podiatrist for pain that wakes you, red or warm swelling, numbness, or any non-healing wound.",
      },
    ],
    sources: [
      {
        label: "NIH / NCBI — Plantar Fasciitis (StatPearls)",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
      {
        label: "PMC — Global Prevalence and Incidence of Hallux Valgus (2023)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/",
      },
      {
        label: "PMC — Incorrectly Fitted Footwear, Foot Pain and Foot Disorders",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
      },
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
      },
    ],
  },
  "cracked-heels-what-actually-works": {
    metaTitle: "Why Do My Heels Crack? The Real Fix",
    metaDescription:
      "Cracked heels are a pressure-plus-dryness problem a pumice stone won't solve. Learn why urea cream, post-shower timing, and overnight socks actually work.",
    datePublished: "2026-03-01",
    faq: [
      {
        q: "Why do my heels keep cracking?",
        a: "Cracked heels aren't just a dryness problem, they're a pressure-plus-dryness problem. Your heel bears your full body weight, and when that thick skin loses moisture it loses flexibility, so instead of stretching under pressure it splits.",
      },
      {
        q: "Does a pumice stone fix cracked heels?",
        a: "No. A pumice stone removes the surface layer, but if the skin underneath isn't hydrated and flexible you've just exposed a new surface to the same conditions, so the thickening comes back. Aggressive scrubbing can also deepen fissures or create abrasions that let bacteria in.",
      },
      {
        q: "What's the best cream for cracked heels?",
        a: "Urea cream at 20–40% concentration is what podiatrists reach for first because it's a keratolytic that breaks down thickened skin while deeply hydrating it. Apply it to clean, slightly damp skin right after a shower, and for severe cracks apply it before bed under cotton socks to boost overnight absorption.",
      },
    ],
    sources: [
      { label: "American Podiatric Medical Association", url: "https://www.apma.org/" },
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
      },
    ],
  },
  "toenail-fungus-what-works": {
    metaTitle: "How to Get Rid of Toenail Fungus That Works",
    metaDescription:
      "Toenail fungus isn't dangerous, just stubborn. See the evidence-based approach that actually works, why miracle cures are scams, and what real progress looks like.",
    datePublished: "2026-03-01",
    faq: [
      {
        q: "Why is toenail fungus so hard to get rid of?",
        a: "It's hard not because the condition is complicated but because the solution is slow. The fungus develops quietly and changes gradually, so you can do the right thing for weeks and still see almost nothing.",
      },
      {
        q: "What actually works for toenail fungus?",
        a: "Reduce the fungal load by trimming and filing nails and keeping them clean and dry, then use proven treatments: topicals for mild to moderate cases (daily use for months) or oral antifungals for severe cases under medical supervision. You also have to treat the environment, rotating shoes, letting them dry, and wearing clean socks.",
      },
      {
        q: "How do I know the treatment is working?",
        a: "Progress shows up as a clear strip of new nail growing from the base, less yellowing over time, and gradual reduction in thickness. The infected part of the nail doesn't heal, it grows out and gets replaced by healthier nail, which is why it takes time.",
      },
    ],
    sources: [
      {
        label: "Gupta et al., Mycoses 2024 — Global Prevalence of Onychomycosis",
        url: "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725",
      },
      {
        label: "PMC — Antifungal Selection for Onychomycosis",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10922011/",
      },
    ],
  },
  "big-toe-and-your-whole-body": {
    metaTitle: "Why Big Toe Mobility Affects Your Whole Body",
    metaDescription:
      "Your big toe drives 40–60% of push-off force. Learn how a stiff or compressed big toe changes your gait and quietly leads to knee and hip pain, plus how to fix it.",
    datePublished: "2026-03-01",
    faq: [
      {
        q: "Why does my big toe matter for the rest of my body?",
        a: "The big toe is responsible for roughly 40–60% of your push-off force when you walk, extending to create a stiff, propulsive lever via the windlass mechanism. When it can't extend properly the body compensates with pronation, external rotation, or a shortened stride, which changes how force travels up the leg to the knee and hip.",
      },
      {
        q: "How can I test my big toe function?",
        a: "Stand barefoot and, without moving your other toes, try to lift just your big toe off the ground, then try pressing the big toe down while lifting the other four. If the toes move together or you can barely isolate the movement, your intrinsic foot muscles have likely weakened from years of supported footwear, which is common in men over 40.",
      },
      {
        q: "What can I do to improve big toe mobility?",
        a: "Stretch the toe daily by pulling it back toward your shin for 30 seconds, use toe spacers barefoot at home to separate the toes, and practice the toe-isolation drill to build intrinsic muscles. Choosing shoes with a wide toe box also matters more than arch support for most men.",
      },
    ],
    sources: [
      {
        label: "PMC — Global Prevalence and Incidence of Hallux Valgus (2023)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/",
      },
      {
        label: "NIH / NCBI — Plantar Fasciitis (StatPearls)",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
    ],
  },
  "why-toe-alignment-affects-knees-and-hips": {
    metaTitle: "Can Toe Alignment Cause Knee and Hip Pain?",
    metaDescription:
      "When your big toe can't stabilize and extend, your body compensates at the knee and hip. Learn how foot mechanics travel upward and a simple weekly self-check.",
    datePublished: "2026-03-01",
    faq: [
      {
        q: "Can toe alignment really affect my knees and hips?",
        a: "Yes. When your big toe can't stabilize and extend well during walking, your body compensates, and those compensations often show up at the knee and hip, especially under repetition like walking, stairs, running, and strength training.",
      },
      {
        q: "How do foot problems travel up to the knee and hip?",
        a: "If the foot collapses inward, the shin rotates and the knee may track inward, increasing stress during stairs, squats, running, and long walks. When stability below is inconsistent, the hip works harder to keep alignment, which can show up as lateral hip tightness, glute fatigue, hip flexor tension, or low back tightness.",
      },
      {
        q: "How can I check my own toe and knee alignment?",
        a: "Run a 5-minute self-check: stand barefoot and see if your toes splay or squeeze together, shift weight forward to feel whether pressure goes through the big toe or the outer edge, do 5 slow squats to watch if your knees track over the second toe or cave inward, and walk slowly noting whether you push off the big toe. Repeat weekly under the same conditions to build a baseline.",
      },
    ],
    sources: [
      {
        label: "PMC — Global Prevalence and Incidence of Hallux Valgus (2023)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/",
      },
      {
        label: "NIH / NCBI — Plantar Fasciitis (StatPearls)",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
    ],
  },
  "what-your-dress-shoes-are-doing-to-your-feet": {
    metaTitle: "What Dress Shoes Do to Your Feet Over Time",
    metaDescription:
      "Thirty years in narrow dress shoes quietly reshapes your feet. Learn how toe box fit and heel drop cause bunions and pain after 40, and what to look for instead.",
    datePublished: "2026-03-01",
    faq: [
      {
        q: "Are dress shoes bad for your feet?",
        a: "The problem isn't the shoe itself, it's the fit. Most dress shoes are built on a narrow last with a narrow toe box that compresses your toes, and over decades this can form bunions, let the big toe drift inward, and stress the plantar fascia.",
      },
      {
        q: "What is heel drop and why does it matter?",
        a: "Heel drop is the difference in height between the heel and the ball of the foot, and a typical Oxford runs 15–20mm. When your heel is consistently elevated, your calf and Achilles shorten to match, changing how your ankle moves, which changes how your knee tracks and how load moves through your hips.",
      },
      {
        q: "What should I look for in a better dress shoe?",
        a: "Look for a wider toe box where your toes don't touch the sides, a lower heel drop for long-term Achilles and calf health, and removable insoles so you can add support later. Rotating two or three pairs also lets shoes dry and gives your foot a slightly different position each day.",
      },
    ],
    sources: [
      {
        label: "PMC — Incorrectly Fitted Footwear, Foot Pain and Foot Disorders",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
      },
      {
        label: "PMC — Global Prevalence and Incidence of Hallux Valgus (2023)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/",
      },
    ],
  },
  "5-minute-routine": {
    metaTitle: "A 5-Minute Daily Foot Care Routine for Men",
    metaDescription:
      "A simple 5-minute post-shower foot care routine you'll actually stick to: dry, check, moisturize with urea cream, maintain nails, and change into clean socks.",
    datePublished: "2026-03-01",
    faq: [
      {
        q: "What is a simple daily foot care routine?",
        a: "After your shower, dry thoroughly between your toes (30 sec), do a visual check of both feet (60 sec), moisturize heels, the ball of the foot, and the tops of the toes with urea cream but not between the toes (90 sec), maintain nails twice a week (60 sec), and put on clean socks (30 sec).",
      },
      {
        q: "Why does a 5-minute routine work better than a long one?",
        a: "Consistency beats intensity every time, so a daily 5-minute routine produces dramatically better long-term outcomes than a thorough 30-minute routine done once a month. The goal is a baseline habit that compounds over months and years.",
      },
      {
        q: "What kind of socks and cream should I use?",
        a: "Use a urea-based cream in the 10–25% range, the evidence-backed level for callus management and crack prevention. Pair it with clean, moisture-wicking socks like cotton or merino wool, since synthetic socks trap moisture and old cotton loses its wicking.",
      },
    ],
    sources: [
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
      },
      { label: "American Podiatric Medical Association", url: "https://www.apma.org/" },
    ],
  },
  // ── Symptom-query guides added 2026-09-10 to open the educational
  // acquisition channel. Article bodies are Alfonso-authored; the meta
  // + FAQ questions here are scaffolds — write the FAQ answers when the
  // article body ships. TODO Alfonso: fill FAQ answers before publish.
  "heel-pain-first-thing-in-the-morning": {
    metaTitle: "Heel Pain First Thing in the Morning: What It Means and How to Fix It",
    metaDescription:
      "Sharp heel pain in the first steps out of bed that eases within minutes is the classic plantar fasciitis pattern. The mechanism, the diagnostic self-check, and the 4-week protocol.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Why does my heel hurt only in the morning?",
        a: "The plantar fascia settles into a shortened position overnight. The first weight-bearing step of the day stretches that shortened tissue cold and fast, and if the fascia is inflamed at the heel attachment (plantar fasciitis), that sudden stretch registers as sharp pain. Ten minutes of walking warms the tissue back up and the pain eases.",
      },
      {
        q: "Is morning heel pain always plantar fasciitis?",
        a: "Not always, but most often yes in adults over 40. Achilles insertional pain hurts behind the heel rather than under it. A stress fracture produces constant deep bone pain that gets worse with activity, not first-steps pain that eases. Fat pad atrophy feels bruised and diffuse rather than sharp. If your pain follows a sharp-first-steps-that-eases pattern, plantar fasciitis is by far the most likely cause.",
      },
      {
        q: "How long does it take for plantar fasciitis to go away?",
        a: "About 80% of cases resolve within 6 to 12 weeks of consistent daily stretching. Most men see meaningful reduction in morning pain by week 4 and near-resolution by week 8. Cases that persist past 12 weeks usually need a podiatrist consult rather than more of the same protocol.",
      },
      {
        q: "Should I keep walking on it or rest?",
        a: "Keep walking; add the stretch protocol. Rest doesn't fix plantar fasciitis, controlled tissue load does. Reduce high-impact activity like running or jumping during flare weeks, but maintain daily walking and the morning stretch. The threshold rule: pain during activity should stay under 3 out of 10 and return to baseline within 24 hours.",
      },
      {
        q: "When should I see a podiatrist for morning heel pain?",
        a: "Book the visit if pain hasn't improved after 6 weeks of consistent daily stretching, if it becomes constant rather than first-steps only, if numbness or tingling enters the picture, if there is visible swelling or warmth, if you have diabetes with any change in foot pain, or if the pain followed a fall or awkward step.",
      },
    ],
    sources: [
      {
        label: "NIH / NCBI — Plantar Fasciitis (StatPearls)",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
      },
    ],
  },
  "plantar-fasciitis-exercises-for-men-over-40": {
    metaTitle: "Plantar Fasciitis Exercises for Men Over 40: What Actually Works",
    metaDescription:
      "The 3 morning stretches, the 3 strength moves, the weekly progression, and the mistakes that keep the pain going. Ranked by evidence, calibrated for men over 40.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "What is the single best exercise for plantar fasciitis?",
        a: "Single-leg calf raises with the heel over the edge of a step and a slow three-second lowering phase. That eccentric loading has the strongest evidence in the current physical therapy literature and outperforms conventional stretching in a meaningful share of stubborn cases. Do it three times a week, not daily, so the tissue can adapt.",
      },
      {
        q: "How often should I stretch for plantar fasciitis?",
        a: "Every morning before your first step, and again after any period of sitting longer than 20 minutes. The morning session is the highest-leverage window because the fascia is at its most shortened after overnight rest. Missing a morning resets some of the previous day's tissue-length gains, so consistency matters more than intensity.",
      },
      {
        q: "Can plantar fasciitis exercises make it worse?",
        a: "Briefly, in week 1, as inflamed tissue loads for the first time in a while. That's expected and not a signal to stop. The rule: pain during exercise should stay under 3 out of 10, and next-day pain should return to your baseline within 24 hours. If either fails, drop the load and rebuild slower rather than pushing through.",
      },
      {
        q: "How long until I see improvement from the exercises?",
        a: "Week 4 is the first honest checkpoint: morning pain should be noticeably shorter in duration and lower in peak intensity. By week 8, most men who do the protocol consistently are under 2 out of 10 for morning pain. If nothing has moved by week 4, layer in a night splint. If nothing has moved by week 12, book a podiatrist.",
      },
      {
        q: "Do I need a night splint for plantar fasciitis?",
        a: "Not on day one. Add a night splint only if morning pain has not improved by week 3 or 4 of consistent daily stretching. The splint holds the foot at a slight upward angle overnight so the fascia stays at working length, which makes the morning stretch warm rather than cold. Evidence is moderate but positive for chronic cases.",
      },
      {
        q: "Should I stop running with plantar fasciitis?",
        a: "Only if running keeps pain above 3 out of 10 during activity, or if next-day pain doesn't return to baseline within 24 hours. If either fails, swap to swimming or cycling for a few weeks until the baseline drops, then reintroduce running gradually. Complete rest doesn't accelerate healing; controlled load does.",
      },
    ],
    sources: [
      {
        label: "NIH / NCBI — Plantar Fasciitis (StatPearls)",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html",
      },
    ],
  },
  "arches-hurt-after-walking": {
    metaTitle: "Why Your Arches Hurt After Walking (And How to Strengthen Them)",
    metaDescription:
      "Arch pain after a long walk usually traces to weak intrinsic muscles or over-supportive shoes doing the muscles' work. The self-check that tells you which, and the strength protocol that fixes both.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Why do my arches hurt only after walking?",
        a: "The small intrinsic muscles that share load with the plantar fascia and the tibialis posterior tendon fatigue under sustained walking, and once they're tired the arch structure has to hold itself up with less support. That's the ache. It builds gradually over the day rather than showing up in a single moment, and it eases fast with rest, which is what distinguishes it from morning heel pain (plantar fasciitis).",
      },
      {
        q: "Are flat feet the same as fallen arches?",
        a: "No. Congenital flat feet are structural, usually symmetric, and often painless throughout life. Acquired fallen arches (posterior tibial dysfunction) is progressive, usually asymmetric, and often shows up with inner-ankle pain rather than arch pain. If one arch looks visibly flatter than the other or has collapsed in the last year, that's the acquired version and it needs a podiatrist before you strengthen through it.",
      },
      {
        q: "Should I wear arch support if my arches hurt?",
        a: "Short-term yes if you're on your feet 8 or more hours daily for work. Long-term, over-reliance perpetuates the weakness that caused the pain, because the shoe does the intrinsics' job and the muscles never contract. The rule: if you use an insole, still do the strength protocol. The insole is scaffolding while you build the muscles, not a permanent replacement.",
      },
      {
        q: "What exercises strengthen the arch?",
        a: "The short-foot activation drill is the foundation: sitting or standing with the foot flat, draw the ball of the foot toward the heel without curling the toes, hold five seconds, release. 10 reps per side, twice a day. Progress from seated to standing to single-leg over four weeks. Add towel scrunches for the toe flexors.",
      },
      {
        q: "How long does it take to strengthen weak arches?",
        a: "4 to 8 weeks of consistent daily short-foot activation plus graded walking volume resolves most training-related arch pain. Increase weekly walking by no more than 10 percent so the muscles can keep up. If pain persists past 8 weeks despite consistency, escalate to a podiatrist to rule out structural arch collapse.",
      },
    ],
    sources: [
      {
        label: "PMC — Incorrectly Fitted Footwear, Foot Pain and Foot Disorders",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
      },
      { label: "American Podiatric Medical Association", url: "https://www.apma.org/" },
    ],
  },
  "achilles-tendon-pain-in-men-over-40": {
    metaTitle: "Achilles Tendon Pain in Men Over 40: What Actually Works",
    metaDescription:
      "Achilles pain that flares with running, hills, or first steps after sitting is usually the calf pulling on the tendon. The eccentric-load protocol with the strongest evidence, and when to escalate.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Is Achilles pain in men over 40 always tendonitis?",
        a: "The clinically correct term is tendinopathy, not tendonitis, because most Achilles pain past 40 involves degenerative changes in the tendon rather than acute inflammation. The name matters because inflammation responds to rest and ice, and tendinopathy needs graded loading. Rest alone lets the tendon get weaker, not stronger.",
      },
      {
        q: "Why does it hurt worse in the morning?",
        a: "The tendon and calf settle into a shortened position overnight. The first weight-bearing steps stretch that cold, tight tissue fast, and if the tendon has degenerative changes at the calcaneal insertion or mid-portion, the sudden stretch registers as sharp pain. Same mechanism as morning plantar fasciitis, different tissue.",
      },
      {
        q: "Can I keep running through it?",
        a: "Sometimes, at a reduced volume, with the eccentric-load protocol running in parallel. Pain during the run under 3 out of 10 is a workable ceiling; pain the next day back to baseline within 24 hours is a workable dose. If either threshold is breached, back off volume by half for a week and retry. Complete rest for weeks tends to make the tendon worse, not better.",
      },
      {
        q: "How long until eccentric heel drops start working?",
        a: "Most men see meaningful reduction in Achilles pain by week 6 to 8 of consistent daily eccentric loading. Some see it earlier (week 3 to 4), some later (week 12). If nothing has changed by week 12 despite consistency, book a sports podiatrist to rule out a partial tear.",
      },
      {
        q: "Do heel lifts help?",
        a: "Short-term, yes; long-term, no. A small heel lift (5 to 12 mm) reduces tension on the Achilles during walking, which lets the tendon quiet down. But wearing one indefinitely allows the calf to shorten further, which is the upstream cause of most Achilles pain in the first place. Use for 4 to 8 weeks alongside the eccentric protocol, then wean off.",
      },
      {
        q: "When is it a partial tear versus tendinopathy?",
        a: "Partial tears usually follow a specific event (a sprint, a jump, a step off a curb) with a sharp popping sensation, and the pain is severe enough that you can't push off. Tendinopathy is gradual, achy, and worse with load rather than instantly disabling. If it started with a specific painful moment, see a podiatrist before starting any protocol.",
      },
    ],
    sources: [
      {
        label: "PubMed — Eccentric heel-drop protocol for Achilles tendinopathy (Alfredson 1998)",
        url: "https://pubmed.ncbi.nlm.nih.gov/9617396/",
      },
      {
        label: "NIH StatPearls — Achilles Tendinopathy",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK538149/",
      },
      {
        label: "AAFP — Chronic Achilles Tendon Disorders",
        url: "https://www.aafp.org/pubs/afp/issues/2019/0715/p86.html",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Routine sub-page SEO catalog (2026-09-10). Parallel to guideSeo but for
// /routines/[slug]. Ships 3 of 6 categories initially (movement, recovery,
// strength); daily is covered by /guides/5-minute-routine, weekly + treatment
// deferred pending measurement.
// ─────────────────────────────────────────────────────────────────────────────
export const routineSeo: Record<string, GuideSeo> = {
  movement: {
    metaTitle: "The Plantar Stretch Sequence: A 3-Minute Morning Routine",
    metaDescription:
      "The three-move plantar and calf stretch protocol men over 40 can do in bed. Three minutes, done before your feet hit the floor. Four weeks to noticeable morning-pain reduction for most.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Why is the morning stretch specifically important?",
        a: "The plantar fascia and calves settle into a shortened position overnight. The first step lands on cold, shortened tissue, which is why morning heel pain is sharper than pain at any other time of day. Stretching the tissue back to working length before the first weight-bearing step is what changes what that step feels like.",
      },
      {
        q: "Can I do this stretch protocol every day, or is that too much?",
        a: "Every day. Stretching is not the same as loading; the tissue adapts to length daily and detrains within about 48 hours if you skip. Daily is the mechanism. If you can only do it every other day, you'll still get some benefit, but the results plateau earlier.",
      },
      {
        q: "What if I don't have a towel or band?",
        a: "Loop your hands around the ball of your foot and pull the toes back toward your shin. Same stretch, same 30-second hold. The band is a convenience, not a requirement. Do the version you'll actually do.",
      },
      {
        q: "How long until I feel a difference?",
        a: "Most men over 40 doing this daily see meaningful reduction in morning stiffness by week 4. Sharp first-steps pain typically eases within 2 minutes rather than 8 by week 4, and drops to under 2 out of 10 for most by week 8. If nothing has changed by week 4, add strength work or see a podiatrist.",
      },
      {
        q: "Should I do this if I don't have plantar fasciitis?",
        a: "Yes if you're over 40 and sit for a living. The calf and fascia stiffen over decades of sitting and shod feet; the morning stretch is preventive as much as treatment. If you're already doing it as prevention and pain shows up anyway, you'll have a much easier time reversing it.",
      },
    ],
    sources: [
      {
        label: "NIH StatPearls — Plantar Fasciitis",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
      {
        label: "PubMed — High-load strength training in plantar fasciitis (Rathleff 2015)",
        url: "https://pubmed.ncbi.nlm.nih.gov/25145882/",
      },
    ],
  },
  recovery: {
    metaTitle: "The 6-Minute Foot Recovery Routine: Arch Release with a Ball",
    metaDescription:
      "How to release a tight plantar fascia and tired arches at home with a lacrosse or tennis ball. Six minutes total, three techniques, evidence-based. Not for acute flares.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Lacrosse ball or tennis ball, does it matter?",
        a: "Lacrosse ball for men over 40 whose feet have been on hard floors for decades. Tennis ball is softer and easier to start on if the lacrosse ball is uncomfortable, but it dissipates pressure over a wider area, which is less effective for a specific tender spot. Start with tennis, graduate to lacrosse.",
      },
      {
        q: "How hard should the pressure be?",
        a: "5 or 6 out of 10 on a pressure-discomfort scale. It should be uncomfortable enough that you can feel exactly where the muscle is releasing, but not so hard you're tensing up or holding your breath. Grinding harder is not more effective; it's how bruising happens.",
      },
      {
        q: "Can I do this during a plantar fasciitis flare?",
        a: "No. Aggressive rolling on inflamed tissue extends the flare rather than accelerating recovery. Wait until sharp first-steps pain is under 3 out of 10 for a full week before starting release work. In the meantime, use the movement routine and stay off hard floors barefoot.",
      },
      {
        q: "When during the day should I do this?",
        a: "End of day, after your feet have been loaded. That's when the intrinsic muscles are tightest and when release has the most to work on. Some men prefer 20 minutes after taking their shoes off, some prefer it as the last thing before bed. Either works.",
      },
      {
        q: "How often should I do it?",
        a: "Daily during the first 2 weeks of a build-up (post-standing, post-long-walk, post-shoe-change). After that, most men shift to alternate days as maintenance. Every day forever is fine too; it doesn't overtrain the tissue the way daily strength work would.",
      },
    ],
    sources: [
      {
        label: "PubMed — Myofascial release for plantar fasciitis (Ajimsha 2014)",
        url: "https://pubmed.ncbi.nlm.nih.gov/24519605/",
      },
      {
        label: "NIH StatPearls — Plantar Fasciitis",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
    ],
  },
  weekly: {
    metaTitle: "The Sunday Foot Reset: A 20-Minute Weekly Routine for Men",
    metaDescription:
      "Foot soak, nail trim, callus knock-down, heel cream with socks overnight. Twenty minutes once a week. What most men skip until the cracks get bad, and how to stop that.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Why Sunday specifically?",
        a: "Any day works, but Sunday tends to stick because it doesn't compete with a workday and it primes the feet for the week ahead. Pick a day and hold it, whichever day makes it a habit. The consistency matters more than the specific day.",
      },
      {
        q: "How hot should the foot soak be?",
        a: "Comfortably warm, not hot. Around 100 to 104 F. Hot water strips more skin oil than warm water, which is counterproductive when the point of the routine is skin recovery. If it's too hot to keep your hand in, it's too hot for your feet.",
      },
      {
        q: "Epsom salts or just plain water?",
        a: "Plain works fine for most men. Epsom is a magnesium sulfate salt; the evidence for magnesium absorption through skin is weak, but the warm water plus the ritual of adding something makes people more consistent with the soak. Use it if it helps you stick with the routine.",
      },
      {
        q: "Do I really need to trim nails weekly?",
        a: "No. Most men over 40 need a nail trim every 2 to 3 weeks. What the weekly routine catches is nails that grew unevenly or picked up a rough edge, before that rough edge tears a sock or catches. A 30-second inspection with the trimmer nearby is the point, not always a full trim.",
      },
      {
        q: "Can I do the routine in the shower instead of a soak?",
        a: "Yes, but you lose the softening effect. A 10-minute warm soak softens callus and hard skin in a way a 3-minute shower doesn't. If you skip the soak, add urea cream (10 to 25 percent) after the shower to compensate; that's what makes the callus knock-down step actually work.",
      },
    ],
    sources: [
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2019/1015/p498.html",
      },
    ],
  },
  strength: {
    metaTitle: "Foot Strengthening for Men Over 40: The Weekly Protocol",
    metaDescription:
      "Three foot-strengthening exercises men over 40 can do in 5 minutes, three times a week. Wakes up the small foot muscles that decades of supportive shoes atrophied. Not a stretch routine. This is load.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "Why three times a week instead of daily?",
        a: "Strength work adapts on rest days, not on load days. Daily strength loading of the same muscle group is where overuse injuries come from. The intrinsic foot muscles are small; they need 48 hours between sessions to get stronger. Every day is not more; it's less.",
      },
      {
        q: "Can I do this if my feet already hurt?",
        a: "Start with the stretch routine first, get pain down to under 3 out of 10, then add strength work in week 2 or 3. Loading tissue that's currently in a flare doesn't accelerate healing; it extends it. Prescribe order matters.",
      },
      {
        q: "How long until I get stronger?",
        a: "Most men over 40 can't do a proper short-foot activation on the first try. The intrinsics have been dormant for decades. It takes 2 to 3 weeks of practice to isolate the muscle at all. Actual strength gains show up around week 4 to 6, and structural change (less arch collapse under load) shows up around week 8 to 12.",
      },
      {
        q: "Do I need equipment?",
        a: "A hand towel is enough. Some men add a resistance band for toe-spread work or a wobble board for progression, but neither is required. The three foundational exercises use no equipment beyond the towel.",
      },
      {
        q: "Should I stop if I feel muscle soreness?",
        a: "Mild soreness the day after is normal and expected; it's the same mechanism as any strength work. Sharp pain during the exercise is a signal to stop; that's not adaptation, it's irritation. Muscle soreness that lasts more than 3 days means the dose was too high.",
      },
    ],
    sources: [
      {
        label: "PubMed — Intrinsic foot muscle strengthening (Mulligan 2013)",
        url: "https://pubmed.ncbi.nlm.nih.gov/23570729/",
      },
      {
        label: "PubMed — High-load strength training in plantar fasciitis (Rathleff 2015)",
        url: "https://pubmed.ncbi.nlm.nih.gov/25145882/",
      },
    ],
  },
};

/** Build the Next.js Metadata for a guide route (title, description, canonical, OG).
 *  SEO Bundle 3: title: { absolute } prevents the root template from double-
 *  appending " | Men's Sole Revival" (guides currently 42-50 chars land at
 *  60-66 after templating — over Google's SERP truncation window). */
export function buildGuideMetadata(slug: string): Metadata {
  const seo = guideSeo[slug];
  const meta = articles[slug];
  if (!seo) return {};
  const canonical = `/guides/${slug}`;
  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: `${SITE_URL}${canonical}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
    ...(meta?.category ? { keywords: [meta.category, "men's foot health"] } : {}),
  };
}

/** Article + FAQPage JSON-LD for a guide, grounded in its visible content.
 *  SEO Bundle 2 fix: Article.author now Person (Alfonso), not Organization —
 *  required for Article rich-result eligibility. Split published/modified so
 *  Google can differentiate content freshness signals. */
export function buildGuideSchema(slug: string) {
  const seo = guideSeo[slug];
  const meta = articles[slug];
  if (!seo) return [];
  const url = `${SITE_URL}/guides/${slug}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.metaTitle,
    description: seo.metaDescription,
    datePublished: seo.datePublished,
    dateModified: seo.dateModified ?? seo.datePublished,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: "Alfonso Barreiro",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(meta?.imageUrl ? { image: `${SITE_URL}${meta.imageUrl}` } : {}),
    ...(meta?.category ? { articleSection: meta.category } : {}),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // SEO Bundle 4: BreadcrumbList for guide leaf. Trail: Home → Guides → {this article}
  const breadcrumb = buildBreadcrumb([
    { name: "Guides", path: "/guides" },
    { name: seo.metaTitle, path: `/guides/${slug}` },
  ]);

  return [article, faqPage, breadcrumb];
}

// ─────────────────────────────────────────────────────────────────────────────
// Routine metadata + schema (2026-09-10). Mirrors buildGuideMetadata /
// buildGuideSchema but points canonical + JSON-LD trail at /routines/[slug].
// ─────────────────────────────────────────────────────────────────────────────
export function buildRoutineMetadata(slug: string): Metadata {
  const seo = routineSeo[slug];
  if (!seo) return {};
  const canonical = `/routines/${slug}`;
  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: `${SITE_URL}${canonical}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

export function buildRoutineSchema(slug: string) {
  const seo = routineSeo[slug];
  if (!seo) return [];
  const url = `${SITE_URL}/routines/${slug}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.metaTitle,
    description: seo.metaDescription,
    datePublished: seo.datePublished,
    dateModified: seo.dateModified ?? seo.datePublished,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: "Alfonso Barreiro",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = buildBreadcrumb([
    { name: "Routines", path: "/routines" },
    { name: seo.metaTitle, path: `/routines/${slug}` },
  ]);

  return [article, faqPage, breadcrumb];
}
