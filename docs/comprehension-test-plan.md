# Comprehension test plan — Assessment results screen

**Status:** ready to run
**Owner:** Alfonso Barreiro
**Date drafted:** 2026-05-15

A short, focused test to validate whether the assessment results
screen communicates a clear next action. Runs in parallel with the
open card sort (`card-sort-plan.md`); the card sort tests IA labels,
this tests whether the results page does its job.

---

## 1. Goal

Two questions, one study:

1. **Five seconds in: what does the user think they're supposed to do?**
   The result screen leads with articles, routine, podiatrist-prep, in
   that order. We want >80% of participants to name at least one
   specific next action — read a guide, try a routine, or see a
   podiatrist — without prompting.

2. **Is the "First move" line on each block doing real work?** The
   "Read &amp; do" copy upgrade added an explicit single-line action
   under each article + routine. Does that translate into the user
   knowing what to do, vs. just knowing what to read?

---

## 2. Method

**Five-second test + open recall.** Show participants a screenshot of
a real result screen for 5 seconds. Hide. Then ask:

1. **What did you just see?** (open recall — captures what registered)
2. **What would you do next?** (specific action they'd take)
3. **Was anything confusing?** (catches what didn't land)

Then show the screenshot again, untimed, and ask:

4. **What's the most useful piece on this page?**
5. **What's missing that would have helped?**

**Tool:** UsabilityHub for the five-second test (the platform was
literally built for this); follow-up questions in a short Zoom or
async DM thread. **Fallback:** Loom recording + manual scoring.

**Duration:** 10–12 minutes per participant. Same $20 incentive as
the card sort.

---

## 3. Stimulus (the screenshot)

Show a result generated from a realistic input pattern that exercises
the three blocks. Recommended:

- Symptom triage: Pain + Nails selected
- Pain section: 4 flagged items + duration = "Ongoing" (1–6 months)
- Nail section: 3 flagged items + duration = "Chronic" (6+ months)
- Skin section: 1 flagged item + duration = "Recent" (<1 month)

This produces:
- Per-section summary with three rows (one "Worth a podiatrist visit"
  badge from the Chronic nail bump)
- Clinic callout banner (recommendsClinic = true)
- Block 1: 3 articles, each with "First move" copy
- Block 2: Treatment routine card with "First move" copy
- Block 3: 1–2 podiatrist-prep bullets
- Email save + PDF + Restart

Capture the screenshot at 1280×800 on light mode after results render.

---

## 4. Participants

**Target sample:** 8 men.

**Screening criteria:**

- Age 35–65
- US-based
- Has had at least one foot or nail concern in the last year
- Not professionally in podiatry, footwear retail, or biomechanics
- Has never seen the MSR site before (recruit fresh)

**Recruitment:**

1. Same DMs as the card sort but a different time slot.
2. Filter so the same person doesn't do both studies (cross-recall
   would pollute the results).

---

## 5. Scoring

**Pass thresholds for the result screen to "work":**

| Question | Pass bar | Why |
|---|---|---|
| Q1 — What did you see? | ≥6/8 mention "next steps" or "things to do" | Tells us the structure registered, not just the visual |
| Q2 — What would you do next? | ≥7/8 name a specific action (read the X article, try the X routine, see a podiatrist) | This is the headline metric. The whole assessment exists to produce a specific next step. |
| Q3 — Anything confusing? | <2/8 cite any single block as confusing | A 2-of-8 confusion signal on the same block is a real revision target |
| Q4 — Most useful piece? | The three blocks together get >5/8 mentions; the per-section summary gets >2/8 | If the summary is dead weight, we know |
| Q5 — What's missing? | Open-coded for themes | Drives the next iteration |

If Q2 falls below 7/8, the result screen needs a copy or hierarchy
revision before sending traffic.

---

## 6. What we'll learn that we can't test in code

- **Is "Read &amp; do" understood as "you should do something" or as
  "two unrelated lists"?** The First-move line was designed to bridge
  the read-this vs. do-this gap. The participant either gets it or
  they don't, and the five-second test will surface that.

- **Does the clinic callout register?** When `recommendsClinic` is
  true, the accent-50 banner is visually prominent — but does it
  actually change what the user names as "what I'd do next"? If the
  banner triggers and Q2 still says "read the article," the banner
  isn't doing its job.

- **Is the per-section summary noise or signal?** If users don't
  remember it five seconds in and don't name it as useful in Q4, we
  should consider collapsing or removing it.

---

## 7. Next steps

1. Capture the stimulus screenshot from a fresh assessment run with
   the input above.
2. Set up the UsabilityHub study (or paper-Loom equivalent).
3. Recruit 8 men from the next wave (separate from the card sort
   participants).
4. Run the study. Two weeks should be plenty.
5. Write up `comprehension-test-results.md` with the pass/fail per
   question, the open-coded themes from Q5, and three concrete
   revisions to make based on the data.
6. Iterate the result screen if Q2 fails. Re-run with new participants.

---

## 8. Parallel quantitative signal

The site is now wired with GA events for the assessment flow (see
`lib/analytics.ts`). Once you send traffic, the cohort-level
quantitative signal that matches this study:

- `assessment_results_view` event fires per session
- `assessment_article_click` / `assessment_routine_click` fire per
  user choice on the result screen
- `assessment_email_save` and `assessment_pdf_download` fire on the
  two save paths
- `assessment_feedback_sent` carries the "Was this useful" answer

**Cohort question to answer with the GA data:**
What percentage of users who reach `assessment_results_view` also
fire at least one of `assessment_article_click` or
`assessment_routine_click`? If it's >60%, the result screen drives
behavior. If it's <30%, the result screen is a dead end. The
comprehension test tells us *why*; the GA tells us *how often*.
