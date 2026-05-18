# Open card sort plan — MSR information architecture

**Status:** ready to recruit
**Owner:** Alfonso Barreiro
**Date drafted:** 2026-05-15

A short, focused study to validate how men in the target audience
group and name the categories the assessment uses. The result will
either confirm the current labels (Nail Health, Skin & Heels, Pain &
Inflammation, Alignment & Structure, Footwear Fit) or expose the
vocabulary mismatch Cate's audit anticipated.

---

## 1. Goal

Two questions, one study:

1. **Are the five assessment section labels the right grouping?** Do
   men cluster the same concepts together, or do they split / merge
   the categories?
2. **Are the labels themselves the right words?** Do men reach for
   "Alignment & Structure" or for "Knee pain that starts at my toes"?
   Do they distinguish "Skin & Heels" from "Cracked heels"?

Secondary: surface any concepts that exist in the user's head but
nowhere on the site (and any site labels nobody picks).

---

## 2. Method

**Open card sort.** Participants receive a stack of 24 unlabeled
cards (each one a symptom, behavior, or product type) and are asked
to group them however makes sense, then name each group themselves.

Open (rather than closed) because the question is whether the
current labels match the user's mental model — a closed sort would
bake in the labels we're trying to test.

**Tool:** OptimalSort (or Maze if Alfonso's seat covers it). Both
support remote unmoderated runs with screen-recording optional.
**Fallback:** paper cards with screenshare, moderated 15 min per
participant.

**Duration:** 12–15 minutes per participant. No incentive needed
above a $20 Amazon gift card.

---

## 3. Cards (24)

Each card is a short concrete phrase a participant might recognize.
Avoid clinical jargon. Avoid existing site labels.

### Symptoms (12)

1. Toenail looks thick and yellow
2. Toenail crumbles at the edges
3. Heel pain in the morning
4. Cracked, splitting heel skin
5. Bunion on the side of my big toe
6. Itchy skin between toes
7. Knee pain when I stand up
8. Foot is wider than it used to be
9. Toes feel cramped in shoes
10. Big toe stiff or won't bend
11. Burning sensation in the ball of the foot
12. Hammertoe (toe bent permanently)

### Behaviors and habits (6)

13. Cutting toenails
14. Soaking feet
15. Stretching feet and calves
16. Putting on lotion or cream
17. Wearing dress shoes
18. Wearing sandals or slip-ons

### Products and tools (6)

19. Insoles
20. Antifungal cream
21. Heel cream or moisturizer
22. Toe spreaders or separators
23. Foot powder
24. Wide-toe-box sneakers

---

## 4. Participants

**Target sample:** 10 men.

**Screening criteria:**

- Age 35–65 (peak risk window per `MSR-Research-Mens-Foot-Health.md`)
- US-based (English-only, regulatory and footwear context)
- Has experienced at least one of: chronic foot pain, toenail change,
  cracked heels, or shoes that "don't fit right" (any one is enough)
- Not in podiatry, footwear retail, or biomechanics professionally

**Recruitment channels (in priority order):**

1. Personal network (LinkedIn DMs to second-degree connections in
   the age band)
2. Reddit: r/MalePattern, r/Frugal, r/AskMen — short post asking for
   12 min of time
3. UserInterviews.com if the first two don't fill 10 slots in a week

**Recruitment script (DM / post body):**

> Hey, I'm doing a short usability study for a foot-health site I'm
> designing for men over 40. It's about how to name the categories
> on the site, not selling anything. Takes 12–15 minutes, you can
> do it on your own time, and I'll send you a $20 Amazon gift card.
> Looking for guys 35–65 who have dealt with foot stuff at some
> point (cracked heels, toenail issues, knee pain that comes from
> the feet, shoes that hurt — any of that). DM me if you're game
> and I'll send the link.

---

## 5. Analysis

Once 10 sorts are in:

1. **Group similarity matrix.** OptimalSort produces one
   automatically; for paper runs, build it by hand. Read where the
   strong clusters fall vs. the assessment's current sections.
2. **Standardized labels.** Group participant-named groups by
   meaning. Note which words come up repeatedly ("toes", "skin",
   "fungus", "fit"). Compare against the current section names.
3. **Mismatches to flag.** Any card that splits 50/50 across two
   clusters is a candidate for cross-listing in the IA. Any cluster
   the participants make that isn't on the site is a gap.

---

## 6. What "done" looks like

A short writeup (`card-sort-results.md`) with:

- The similarity matrix (image)
- The five most common participant-named groups
- A side-by-side table: current label vs. user-preferred label
- Three concrete IA decisions to make based on the data
- The raw data attached (CSV from OptimalSort, or the paper sheets
  scanned in)

---

## 7. Open questions

1. **Should "Pain" be a top-level section, or do men think in terms
   of where the pain is (heel pain, knee-from-foot pain, ball-of-foot
   pain)?** If the latter, the assessment's pain section is grouped
   wrong.
2. **Do men separate "footwear fit" from "alignment"?** They're
   medically related — your shoes shape your toe alignment over
   decades — but a user may not see the connection.
3. **Where does the "Itchy skin between toes" card land?** If it
   clusters with "Cracked heels" (skin) rather than with "Toenail
   fungus" (fungal), the assessment's section split is wrong; both
   are fungal infections but they look like different problems.

---

## 8. Next steps

1. Open the OptimalSort account, set up the study, paste in the
   24 cards.
2. Send the recruitment script to the first wave (personal network).
3. Run for two weeks. Close when ten complete sorts are in.
4. Write up `card-sort-results.md`. Hand back to Cate.
5. Apply the IA changes the data justifies; document the ones it
   doesn't.
