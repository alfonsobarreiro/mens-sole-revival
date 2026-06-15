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

export type GuideFaq = { q: string; a: string };
export type GuideSource = { label: string; url: string };

export type GuideSeo = {
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
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
};

/** Build the Next.js Metadata for a guide route (title, description, canonical, OG). */
export function buildGuideMetadata(slug: string): Metadata {
  const seo = guideSeo[slug];
  const meta = articles[slug];
  if (!seo) return {};
  const canonical = `/guides/${slug}`;
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: `${SITE_URL}${canonical}`,
      type: "article",
    },
    ...(meta?.category ? { keywords: [meta.category, "men's foot health"] } : {}),
  };
}

/** Article + FAQPage JSON-LD for a guide, grounded in its visible content. */
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
    dateModified: seo.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
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

  return [article, faqPage];
}
