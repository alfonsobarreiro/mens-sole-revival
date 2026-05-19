# Content-UX inventory — Men's Sole Revival

**Status:** living document
**Updated:** 2026-05-15

Cate's punch list called for "making the content-UX work explicit:
hierarchy reductions, progressive disclosure, trust signals,
scannability patterns, non-clinical feel." This document inventories
where each move shows up on the live site, so the work is legible
without having to scroll the codebase.

The categories below are Cate's. The examples are specific (route +
component) so anyone reviewing the site can find the move on the page.

---

## 1. Hierarchy reduction

Cutting the visual noise so the user lands on the next action rather
than the brand statement.

| Where | Move |
|---|---|
| Homepage hero (`app/page.tsx`) | Primary CTA "Take the Assessment" + secondary CTA "Browse Guides" rendered at the same size but different weights (solid vs. outline). Microcopy "5-minute self-check · find out where to start" anchors the entry, not a manifesto line. |
| `AssessmentEntryStrip` on Learn / Routines / Reviews | One headline, one paragraph, one CTA. No icon, no decorative photo. Brand-50 background carves it visually from the surrounding content. |
| `/learn` filter bar | Replaced category tabs (a low-signal taxonomy) with symptom chips (the user's actual vocabulary). Counts visible on each chip so the user can see where the content is concentrated. |
| Assessment hero (`app/assessment/page.tsx`) | Single H1, single paragraph, single CTA stack. No stats deck above the fold. |
| Article hero (`components/ArticleLayout.tsx`) | Image + category tag + read time + title. No subhead, no author meta block. The reader gets to the prose after one scroll. |

---

## 2. Progressive disclosure

Surface the decision; defer the supporting detail.

| Where | Move |
|---|---|
| Assessment sections | Each question step shows only the seven check items for that section. Stats and clinical notes appear only after the user completes the section, not before. |
| Assessment results | The summary tile shows the headline + recommendation. Per-section flag breakdown is below. Product recs are below that. Sources are at the bottom in a dimmer panel. The user can stop reading at any layer and still have an answer. |
| Routine cards (`app/routines/page.tsx`) | The label, heading, and time stamp are above the fold of each card. The body copy and frequency note sit below. The user can scan all six routines without reading. |
| Review detail | Verdict + rating in the hero. Pros and cons next. "Why it works" and "Who it's for" lower. Sources last. |
| `<details>` blocks in MDX articles | The MDX renderer (`mdx-components.tsx`) maps any HTML `<details>` to a styled disclosure. Used inside long-form guides for "Want to know why" tangents that would otherwise interrupt the line of thought. |

---

## 3. Trust signals

Every clinical or behavioral claim should be sourced.

| Where | Move |
|---|---|
| Homepage stats | Each of the two stats has a "Source: ..." link directly below. Citations to APMA and PMC are inline, not in a buried bibliography. |
| Assessment stats | Each of the five section stats has a stat value, label, source name, and source URL rendered as a clickable annotation. |
| Assessment Sources panel | A consolidated source list (APMA, NIH/NCBI, Gupta et al., PMC, AAFP) appears at the bottom of the results screen. |
| Review detail "Why it works" | The mechanism is described in clinical terms (terbinafine, urea %, etc.) but in lay language. The product evidence comes before the verdict, which arrives last. |
| Affiliate disclosure | Inline label under any affiliate CTA: "Affiliate link — we may earn a commission at no extra cost to you." (To-do: replace the inline em dash here in the same content-UX pass that hits the long-form review prose; see §6.) |
| Footer attribution | "Built by Alfonso Barreiro · UX/UI Designer · Portland, OR" with resume, LinkedIn, and meeting links. Tells the user who's behind the site. |

---

## 4. Scannability patterns

| Where | Move |
|---|---|
| Article headings | Body uses `prose` recipe with `<h2>` and `<h3>` rhythms styled for fast skimming. Article body width is capped at a narrow column. |
| Numbered "what to do" sections in articles | Each major recommendation in an article is a numbered `<h3>`: "1. Urea cream", "2. Timing matters more than frequency", "3. Socks at night". A reader can ladder down the page and pick the move that's relevant. |
| Routine cards | Each card has a single verb-led heading ("The nightly 5 minutes", "The Sunday reset", "Plantar stretch sequence"). Body is two sentences max. Time + frequency in a single line at the bottom. |
| Review pros and cons | Two-column grid. Pros and cons run as bulleted, action-led lines, not paragraphs. |
| Assessment check items | Each item is a single sentence starting with the visible thing. "Nails are thick, yellowed, white, or brittle." not "Look at your nails and consider whether they appear..." |
| Symptom chips on /learn | Each chip is two words max and carries a count so the user knows the size of the category before tapping. |

---

## 5. Non-clinical feel

The audience research says men in the target band are 33% less likely
than women to seek care. Tone has to defuse, not lecture.

| Where | Move |
|---|---|
| Defusing lines | "Cracking is biology, not hygiene." (Assessment section 02). "Foot pain is information." (Section 03). These give the user language for what they're seeing before any prescription. |
| Imagery | Hero and article images show feet in real-world contexts (stretching on a railing, applying lotion, walking barefoot) rather than clinical close-ups of pathology. |
| Voice rule | No em dashes in user-facing copy (see `feedback_no_em_dashes` in vault memory). Periods, commas, and middle dots carry the same beats without the "AI-tell" feel. |
| Routine labels | "The nightly 5 minutes", "The Sunday reset" — habit framings, not protocol names. |
| Result tier headlines | "You're in pretty good shape" / "Worth addressing now" / "It's been building a while". Not "Low risk" / "Moderate" / "High". |
| Affiliate language | "We don't review products we wouldn't actually recommend." Stated, not soft-pedaled. |

---

## 6. Open items (deferred to a later pass)

Where the audit found gaps but the fix didn't ship in this batch.

1. **Long-form review prose has unresolved em dashes.** `app/reviews/[slug]/page.tsx` contains roughly 40 em dashes in the summary, pros/cons, "Why it works", and "Who it's for" copy. Each substitution is a voice judgment, so the top-of-funnel sweep stopped at the section-page level. A dedicated review-prose pass should run before Cate sees the deep funnel.
2. **Article MDX bodies have em dashes.** Same reasoning. The hero copy and excerpts are clean; the article bodies (the actual long reads) carry the most em dashes by volume.
3. **Source attribution on article bodies.** Articles cite mechanisms (urea %, terbinafine) but don't always link to the supporting study. The assessment and homepage both do. Articles should match.
4. **"Why we built this" page audit.** `/about` was not touched in this pass. It probably needs the same hero-microcopy and tone-audit treatment as the homepage.
5. **PDF assessment results.** The current generator is client-side and the output is formatted as a tier+flags summary. Per `MSR-Assessment-Redesign.md` §3.5, this should become a "doctor visit" artifact with podiatrist-prep bullets at the top. Will land with the assessment redesign in code.
6. **PDF typography family match.** The doctor-visit PDF currently uses helvetica + times as stand-ins for DM Sans + Lora + Barlow Condensed. Sizes, weights, and layout match the on-screen results page exactly, but the typefaces themselves do not. jsPDF's TTF parser can't read the modern Google Fonts TTFs (they ship cmap format 12; jsPDF needs format 0/4). Two paths to fix: (a) switch to pdf-lib (uses fontkit, handles modern TTFs cleanly) or (b) find a jsPDF-compatible TTF source. (a) is the durable answer.

---

## 7. How to use this file

When Cate (or anyone else) asks "where is the content-UX work?", point
them here. Each row is a specific move on a specific route. When new
moves ship, add them with the same row format. When a §6 open item
closes, move it up into the relevant category with the receipts.
