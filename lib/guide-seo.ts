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
export type HowToStep = { name: string; text: string };

/** Optional HowTo schema payload — used only for routine sub-pages that are
 *  literally step-by-step protocols. Emitted as schema.org HowTo JSON-LD by
 *  buildRoutineSchema; Google surfaces these as rich-result "how to" cards
 *  on mobile SERPs when eligible. Since 2023 Google narrowed HowTo eligibility
 *  but still uses the schema for AI-overview snippets and mobile knowledge
 *  panels. Cost is small, upside is real. */
export type GuideHowTo = {
  /** ISO 8601 duration, e.g. "PT3M" for 3 minutes, "PT20M" for 20. */
  totalTime: string;
  /** Consumable items needed (e.g. cream, tape). */
  supplies?: string[];
  /** Reusable equipment (e.g. lacrosse ball, foam roller). */
  tools?: string[];
  steps: HowToStep[];
};

export type GuideSeo = {
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  /** Optional — falls back to datePublished. Bump when the article body
   *  meaningfully changes (Bundle 2 SEO fix: split freshness signals). */
  dateModified?: string;
  faq: GuideFaq[];
  sources: GuideSource[];
  /** Optional HowTo protocol data. Populate on routineSeo entries where the
   *  page is literally a step-by-step protocol. Skip on guideSeo entries
   *  (essays are not HowTos). */
  howTo?: GuideHowTo;
};

/** FAQ answers may carry Markdown-style links `[text](/path)`; the visible
 *  FAQ renders them as links (components/GuideExtras.tsx) and the JSON-LD
 *  gets plain text. */
export function stripInlineLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export const guideSeo: Record<string, GuideSeo> = {
  "swollen-feet-and-ankles": {
    metaTitle: "Swollen Feet and Ankles After 40: Causes and Red Flags",
    metaDescription:
      "Why feet and ankles swell after 40: gravity, amlodipine and other drugs, veins, heart, or a clot. Self-checks, compression socks, and same-day red flags.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Why are my feet swollen at the end of the day?",
        a: "Standing or sitting for hours turns off the calf muscle pump that pushes fluid back up from the feet, so it pools at the ankle. Heat, salt, extra weight, and age make it worse. If both feet swell evenly, pit under a thumb, and clear overnight, that is dependent edema, and elevation, walking, and light compression usually handle it.",
      },
      {
        q: "Why is only one ankle swollen with no injury?",
        a: "One-sided swelling points to something local: a vein problem, lymphedema, gout at a joint, a skin infection, or a clot. If it came on suddenly with calf pain, warmth, or skin that looks red or darker than the other leg, treat it as a possible deep vein thrombosis and get seen the same day. Even without those signs, new one-sided swelling deserves a prompt visit rather than a wait.",
      },
      {
        q: "Can amlodipine cause swollen ankles?",
        a: "Yes. Swelling of the ankles, feet, and legs is a listed common side effect of amlodipine and the other calcium-channel blockers. It happens because the drug widens small arteries more than veins, and water pills don't fix it well. Don't stop the drug on your own; ask the prescriber about a lower dose or a switch.",
      },
      {
        q: "Do compression socks help swollen feet?",
        a: "For gravity and vein-related swelling, yes. Over-the-counter graduated socks at 15 to 20 mmHg, worn from morning to night, are the usual starting point. Tighter grades are used for confirmed venous edema and should be a doctor's call, because compression is not safe with peripheral arterial disease.",
      },
      {
        q: "When should I worry about swollen feet and ankles?",
        a: "Same day if one leg swells suddenly with pain or warmth, if the skin is red, hot, and painful, if you have a fever, or if you have diabetes and notice any new change. Call 911 if swelling comes with shortness of breath, chest pain, or coughing up blood. Swelling that doesn't clear overnight or stains the skin brown needs a physician visit this week.",
      },
      {
        q: "Is swelling in both feet a sign of heart problems?",
        a: "It can be, but it is more often gravity or a medication. Heart failure swelling builds over days in both legs, doesn't clear overnight, and comes with breathlessness on exertion or lying flat and fast weight gain. Kidney and liver disease produce a similar pattern. Any of those signs together is a reason to see a physician promptly.",
      },
    ],
    sources: [
      {
        label: "AAFP \u2014 Edema: Diagnosis and Management (2013)",
        url: "https://www.aafp.org/pubs/afp/issues/2013/0715/p102.html",
      },
      {
        label: "MedlinePlus \u2014 Foot, leg, and ankle swelling (2025)",
        url: "https://medlineplus.gov/ency/article/003104.htm",
      },
      {
        label: "NHS \u2014 Swollen ankles, feet and legs (oedema) (2026)",
        url: "https://www.nhs.uk/conditions/oedema/",
      },
      {
        label: "NHS \u2014 Amlodipine: side effects (2026)",
        url: "https://www.nhs.uk/medicines/amlodipine/side-effects-of-amlodipine/",
      },
      {
        label: "NHS \u2014 DVT (deep vein thrombosis) (2026)",
        url: "https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/",
      },
    ],
  },
  "burning-feet-men-over-40": {
    metaTitle: "Burning Feet After 40: Neuropathy, Athlete's Foot, or Shoes",
    metaDescription:
      "Burning feet after 40: neuropathy, athlete's foot, circulation, or the shoe. Why it flares at night, the tests to ask for, and the red flags.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Why do my feet burn at night?",
        a: "Burning that flares in bed is the classic pattern of peripheral neuropathy. During the day the brain has other input; at night the misfiring nerves are the only signal, and the warmth under a blanket makes damaged fibers fire more. Burning at night that eases when you hang the foot off the bed is a circulation sign instead, and that one needs a vascular assessment soon.",
      },
      {
        q: "Is burning feet a sign of diabetes?",
        a: "It can be. Diabetes is the most common cause of peripheral neuropathy in the US, and roughly a quarter to a half of people with diabetes develop it. The damage can start in the years when blood sugar runs high but not yet in the diabetic range, so burning in both feet is a reason to get an A1c even if you have never been diagnosed.",
      },
      {
        q: "Can athlete's foot cause burning feet?",
        a: "Yes, and it is the easiest cause to spot. The burning is a burning itch between the toes, where the skin goes white, soggy, and cracked. It is a skin infection, not a nerve problem, and a drugstore antifungal used for the full course clears it.",
      },
      {
        q: "What is burning feet syndrome?",
        a: "It is an older name for burning in the soles with no obvious skin or shoe cause. In practice it usually turns out to be peripheral neuropathy from diabetes, alcohol, or a B12 deficiency, or in rare cases erythromelalgia. It is a description, not a diagnosis; bloodwork and a monofilament exam are what turn it into one.",
      },
      {
        q: "What vitamin deficiency causes burning feet?",
        a: "Vitamin B12 is the common one. Nerves need it, absorption drops with age, and two everyday medications make a deficiency more likely: metformin taken for more than a few months and acid reducers taken for more than a year. Get the level tested before taking a supplement; replacing B12 helps only if it is low.",
      },
      {
        q: "When should I see a doctor for burning feet?",
        a: "This week if there is new numbness with weakness, a wound that is not healing, unexplained weight loss, heavy drinking, a new medication, or if you have diabetes. Go to the ER if one foot suddenly turns cold, pale, and painful. Otherwise, book routine bloodwork for blood sugar, B12, thyroid, and kidney function within the month.",
      },
    ],
    sources: [
      {
        label: "AAFP \u2014 Peripheral Neuropathy: Evaluation and Differential Diagnosis (2020)",
        url: "https://www.aafp.org/pubs/afp/issues/2020/1215/p732.html",
      },
      {
        label: "NIDDK \u2014 Peripheral Neuropathy (2018)",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/nerve-damage-diabetic-neuropathies/peripheral-neuropathy",
      },
      {
        label: "AAFP \u2014 Vitamin B12 Deficiency: Recognition and Management (2017)",
        url: "https://www.aafp.org/pubs/afp/issues/2017/0915/p384.html",
      },
      {
        label: "Society for Vascular Surgery \u2014 Peripheral Artery Disease (accessed 2026)",
        url: "https://vascular.org/patients-and-referring-physicians/conditions/peripheral-arterial-disease",
      },
      {
        label: "NHS \u2014 Erythromelalgia (2023)",
        url: "https://www.nhs.uk/conditions/erythromelalgia/",
      },
    ],
  },
  "black-toenail-what-it-means": {
    metaTitle: "Black Toenail: Bruise, Fungus, or Melanoma? How to Tell",
    metaDescription:
      "Most black toenails are blood and grow out. The color sequence, when to drain one, how long regrowth takes, and the one band that needs a dermatologist.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Why is my toenail black?",
        a: "Most often it is blood under the nail, from one blow or from the toe hitting the front of a shoe over many miles. It goes red, then purple, then black, and grows out with the nail over months. Fungus, a bacterial stain under a lifted nail, and, rarely, melanoma can also darken a nail, so a band with no injury behind it should be checked.",
      },
      {
        q: "Will a black toenail go away on its own?",
        a: "A bruise under the nail does. The dark patch moves toward the tip as the nail grows and clears in 6 to 12 months, or the nail falls off and a new one grows in behind it. A dark band that stays at the cuticle and does not move is not a bruise and needs a dermatologist.",
      },
      {
        q: "Should I drain a black toenail myself?",
        a: "No. A fresh, very painful hematoma can be drained by a podiatrist or urgent care with a sterile tool in minutes. A heated paperclip at home risks a burn and an infection under the nail, which matters more if you have diabetes or poor circulation. If it does not hurt, it does not need draining.",
      },
      {
        q: "How long does it take for a toenail to grow back after it falls off?",
        a: "Toenails grow about 1.5 to 2 millimeters a month, and slower with age. Most toenails take 6 to 12 months to regrow, and a big toenail can take up to 18 months. The new nail may be ridged or thick for the first cycle. Leave the old nail on as long as it stays attached, since it protects the bed.",
      },
      {
        q: "How do I tell a bruise from melanoma under the toenail?",
        a: "A bruise sits under the plate and moves toward the tip as the nail grows, leaving clean nail behind it. A melanoma band is anchored at the base and does not move, and it may widen, darken at one edge, or spread pigment onto the skin at the cuticle. A new band on one nail in a man over 50 with no injury should be seen by a dermatologist without waiting.",
      },
      {
        q: "What is runner's toe and how do I stop it?",
        a: "Runner's toe is bleeding under the nail from the toe hitting the front of the shoe on every stride, usually on the longest toe. It comes from a shoe a half size short, long downhills, or loose laces that let the foot slide. Buy a thumb's width of room, use a heel-lock lacing, and trim nails straight across before long runs.",
      },
    ],
    sources: [
      {
        label: "American Academy of Dermatology \u2014 How to check your nails for melanoma (2021)",
        url: "https://www.aad.org/public/diseases/skin-cancer/types/common/melanoma/nail-melanoma",
      },
      {
        label: "American Family Physician \u2014 Evaluation of Nail Abnormalities (2012)",
        url: "https://www.aafp.org/pubs/afp/issues/2012/0415/p779.html",
      },
      {
        label: "NHS \u2014 Nail problems (2024)",
        url: "https://www.nhs.uk/conditions/nail-problems/",
      },
      {
        label: "ACFAS Foot Health Facts \u2014 Black Toenails (2026)",
        url: "https://www.foothealthfacts.org/conditions/black-toenails",
      },
      {
        label: "PubMed \u2014 Yaemsiri et al., Growth rate of human fingernails and toenails in healthy American young adults, J Eur Acad Dermatol Venereol (2010)",
        url: "https://pubmed.ncbi.nlm.nih.gov/19744178/",
      },
    ],
  },
  "flat-feet-after-40": {
    metaTitle: "Flat Feet After 40: Harmless or a Failing Tendon?",
    metaDescription:
      "How to tell a lifelong flexible flat foot from adult-acquired flatfoot, the four home checks, and the shoes, insoles, and exercises that help men over 40.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Are flat feet a problem after 40?",
        a: "Usually not. A flexible flat foot you've had since childhood, on both sides, with an arch that appears on tiptoe, rarely needs treatment. The concern is a flat foot that is new, on one side, and painful along the inside of the ankle.",
      },
      {
        q: "What is adult-acquired flatfoot?",
        a: "An arch that drops in adulthood because the posterior tibial tendon, which holds the arch up, has stretched or torn. It usually affects one foot, develops over months, and causes pain and swelling behind the inner ankle bone. Doctors also call it posterior tibial tendon dysfunction.",
      },
      {
        q: "How do I check for posterior tibial tendon dysfunction at home?",
        a: "Hold a counter, lift one foot, and rise onto the toes of the standing foot. A failing tendon can't lift the heel, can't repeat it, or hurts along the inner ankle. Also have someone look at your heels from behind: more toes visible on one side is the 'too many toes' sign.",
      },
      {
        q: "What are the best shoes for flat feet?",
        a: "For a stretching tendon, a shoe with a firm heel counter, a sole that resists twisting, and a wide stable heel. Soft minimalist shoes and sandals suit a painless lifelong flat foot but remove support a failing tendon can't supply.",
      },
      {
        q: "Do insoles help flat feet, and do I need custom orthotics?",
        a: "An over-the-counter insole with a firm arch and a deep heel cup is often enough for a mild, flexible foot. A custom orthotic makes sense when the heel has clearly tilted or a stock insole hasn't helped after two to three months.",
      },
      {
        q: "Which flat feet exercises help?",
        a: "Heel raises, tibialis posterior work with a band, short-foot holds, and calf stretches, most days for 8 to 12 weeks. In a 2009 randomized trial, orthotics plus stretching improved pain and function, and adding resistance exercise improved them further.",
      },
    ],
    sources: [
      {
        label: "AAOS OrthoInfo \u2014 Progressive Collapsing Foot Deformity, Flatfoot (2026)",
        url: "https://orthoinfo.aaos.org/en/diseases--conditions/posterior-tibial-tendon-dysfunction/",
      },
      {
        label: "ACFAS Foot Health Facts \u2014 Posterior Tibial Tendon Dysfunction, PTTD (2026)",
        url: "https://www.foothealthfacts.org/conditions/posterior-tibial-tendon-dysfunction-(pttd)",
      },
      {
        label: "ACFAS Foot Health Facts \u2014 Flexible Flatfoot (2026)",
        url: "https://www.foothealthfacts.org/conditions/flexible-flatfoot",
      },
      {
        label: "MedlinePlus Medical Encyclopedia \u2014 Flat feet (2025)",
        url: "https://medlineplus.gov/ency/article/001262.htm",
      },
      {
        label: "PubMed \u2014 Kulig K et al., Nonsurgical management of posterior tibial tendon dysfunction with orthoses and resistive exercise: a randomized controlled trial, Physical Therapy (2009)",
        url: "https://pubmed.ncbi.nlm.nih.gov/19022863/",
      },
    ],
  },
  "how-to-measure-your-feet-for-shoes": {
    metaTitle: "How to Measure Your Feet for Shoes at Home (Men Over 40)",
    metaDescription:
      "Measure length and width at home in ten minutes, convert to US men's size and width letter, and use the store fit rules that matter more than the number.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "How do I measure my shoe size at home?",
        a: "Late in the day, in the socks you will wear, stand on a sheet of paper on a hard floor with your heel against a wall. Mark the heel, the longest toe, and both sides of the foot at the ball, then measure heel to toe for length and side to side for width. Do both feet and use the larger numbers. Round up between sizes, and do not add toe room; the size scale already includes it.",
      },
      {
        q: "Why did my shoe size change after 40?",
        a: "Ligaments lose elasticity with age, so the foot spreads under body weight; arches lower, which makes the foot longer; weight gain adds spread at the ball; and feet swell through the day by up to about 8 percent. None of it happens fast, which is why most men are still buying the size they wore in their twenties. Podiatry and orthopedic groups recommend getting measured every time you shop.",
      },
      {
        q: "How much room should be in front of my toes?",
        a: "About half an inch, roughly a thumb's width, between the end of your longest toe and the end of the shoe while standing with weight on that foot. Measure from the longest toe, which on many men is the second toe, not the big toe. Less than that and a long walk or run jams the nail into the toe box, which is where black toenails come from.",
      },
      {
        q: "What do shoe width letters mean?",
        a: "For US men's shoes, B is narrow, D is standard, 2E is wide, and 4E is extra wide, with each step about 3/16 of an inch across the ball. The letter depends on length: the same ball width counts as wider on a shorter foot. If your width lands above the D column for your length, buy a wider shoe rather than a longer one; sizing up for width leaves the heel slipping.",
      },
      {
        q: "Why do shoes from different brands fit differently in the same size?",
        a: "Every brand builds on its own last, the foot-shaped form the shoe is made around, so two size 10s can differ by a quarter inch in length and more in the toe box. Running shoes carry extra length so the foot can slide forward on impact, which is why many men wear a half size up in them, while dress shoes are built close on a tapered toe and often need a width up. Buy the shoe that fits, whatever size is printed in it.",
      },
      {
        q: "What does a Brannock device measure that a ruler does not?",
        a: "Heel-to-ball length, along with heel-to-toe length and width read against length. Heel-to-ball tells the fitter where your ball sits, so the shoe flexes where your foot does; a man with a long arch and short toes may need a longer shoe than his toe length suggests. Podiatry groups recommend a professional measurement every time you shop, on both feet.",
      },
    ],
    sources: [
      {
        label: "AAOS OrthoInfo \u2014 Shoes: Finding the Right Fit",
        url: "https://orthoinfo.aaos.org/en/staying-healthy/shoes-finding-the-right-fit/",
      },
      {
        label: "APMA \u2014 Balance-Boosting Footwear Tips for Older People",
        url: "https://www.apma.org/patients-and-the-public/tips-for-healthy-feet/balance-boosting-footwear-tips-for-older-people/",
      },
      {
        label: "NIDDK \u2014 Diabetes and Foot Problems",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/foot-problems",
      },
      {
        label: "Buldt & Menz, J Foot Ankle Res \u2014 Incorrectly fitted footwear, foot pain and foot disorders: a systematic search and narrative review (2018)",
        url: "https://pubmed.ncbi.nlm.nih.gov/30065787/",
      },
      {
        label: "Scott, Menz & Newcombe, Gait & Posture \u2014 Age-related differences in foot structure and function (2007)",
        url: "https://pubmed.ncbi.nlm.nih.gov/16945538/",
      },
    ],
  },
  "pain-on-top-of-the-foot": {
    metaTitle: "Top of Foot Pain: Laces, Tendon, Fracture, or Arthritis",
    metaDescription:
      "Top of foot pain: tight laces, extensor tendinitis, a bone spur, or a stress fracture. How to tell them apart, lacing fixes, and when to see a podiatrist.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Why does the top of my foot hurt with no injury?",
        a: "The usual answers are extensor tendinitis from laces tied too tight or a jump in hills and mileage, midfoot arthritis with a bone spur that rubs on the shoe, or a stress fracture in a metatarsal after more miles or standing hours. Gout, a ganglion cyst, and a pinched nerve on top of the foot are less common. Where it hurts and what changed in the month before narrow it fast.",
      },
      {
        q: "Can tight laces cause pain on top of the foot?",
        a: "Yes. The extensor tendons and a nerve run right under the laces with no padding, so a tight knot irritates them on every step. Loosen the laces, skip the eyelet over the sore spot or run the laces straight up on either side of it, and add a tongue pad. If the ache fades in a few days, the laces were the cause.",
      },
      {
        q: "How do I know if it is a stress fracture or extensor tendonitis?",
        a: "Tendinitis aches in a line along the tendon, feels worse with tight laces and hills, and eases when the pressure comes off. A stress fracture is tender at one point on one bone, often with swelling on top of the foot, and builds with each step after a jump in mileage or standing. Point tenderness after a change in load means imaging, not a wait-and-see.",
      },
      {
        q: "Can a stress fracture in the foot show a normal X-ray?",
        a: "Yes, and often. Early X-rays miss most stress fractures, and the crack usually shows only after two to three weeks, once the bone forms callus around it. If the story fits and the film is clean, the podiatrist repeats the X-ray in two to three weeks or orders an MRI, which shows the bone reacting right away.",
      },
      {
        q: "What is the bump on top of my foot?",
        a: "A hard, bony ridge in the middle of the foot is usually a bone spur from midfoot arthritis, common after 50 and after an old foot injury. A soft, rubbery lump that changes size is more likely a ganglion cyst. Either can be sore because the shoe rubs it, and both are a podiatrist visit rather than an emergency, unless the area is hot and red.",
      },
      {
        q: "How long does a metatarsal stress fracture take to heal?",
        a: "About six weeks off running in a stiff-soled shoe or walking boot is the usual target for a low-risk metatarsal, with a range of roughly four to twelve weeks depending on the bone. The base of the fifth metatarsal heals slowly and is often held out around twelve weeks. Return is guided by pain, not the calendar.",
      },
    ],
    sources: [
      {
        label: "OrthoInfo (AAOS) \u2014 Stress Fractures of the Foot and Ankle (2026)",
        url: "https://orthoinfo.aaos.org/en/diseases--conditions/stress-fractures-of-the-foot-and-ankle/",
      },
      {
        label: "OrthoInfo (AAOS) \u2014 Lisfranc (Midfoot) Injury (2026)",
        url: "https://orthoinfo.aaos.org/en/diseases--conditions/lisfranc-midfoot-injury/",
      },
      {
        label: "American Family Physician \u2014 Stress Fractures: Diagnosis, Treatment, and Prevention (2011)",
        url: "https://www.aafp.org/pubs/afp/issues/2011/0101/p39.html",
      },
      {
        label: "ACFAS Foot Health Facts \u2014 Osteoarthritis of the Foot and Ankle (2026)",
        url: "https://www.foothealthfacts.org/conditions/osteoarthritis-of-the-foot-and-ankle",
      },
      {
        label: "PubMed \u2014 DiDomenico LA et al., Anterior tarsal tunnel syndrome, Clin Podiatr Med Surg (2006)",
        url: "https://pubmed.ncbi.nlm.nih.gov/16958392/",
      },
    ],
  },
  "cold-feet-and-poor-circulation": {
    metaTitle: "Cold Feet After 40: Circulation, Nerve, or Just Cold?",
    metaDescription:
      "Cold feet in men over 40: how to tell an artery problem from a nerve problem or a cold house, the 15-minute PAD test, and the signs that can't wait.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Why are my feet always cold?",
        a: "Usually one of three things: less blood reaching the feet (a cold room, damp socks, or an artery problem), a nerve reporting cold that isn't there (neuropathy), or a whole-body cause such as a slow thyroid, anemia, or a beta blocker. Touch them: cold to the hand points to blood flow or the room; warm to the hand but feeling cold points to a nerve.",
      },
      {
        q: "How do I know if cold feet are poor circulation?",
        a: "Cold to the touch, often one foot more than the other, with shiny hairless skin, slow nail growth, calf pain when walking that stops with rest, or a sore that won't heal. Those signs in a man over 50 who smokes or has diabetes, high blood pressure, or high cholesterol are a reason to ask for an ankle-brachial index test.",
      },
      {
        q: "What is the ankle-brachial index test?",
        a: "Blood pressure cuffs on the ankles and arms, a small Doppler probe, and a ratio of ankle pressure to arm pressure. Around 1.0 is normal and below about 0.9 suggests peripheral artery disease. It takes 10 to 20 minutes, needs no needles, and a primary care doctor can order it.",
      },
      {
        q: "Why is one foot cold and the other isn't?",
        a: "One-sided coldness to the touch is the pattern that points at an artery, because a cold room affects both feet. Gradual, with skin or walking signs, it's a routine visit and an ABI test. Sudden, with pain, pallor, and numbness or weakness, it's an emergency: call 911.",
      },
      {
        q: "Does walking help poor circulation in the legs?",
        a: "For claudication, yes, and it's the first-line treatment. In a Cochrane review, exercise programs added roughly 80 meters of pain-free walking and roughly 120 meters of maximum distance. Walk until the calf pain is mild to moderate, rest until it eases, repeat, for 30 to 45 minutes three times a week for at least 12 weeks.",
      },
      {
        q: "Are cold feet at night a sign of something serious?",
        a: "Cold feet at night are usually the room and the bedding. Foot or toe pain at night that eases when you hang the foot off the bed is different: that's rest pain, a sign of severe artery disease, and it needs a vascular referral within days.",
      },
    ],
    sources: [
      {
        label: "NHLBI \u2014 Peripheral Artery Disease: Symptoms (2022)",
        url: "https://www.nhlbi.nih.gov/health/peripheral-artery-disease/symptoms",
      },
      {
        label: "Society for Vascular Surgery \u2014 Ankle-Brachial Index or ABI Test (accessed 2026)",
        url: "https://vascular.org/patients-and-referring-physicians/conditions/ankle-brachial-index-or-abi-test",
      },
      {
        label: "AAFP \u2014 Lower Extremity Peripheral Artery Disease: Diagnosis and Treatment, American Family Physician (2019)",
        url: "https://www.aafp.org/pubs/afp/issues/2019/0315/p362.html",
      },
      {
        label: "Cochrane Database of Systematic Reviews via PubMed \u2014 Exercise for intermittent claudication (2017)",
        url: "https://pubmed.ncbi.nlm.nih.gov/29278423/",
      },
      {
        label: "NIAMS \u2014 Raynaud's Phenomenon (2024)",
        url: "https://www.niams.nih.gov/health-topics/raynauds-phenomenon",
      },
    ],
  },
  "hammer-toes-and-curled-toes": {
    metaTitle: "Hammer Toe: What Straightens, What Doesn't, and the Shoe Fix",
    metaDescription:
      "Hammer toes have two stages. Flexible ones respond to a deep toe box, pads, and toe work; rigid ones only change with surgery. The one-finger test decides.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "Can a hammer toe be straightened without surgery?",
        a: "Only while it is still flexible, and even then the honest word is slowed, not straightened. Toe stretches, towel scrunches, a deep toe box, and a low heel keep a flexible toe from setting and can hold a mild one where it is. Once the joint is rigid, nothing at home changes the angle; pads and shoes stop the rubbing, and surgery is the only correction.",
      },
      {
        q: "What is the difference between a hammer toe, a claw toe, and a mallet toe?",
        a: "Which joint is bent. A hammer toe bends at the middle joint, so the knuckle rides up. A claw toe bends at the middle and end joints with the base cocked up, curls under, and usually takes several toes, often with a nerve problem behind it. A mallet toe bends only at the end joint, so the tip points down and the corn sits at the tip. Treatment follows the same test for all three: flexible or rigid.",
      },
      {
        q: "Why is it my second toe?",
        a: "In many men the second toe is the longest, so it hits the front of the shoe first and folds. Next to a bunion it is crowded from the side as well: the big toe drifts under it and pushes it up, and the bone behind it picks up load the big toe stopped carrying. The [bunions guide](/guides/bunions-men-over-40) covers that side of the problem.",
      },
      {
        q: "What shoes are best for hammer toes?",
        a: "A deep, wide toe box with a soft upper, half an inch of length beyond your longest toe, and a heel of an inch or less. Depth matters more than most men expect: it is the upper pressing on the knuckle that makes the corn. A cobbler can stretch a bulge into a shoe you want to keep. Drop any shoe that leaves a red mark on the knuckle after a day.",
      },
      {
        q: "Do hammer toe pads and gel sleeves work?",
        a: "For the rubbing, yes. A gel sleeve cushions the knuckle from the upper, and a crest pad under the curled toes lifts the tips off the insole, which is what fixes the corn at the tip. Use non-medicated pads; the acid in medicated corn pads can't tell corn from healthy skin. None of them change the angle of the toe. The [calluses and corns guide](/guides/calluses-and-corns-men-over-40) covers padding and filing.",
      },
      {
        q: "When should a hammer toe see a doctor the same day?",
        a: "When the corn has opened into a sore or has fluid or blood under it, especially if you have diabetes or poor circulation. When the toe is red, hot, and swollen, or redness is spreading up the foot. And when several toes have curled over weeks with numbness, tingling, or weakness, which points to a nerve problem rather than a shoe. Bring the [doctor-prep checklist](/doctor-prep) so the visit covers when it started.",
      },
    ],
    sources: [
      {
        label: "AAOS OrthoInfo \u2014 Hammer Toe (accessed 2026)",
        url: "https://orthoinfo.aaos.org/en/diseases--conditions/hammer-toe/",
      },
      {
        label: "ACFAS FootHealthFacts \u2014 Hammertoe (accessed 2026)",
        url: "https://www.foothealthfacts.org/conditions/hammertoe",
      },
      {
        label: "APMA \u2014 Hammer Toes (accessed 2026)",
        url: "https://www.apma.org/hammertoes/",
      },
      {
        label: "NIH MedlinePlus \u2014 Hammer toe (2024)",
        url: "https://medlineplus.gov/ency/article/001235.htm",
      },
      {
        label: "Malhotra K, Davda K, Singh D \u2014 The pathology and management of lesser toe deformities, EFORT Open Reviews (2016)",
        url: "https://pubmed.ncbi.nlm.nih.gov/28461920/",
      },
    ],
  },
  "mortons-neuroma-men-over-40": {
    metaTitle: "Morton's Neuroma in Men Over 40: What Fixes the Pebble",
    metaDescription:
      "A pebble under the foot with burning into two toes is Morton's neuroma. The shoe and pad fix, what injections and surgery trade, and when to be seen.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "What does Morton's neuroma feel like?",
        a: "Like a pebble, a marble, or a bunched sock under the ball of the foot, usually toward the outer half, with burning, tingling, or numbness running into the third and fourth toes (sometimes the second and third). It's worse in narrow or heeled shoes and eases within minutes of taking the shoe off and rubbing the forefoot. Usually one foot. Night pain is rare, and there's nothing to see on the skin.",
      },
      {
        q: "What causes a Morton's neuroma in men over 40?",
        a: "A nerve between two metatarsal heads gets squeezed between the bones and the ligament above it until the tissue around it thickens, and a thicker nerve gets pinched more. After 40 the forefoot spreads as ligaments loosen, so the same shoes crowd the metatarsal heads together. Narrow toe boxes, heels of any height, running and court sports, and bunions or hammertoes all add to the squeeze.",
      },
      {
        q: "Where do you put a metatarsal pad for a neuroma?",
        a: "Behind the ball of the foot, not under it. Stand barefoot on the insole, feel for the ridge of the metatarsal heads, and place the pad's thick edge roughly a centimeter behind that ridge, toward the heel, so the ball of the foot sits in front of the pad. If it feels like a lump under the ball, it's too far forward. A pad placed under the heads makes a neuroma worse. The [ball-of-foot guide](/guides/ball-of-foot-pain-in-men-over-40) walks through the same placement.",
      },
      {
        q: "Do steroid injections work for Morton's neuroma?",
        a: "Often, for a while. In a patient-blinded randomized trial, a steroid plus anesthetic beat anesthetic alone at one and three months, and relief commonly runs for several months. The 2024 Cochrane review rated the evidence for most neuroma treatments low-certainty, with the steroid injection the best-supported short-term option. Repeats are limited, usually to a few a year, because steroid thins the fat pad and skin under the forefoot.",
      },
      {
        q: "What does Morton's neuroma surgery involve, and what's the downside?",
        a: "Either a release, which cuts the ligament over the nerve and keeps sensation, or a neurectomy, which removes the thickened segment of nerve. Neurectomy relieves pain for most people, and the trade is permanent numbness in the web space and the facing sides of the two toes, plus a small chance of a painful stump neuroma at the cut end. Recovery is a stiff post-op shoe for a few weeks and normal shoes at about four. It's usually offered after three to six months of conservative care hasn't worked.",
      },
      {
        q: "How is Morton's neuroma diagnosed?",
        a: "Mostly by exam. A clinician presses on each web space, squeezes the forefoot side to side to feel for the click of the nerve popping between the bones, and checks the toe joints for the swelling or drift of a plantar plate injury. An X-ray rules out a stress fracture and arthritis. Ultrasound is the preferred imaging when one is needed and can guide an injection. A numbing injection that removes the pain for an hour confirms doubtful cases. Bring the [doctor-prep checklist](/doctor-prep) so the visit stays short.",
      },
    ],
    sources: [
      {
        label: "AAOS OrthoInfo \u2014 Morton's Neuroma",
        url: "https://orthoinfo.aaos.org/en/diseases--conditions/mortons-neuroma/",
      },
      {
        label: "NHS \u2014 Morton's neuroma (2025)",
        url: "https://www.nhs.uk/conditions/mortons-neuroma/",
      },
      {
        label: "MedlinePlus \u2014 Morton neuroma (2025)",
        url: "https://medlineplus.gov/ency/article/007286.htm",
      },
      {
        label: "Cochrane Database of Systematic Reviews \u2014 Treatments for Morton's neuroma (2024)",
        url: "https://pubmed.ncbi.nlm.nih.gov/38334217/",
      },
      {
        label: "Journal of Bone and Joint Surgery \u2014 Methylprednisolone injections for the treatment of Morton neuroma: a patient-blinded randomized trial (2013)",
        url: "https://pubmed.ncbi.nlm.nih.gov/23636185/",
      },
    ],
  },
  "heel-spurs-explained": {
    metaTitle: "Heel Spur Pain: Why the Spur Usually Isn't the Cause",
    metaDescription:
      "Most heel spurs don't hurt. The pain is the fascia or the Achilles insertion next to the spur, and that is what gets treated. What works, and what doesn't.",
    datePublished: "2026-09-25",
    faq: [
      {
        q: "What is a heel spur?",
        a: "A heel spur, or calcaneal spur, is a shelf of extra bone on the heel bone. The common one sits on the underside where the plantar fascia attaches and points forward toward the toes; the other sits on the back of the heel where the Achilles tendon attaches. It forms over years where a tendon or fascia pulls on bone and the attachment is repeatedly stressed and repaired, so it is a record of long-term load rather than a sudden event.",
      },
      {
        q: "Is a heel spur the same as plantar fasciitis?",
        a: "No. Plantar fasciitis is irritation of the fascia at its attachment under the heel and is what produces the sharp first-step pain. The spur is bone that often forms at that same attachment after years of load. The two travel together, but in X-ray studies close to half of people with no heel pain have a spur, and orthopedic guidance is that the spur does not cause plantar fasciitis pain. The fascia is what gets treated.",
      },
      {
        q: "Do heel spurs go away on their own?",
        a: "The bone does not. A spur takes years to form and stays on the X-ray, including after the pain is gone. That matters less than it sounds, because the pain is the fascia or the Achilles insertion next to the spur, and those respond to stretching, load management, better shoes, and time. Most men are much improved within a few months, with the spur still there.",
      },
      {
        q: "What is the treatment for a heel spur?",
        a: "Treatment of the tissue next to it. Under the heel that means the plantar fasciitis plan: daily calf and fascia stretching, cutting the volume that flared it, a cushioned heel cup and a firm-soled shoe, strengthening once the sharp pain eases, weight loss where it applies, a night splint if the morning spike persists, and months of patience. Behind the heel it means a soft or open heel counter, a small heel lift, and eccentric calf work that stops at floor level.",
      },
      {
        q: "Do heel spurs need surgery?",
        a: "Rarely, and the surgery is usually not a spur removal. More than nine in ten men with plantar fasciitis recover without an operation, and surgeons typically consider one only after about a year of proper nonsurgical care has failed. Even then the procedure targets the fascia or a tight calf, and the spur is usually left alone because removing it doesn't reliably change the result and adds risk: nerve injury, a flattened arch, a heel fracture, and a long recovery.",
      },
      {
        q: "What are the symptoms of a heel spur, and when should I see a doctor?",
        a: "A plantar spur itself usually has no symptoms; the pain people blame on it is plantar fasciitis, sharp under the heel on the first steps of the morning. A spur at the back of the heel comes with pain where the tendon meets bone, a bump, and irritation from stiff-backed shoes. See a doctor the same week for heel pain with fever or a hot, red heel; pain after a fall or a jump landing; pain at rest and at night; numbness or burning; or any skin break on the heel if you have diabetes.",
      },
    ],
    sources: [
      {
        label: "AAOS OrthoInfo \u2014 Plantar Fasciitis and Bone Spurs (accessed 2026)",
        url: "https://orthoinfo.aaos.org/en/diseases--conditions/plantar-fasciitis-and-bone-spurs/",
      },
      {
        label: "American Family Physician \u2014 Heel Pain: Diagnosis and Management (2018)",
        url: "https://www.aafp.org/pubs/afp/issues/2018/0115/p86.html",
      },
      {
        label: "PubMed \u2014 Osborne HR et al., Critical differences in lateral X-rays with and without a diagnosis of plantar fasciitis, J Sci Med Sport (2006)",
        url: "https://pubmed.ncbi.nlm.nih.gov/16697701/",
      },
      {
        label: "PubMed \u2014 Menz HB et al., Plantar calcaneal spurs in older people: longitudinal traction or vertical compression?, J Foot Ankle Res (2008)",
        url: "https://pubmed.ncbi.nlm.nih.gov/18822162/",
      },
      {
        label: "ACFAS Foot Health Facts \u2014 Haglund's Deformity (2026)",
        url: "https://www.foothealthfacts.org/conditions/haglund%E2%80%99s-deformity",
      },
    ],
  },
  "is-it-toenail-fungus": {
    metaTitle: "What Toenail Fungus Looks Like (and What Else It Could Be)",
    metaDescription: "Thick, yellow, crumbly at the tip is the fungus pattern. Half of nails like this are trauma, age, or psoriasis instead. The self-check and the lab test.",
    datePublished: "2026-09-23",
    faq: [
      {
        q: "What does toenail fungus look like?",
        a: "The common form starts at the tip or one side of the nail as a yellow or white streak, then the nail thickens, turns crumbly, and builds up debris underneath as the discolored area creeps toward the cuticle. A less common form shows chalky white patches on the surface. It usually comes with peeling skin between the toes, because the same fungus causes athlete's foot. Pain is optional; many fungal nails don't hurt until they thicken enough to press on the shoe.",
      },
      {
        q: "Can toenail fungus go away on its own?",
        a: "Not the common form. The fungus lives in the nail plate and the bed under it, where the immune system can't reach it and nothing washes it out, so untreated it stays or spreads. The surface white form sometimes clears with filing and a topical. A 'fungal' nail that cleared with no treatment was most likely a bruise or old trauma growing out, which is one more reason to test before treating.",
      },
      {
        q: "Can a thick yellow toenail be something other than fungus?",
        a: "Yes, and often. About half of thick, discolored toenails aren't fungal. The usual look-alikes in men over 40 are old trauma from shoes, running, or hiking, plain age-related thickening (every nail changed the same way, no debris), nail psoriasis (small pits and orange-brown spots under the nail), and a bacterial infection under a lifted nail, which tints it green. None of these responds to an antifungal, which is why testing first saves a year.",
      },
      {
        q: "How do doctors test for toenail fungus?",
        a: "A podiatrist or dermatologist clips a piece of the affected nail and scrapes the debris under it, then the lab examines it under a microscope, grows a culture, stains a slice, or runs a DNA test. It's a routine appointment, not a specialist referral. Don't apply any product to the nail for a few days beforehand, because residue can spoil the sample, and bring your medication list in case the result leads to a prescription.",
      },
      {
        q: "Why should I test before buying a treatment?",
        a: "Three reasons. Half of nails that look fungal aren't, and months of antifungal on a bruised or psoriatic nail changes nothing. The pill that cures most cases needs a confirmed diagnosis and a liver test first, so doctors won't prescribe it on a guess. And the prescription topicals cost hundreds of dollars for a year of daily use, worth it for a confirmed infection and wasted on anything else.",
      },
      {
        q: "What should I do while waiting for the test?",
        a: "Photograph the nail in daylight with a coin for scale, trim it straight across and file the thickness down once a week, treat any peeling skin between the toes with an athlete's foot cream for four weeks, dry between the toes after every shower, and rotate two pairs of shoes so each dries for a day. None of that commits you to a year of treatment, and all of it helps whatever the answer is.",
      },
      {
        q: "When is a changed toenail a same-week problem?",
        a: "A dark brown or black streak running the length of the nail, especially if it's new, widening, or spreading onto the skin at the cuticle, needs a dermatologist or podiatrist promptly, because a melanoma under the nail looks exactly like that. Also same-week: any nail change if you have diabetes, a nail fold that's red, swollen, or draining, redness spreading up the foot, or a fever with any foot problem.",
      },
    ],
    sources: [
      {
        label: "AAD — Nail fungus: Signs and symptoms",
        url: "https://www.aad.org/public/diseases/a-z/nail-fungus-symptoms",
      },
      {
        label: "AAFP — Onychomycosis: Rapid Evidence Review (2021)",
        url: "https://www.aafp.org/pubs/afp/issues/2021/1000/p359.html",
      },
      {
        label: "NHS — Fungal nail infection",
        url: "https://www.nhs.uk/conditions/fungal-nail-infection/",
      },
    ],
  },
  "toenail-fungus-treatments-compared": {
    metaTitle: "Toenail Fungus Treatments Compared: Pills, Topicals, Laser",
    metaDescription: "Terbinafine cures the most and costs the least. Jublia and ciclopirox clear some mild cases in a year. Laser and drugstore kits have no cure evidence.",
    datePublished: "2026-09-23",
    faq: [
      {
        q: "What is the most effective treatment for toenail fungus?",
        a: "Oral terbinafine, a daily tablet for 12 weeks. In the trials that approved it, about 4 men in 10 reached a completely normal nail and about 7 in 10 were fungus-free on the lab test, the best figures of any treatment. It's a cheap generic. It needs a confirmed diagnosis and a liver blood test before starting, and it interacts with a few medications, so bring your full list to the prescriber.",
      },
      {
        q: "Do the topical toenail fungus treatments work?",
        a: "The prescription ones work for mild infections: the tip or an edge, less than about half the nail, the base not involved, and no more than three or four nails. Efinaconazole solution is the best of them, with roughly 1 man in 6 reaching a normal nail after a year of daily use; tavaborole and the older ciclopirox lacquer do less. All three need daily application for 48 weeks, and they work better on a nail that has been filed thin.",
      },
      {
        q: "Is terbinafine safe to take with a statin?",
        a: "Usually yes, but confirm with the prescriber. Terbinafine doesn't have the cholesterol-drug interaction that the other oral antifungal, itraconazole, has. Itraconazole blocks the enzyme that clears many common drugs, and some statins can't be taken with it at all; it also carries a heart failure warning. For a man over 40 on a statin, that difference usually settles which pill is offered.",
      },
      {
        q: "Does laser treatment cure toenail fungus?",
        a: "The evidence doesn't support it as a cure. The devices are cleared for a temporary increase in clear nail, which is a cosmetic claim, and the most careful review of the trials found them small and the results uncertain, with clearance well below the pill. Courses cost several hundred to over a thousand dollars and are rarely covered. Laser plus a topical is a reasonable last option for men who can't take the pill; on its own it's poor value.",
      },
      {
        q: "Should the toenail be removed?",
        a: "Rarely on its own. Chemical removal (a high-strength urea paste under a dressing) or surgical removal takes the nail off, but the fungus is in the nail bed too, and studies of removal alone show poor cure rates. It's used for a nail too thick or painful for anything else, or paired with a topical on the exposed bed while the new nail grows. For most men, thinning the nail does the same job without the downtime.",
      },
      {
        q: "Do over-the-counter fungal nail products work?",
        a: "None has trial evidence for curing toenail fungus. Most are urea, which softens and thins the nail, or a cosmetic whitener, or an antifungal cream meant for skin that can't get through a nail plate. Urea is worth having, because a thinner nail responds better to any real treatment. The rest is a year lost if it stands in for treatment.",
      },
      {
        q: "Why does the podiatrist file the nail down?",
        a: "Thinning the nail improves every other treatment. There's less material for the fungus to live in, less pressure in the shoe, and far better penetration for a topical. A podiatrist can grind a thick nail to a thin plate in one visit; at home, a 40% urea cream at night for a few weeks and a coarse emery board weekly do a slower version. It's not a cure on its own and it's the cheapest improvement available.",
      },
    ],
    sources: [
      {
        label: "AAFP — Onychomycosis: Rapid Evidence Review (2021)",
        url: "https://www.aafp.org/pubs/afp/issues/2021/1000/p359.html",
      },
      {
        label: "AAFP — Onychomycosis: Current Trends in Diagnosis and Treatment (2013)",
        url: "https://www.aafp.org/pubs/afp/issues/2013/1201/p762.html",
      },
      {
        label: "Cochrane — Oral antifungal medication for toenail onychomycosis (2017)",
        url: "https://doi.org/10.1002/14651858.CD010031.pub2",
      },
      {
        label: "Cochrane — Topical and device-based treatments for fungal infections of the toenails (2020)",
        url: "https://doi.org/10.1002/14651858.CD012093.pub2",
      },
      {
        label: "AAD — Nail fungus: Diagnosis and treatment",
        url: "https://www.aad.org/public/diseases/a-z/nail-fungus-treatment",
      },
    ],
  },
  "toenail-fungus-12-month-protocol": {
    metaTitle: "How Long Toenail Fungus Takes to Clear: The 12-Month Plan",
    metaDescription: "A toenail grows one millimeter a month, so a clear nail takes a year. What to do and see in each quarter, how to tell it's working, and when it isn't.",
    datePublished: "2026-09-23",
    faq: [
      {
        q: "How long does toenail fungus take to clear?",
        a: "Twelve to eighteen months for a big toenail. The treatment kills the fungus where new nail forms, at the base, and a toenail grows about one millimeter a month, so the clear nail starts at the cuticle and takes a year to reach the tip. The damaged nail in front of it never repairs; it grows out and gets trimmed off. Smaller toenails clear sooner, and older men or men with slow circulation take longer.",
      },
      {
        q: "How do I know if the toenail fungus is dying?",
        a: "Look at the base, not the tip. By the end of month three there should be a band of healthy-looking new nail one to three millimeters wide at the cuticle, clearer and smoother than what's in front of it. By month six it should be a third of the way up a big toenail. Monthly photos in daylight with a coin for scale make the comparison; memory doesn't. The tip looks bad until it's cut off, and that's normal.",
      },
      {
        q: "Why does the pill only last 12 weeks if the nail takes a year?",
        a: "Terbinafine builds up in the nail bed and keeps working there for months after the last dose, which is why a 12-week course treats a 12-month problem. Once the course is done there's nothing more to take, but the daily skin and shoe routine continues, and many doctors add a twice-weekly topical to protect the new growth while the old nail grows out.",
      },
      {
        q: "What should I do every day during treatment?",
        a: "Apply the treatment if it's a topical, on a clean, dry, filed nail, covering the nail and the skin fold. Dry between the toes after every shower. Wear wicking socks changed daily and rotate two pairs of shoes treated with an antifungal spray or powder. Once a week, file the nail thin. Once a month, trim straight across and take the photo. Treat any peeling skin between the toes with an athlete's foot cream, the full four weeks.",
      },
      {
        q: "When should I go back to the doctor during treatment?",
        a: "On the pill, the same day for dark urine, pale stools, yellowing eyes, nausea that won't shift, or a rash. Any time the nail fold is red, swollen, or draining. And at month six if there's no clear band at the base or the band has stopped growing: the usual reasons are the wrong diagnosis, a topical that isn't penetrating a nail still too thick, or reinfection from untreated skin or shoes. Take the photos; they show more than the nail.",
      },
      {
        q: "How do I know the fungus is really gone?",
        a: "Looks aren't the test. Ask the podiatrist for a repeat nail clipping at the end of treatment. A nail that looks clear but still grows fungus on the lab test will come back within the year. After a confirmed cure, keep the prevention routine and the monthly photo habit; a new streak at the tip caught early is a short course, not another year.",
      },
    ],
    sources: [
      {
        label: "AAD — Nail fungus: Diagnosis and treatment",
        url: "https://www.aad.org/public/diseases/a-z/nail-fungus-treatment",
      },
      {
        label: "NHS — Fungal nail infection",
        url: "https://www.nhs.uk/conditions/fungal-nail-infection/",
      },
      {
        label: "AAFP — Onychomycosis: Rapid Evidence Review (2021)",
        url: "https://www.aafp.org/pubs/afp/issues/2021/1000/p359.html",
      },
    ],
  },
  "keeping-toenail-fungus-from-coming-back": {
    metaTitle: "Keep Toenail Fungus From Coming Back: Shoes, Socks, Skin",
    metaDescription: "One in ten to one in two treated nails get reinfected, mostly from the same shoes, socks, and showers. Shoe rotation, drying, and the twice-weekly topical.",
    datePublished: "2026-09-23",
    faq: [
      {
        q: "Is toenail fungus contagious?",
        a: "Yes, weakly. It spreads through damp shared floors, towels, and nail tools far more than through touch, and the foot that catches it is usually damp, cracked, or already carrying athlete's foot. Within a household, treat everyone who has it at the same time, use separate towels, and wash the bath mat hot weekly, or you'll trade it back and forth.",
      },
      {
        q: "How often does toenail fungus come back after treatment?",
        a: "Depending on the study, somewhere between one in ten and one in two treated nails get reinfected. The fungus is cured out of the nail, not out of your life: it's still in the shoes worn during the infection, on gym and pool floors, on the skin between the toes, and often on a family member. Prevention is about not handing it a warm, damp toenail to move back into.",
      },
      {
        q: "Do I need to throw away my shoes after toenail fungus?",
        a: "Not all of them. Fungus survives in shoes for months, so every pair worn during the infection is seeded. Spray or powder an antifungal into each pair weekly for the first couple of months after the cure, then monthly, and rotate two pairs so each dries for a day. Retire the worst: old running shoes, work boots that never dry, anything with a foam insole that has been damp for a year, or at least replace the insoles.",
      },
      {
        q: "Can I get toenail fungus from a nail salon or the gym?",
        a: "Yes, both are known routes. Shared clippers and files carry it, so bring your own tools to a salon or confirm they sterilize. Gym, pool, and hotel shower floors are where a foot picks it up; wear flip-flops or shower shoes every time. At home, a household member with athlete's foot or a fungal nail will trade it back and forth with you until everyone is treated at the same time.",
      },
      {
        q: "What is the twice-weekly topical for preventing recurrence?",
        a: "Many podiatrists keep patients on a prescription antifungal lacquer or solution, applied once or twice a week for months after a cure, sometimes indefinitely for men with repeat infections, diabetes, or poor circulation. The evidence that it lowers recurrence is reasonable, a generic like ciclopirox is inexpensive, and it takes two minutes a week. It's the one prevention step with trial data behind it; ask about it at the final visit.",
      },
      {
        q: "Does athlete's foot cause toenail fungus to come back?",
        a: "It's the main reservoir. Athlete's foot is often too mild to notice: peeling between the fourth and fifth toes, or a dry-looking patch on the heel that moisturizer doesn't fix. The nail gets reinfected from its own foot. Treat it at the first sign with four weeks of an antifungal cream, the full course even after it looks better, and dry between the toes after every shower.",
      },
      {
        q: "Who needs to be strictest about prevention?",
        a: "Men with diabetes, because a thick nail or a break in the skin beside it is how foot ulcers start, so any nail change goes to the podiatrist early. Men with poor circulation or a weakened immune system, whose nails grow and clear more slowly. And runners and hikers, whose repeated nail trauma is the entry point: shoes half a size up for long days, laces snug so the foot doesn't slide, and nails trimmed before every long run.",
      },
    ],
    sources: [
      {
        label: "AAD — Nail fungus: Diagnosis and treatment",
        url: "https://www.aad.org/public/diseases/a-z/nail-fungus-treatment",
      },
      {
        label: "AAFP — Onychomycosis: Current Trends in Diagnosis and Treatment (2013)",
        url: "https://www.aafp.org/pubs/afp/issues/2013/1201/p762.html",
      },
      {
        label: "NHS — Fungal nail infection",
        url: "https://www.nhs.uk/conditions/fungal-nail-infection/",
      },
    ],
  },
  "toenail-fungus-home-remedies-and-laser": {
    metaTitle: "Home Remedies for Toenail Fungus: Vicks, Tea Tree, Laser",
    metaDescription: "Vicks has one 18-person study. Tea tree oil has old, weak evidence. Vinegar, baking soda, and peroxide have none. Laser is unproven for the price.",
    datePublished: "2026-09-23",
    faq: [
      {
        q: "Is there anything that kills toenail fungus fast?",
        a: "No. Nothing gets through the nail plate and kills the fungus underneath in days or weeks, and even a treatment that works leaves the damaged nail in place until it grows out at about a millimeter a month. Anything that 'cleared it in a week' was filing, a whitening soak, or a nail that was never fungal. The fastest route is the highest-cure-rate treatment started soonest.",
      },
      {
        q: "Does Vicks VapoRub cure toenail fungus?",
        a: "There's one small pilot study: 18 people applied it daily for 48 weeks, and 5 of them ended with a nail that was clear and fungus-free on the lab test, 10 improved partially, and 3 didn't change. Nobody was compared with doing nothing. It's cheap and safe on intact skin, and about a quarter cured in a tiny study is worth knowing about. Against the pill, which cures nearly twice as many in controlled trials, it's a supporting act, not a first choice.",
      },
      {
        q: "Does tea tree oil work on toenail fungus?",
        a: "The evidence is old and weak. A 1990s trial compared 100% tea tree oil twice daily for six months with a 1% antifungal cream that isn't itself a nail treatment; both groups improved about the same on looks and both did poorly on the lab test. Tea tree oil has antifungal activity in the lab, irritates some people's skin, and can cause an allergic rash. If you use it, keep it on the nail plate and treat it as company for real treatment.",
      },
      {
        q: "Do vinegar soaks get rid of toenail fungus?",
        a: "No trial has tested vinegar on toenails. Fungus dislikes acid in a dish, but a daily soak doesn't reach the fungus under the nail plate. Soaks are harmless on intact skin and they soften the nail, which makes filing easier; if you like the ritual, file afterward and count that as the benefit. Bleach soaks, sometimes recommended online, damage skin and aren't worth it.",
      },
      {
        q: "Is laser treatment for toenail fungus worth the money?",
        a: "Not on its own. The devices are cleared for a temporary increase in clear nail, a cosmetic claim, and the most careful review of the trials found them small, short, and inconsistent, with low certainty of any benefit and clearance rates well below the pill. Courses run several hundred to over a thousand dollars, rarely covered. Laser plus a topical is a defensible last option for a man who can't take the pill and has failed a topical alone.",
      },
      {
        q: "Which drugstore fungal nail product is worth buying?",
        a: "Urea. A 40% urea cream at night for a few weeks softens and thins the nail, and a thinner nail responds better to any real treatment. Most other drugstore kits are urea in a fancier package, a cosmetic whitener, or a low-strength antifungal that penetrates nail poorly. Read the ingredients: if the active ingredient isn't a named antifungal drug at a nail-treatment concentration, it isn't a nail treatment.",
      },
      {
        q: "Why do home remedies seem to work in the stories?",
        a: "Because the ritual around them does the helping: the nail gets filed, cleaned, and trimmed, which improves the look; the foot gets dried because someone is paying attention; and in about half the cases there was never fungus to begin with, so nothing was going to change either way. Those are real benefits. Get the diagnosis first, take the treatment with the best odds, keep the remedy in a supporting role, and stop at the first sign of skin irritation.",
      },
    ],
    sources: [
      {
        label: "Derby et al. — Novel treatment of onychomycosis using over-the-counter mentholated ointment (J Am Board Fam Med, 2011)",
        url: "https://pubmed.ncbi.nlm.nih.gov/21209346/",
      },
      {
        label: "Buck et al. — Comparison of two topical preparations for the treatment of onychomycosis: tea tree oil and clotrimazole (J Fam Pract, 1994)",
        url: "https://pubmed.ncbi.nlm.nih.gov/8195735/",
      },
      {
        label: "Cochrane — Topical and device-based treatments for fungal infections of the toenails (2020)",
        url: "https://doi.org/10.1002/14651858.CD012093.pub2",
      },
      {
        label: "AAD — Nail fungus: Diagnosis and treatment",
        url: "https://www.aad.org/public/diseases/a-z/nail-fungus-treatment",
      },
    ],
  },
  // ── 2026-09-22 expansion: eight guides, newest first.
  "sprained-ankle-recovery-over-40": {
    metaTitle: "Sprained Ankle After 40: Recover Without a Weak Ankle for Life",
    metaDescription:
      "Most sprains heal. The one that never gets rehabbed keeps rolling. The first 48 hours under PEACE and LOVE, the Ottawa X-ray check, and a six-week progression.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "How long does a sprained ankle take to heal after 40?",
        a: "It depends on the grade. A grade 1 (stretched ligament, microscopic tearing) is usually about two weeks. A grade 2 (partial tear) runs four to six weeks. A grade 3 (complete tear) takes months and should be managed by a clinician. Those numbers assume you rehab it. Past 40, collagen turnover is slower and balance sense takes longer to return, so an ankle that's rested and never trained tends to stay loose and roll again.",
      },
      {
        q: "Should I ice a sprained ankle?",
        a: "Briefly, for pain, if you want. Not for hours, and not as the treatment. The PEACE and LOVE framework in the British Journal of Sports Medicine groups ice with anti-inflammatory drugs: the authors flag potentially harmful effects on tissue repair, and there's no good evidence ice speeds healing. Compression, keeping the ankle up, and early protected walking do more for swelling than a frozen bag does.",
      },
      {
        q: "How do I know if my sprained ankle needs an X-ray?",
        a: "Run the Ottawa ankle rules. Press on the bone at the back edge or tip of the outer and inner ankle bones, the base of the fifth metatarsal (the bump on the outside of the midfoot), and the navicular (the bump on the inside of the midfoot). Bone tenderness at any of those, or being unable to take four steps both right after the injury and now, means get an X-ray. No positives and a fracture is unlikely.",
      },
      {
        q: "Can I walk on a sprained ankle?",
        a: "Usually, yes, and you should, as soon as it's tolerable. Current guidance calls for protecting the ankle for one to three days, then loading it with protected weight bearing: a supportive shoe or a lace-up brace, flat ground, as far as the pain allows. Weeks in a boot for a simple sprain stiffens the joint and weakens the calf. If you can't bear any weight after 48 hours, that's a doctor visit.",
      },
      {
        q: "Why does my ankle keep rolling after a sprain?",
        a: "The ligament carried nerve endings that told your brain where the foot was, and a sprain scrambles that signal. Pain fades in weeks; position sense doesn't come back on its own. Add weaker calf and peroneal muscles and you get chronic ankle instability, which OrthoInfo calls the most common result of incomplete rehab. Single-leg balance, eyes open, then closed, then on an unstable surface, is what fixes it. The [strength routine](/routines/strength) has the progression.",
      },
      {
        q: "Do I need an ankle brace, and for how long?",
        a: "For sport and uneven ground, a lace-up brace for the first several months while your own stabilizers come back. For daily walking, a supportive shoe is usually enough after the first week or two. A rigid brace worn all day, indefinitely, is the wrong answer: it lets the muscles stay weak. Wean off it when the injured side matches the other side on the single-leg hop and the eyes-closed balance test.",
      },
    ],
    sources: [
      {
        label: "British Journal of Sports Medicine — Soft tissue injuries simply need PEACE & LOVE (Dubois and Esculier, 2019)",
        url: "https://blogs.bmj.com/bjsm/2019/04/26/soft-tissue-injuries-simply-need-peace-love/",
      },
      {
        label: "MDCalc — Ottawa Ankle Rule",
        url: "https://www.mdcalc.com/calc/1670/ottawa-ankle-rule",
      },
      {
        label: "AAOS OrthoInfo — Sprained Ankle",
        url: "https://www.orthoinfo.org/en/diseases--conditions/sprained-ankle/",
      },
    ],
  },
  "diabetic-foot-care-men-over-40": {
    metaTitle: "Diabetic Foot Care, Men Over 40: Daily Check, Shoe Rules, Red Flags",
    metaDescription:
      "With diabetes a blister can become an ulcer without hurting. The 60-second daily check, shoe and sock rules, the same-day call list, and what the exam is for.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "Why do I have to check my feet every day if nothing hurts?",
        a: "Because with diabetes, pain is the signal you can no longer trust. Nerve damage in the feet (peripheral neuropathy) means a blister, a cut, or a rubbing seam can open the skin without any warning, and reduced blood flow means it heals slowly and gets infected easily. The daily check replaces the pain signal with your eyes. It takes about 60 seconds: tops, soles, heels, and between the toes, both feet, every day.",
      },
      {
        q: "How do I check the bottom of my feet if I can't see them?",
        a: "Put a hand mirror on the floor and hold your foot over it, or take a photo of each sole with your phone. The phone is the better option: you can zoom in on a spot, and you can compare today's picture with yesterday's. If neither works because of eyesight or mobility, ask someone in the house to look, and tell your clinician so foot checks can be built into your visits.",
      },
      {
        q: "What counts as a same-day call?",
        a: "Any break in the skin that hasn't started to close within a day. Any blister. Redness, warmth, or swelling, especially in one foot with no obvious injury, which can be infection or the start of a Charcot foot. Any wound with drainage or a smell. Black or blue skin. A fever with any foot problem. New pain in a foot that usually can't feel pain. Call the day you find it; after hours, fever, black skin, or a red, hot, swollen foot means urgent care or the emergency department.",
      },
      {
        q: "Can I cut a callus or use a corn remover myself?",
        a: "No. Never cut a corn or callus at home, and skip the over-the-counter corn pads and liquids; they use salicylic acid to dissolve skin, and on a foot that can't feel, they take too much. A podiatrist reduces calluses safely and can see what's under them. A callus with a dark spot or dried blood inside is often the first sign of a wound underneath, and that one goes on the same-day list.",
      },
      {
        q: "How often should I have a foot exam if I have diabetes?",
        a: "At least once a year, per the ADA Standards of Care and the IWGDF. The exam tests sensation with a 10-gram monofilament, checks pulses, and looks for deformity and skin changes. After that, frequency follows risk under the IWGDF system: no findings, yearly; nerve damage or artery disease, every 6 to 12 months; both or one plus a deformity, every 3 to 6 months; a previous ulcer or amputation, every 1 to 3 months. Bring the [doctor-prep checklist](/doctor-prep).",
      },
      {
        q: "Do I need prescription diabetic shoes?",
        a: "Only if your clinician prescribes them, and then yes, worn indoors and out. Extra-depth shoes, custom-made shoes, custom insoles, or toe orthoses are prescribed when your foot shape, a callus that keeps returning, or a healed ulcer puts pressure where the skin can't take it. If you have none of those, the rules are fit measured late in the day, room in front of the longest toe, socks without seams, and a hand inside every shoe before it goes on. Medicare and many insurers cover prescribed diabetic footwear.",
      },
    ],
    sources: [
      {
        label: "American Diabetes Association — Foot Complications",
        url: "https://diabetes.org/about-diabetes/complications/foot-complications",
      },
      {
        label: "IWGDF — Guidelines on the Prevention of Foot Ulcers in Persons with Diabetes (2023 update)",
        url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-02-Prevention-Guideline.pdf",
      },
      {
        label: "NIH NIDDK — Diabetes & Foot Problems",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/foot-problems",
      },
    ],
  },
  "gout-in-the-big-toe-men-over-40": {
    metaTitle: "Gout in the Big Toe: How to Tell It From Stiffness (and What to Do)",
    metaDescription:
      "A big toe joint that went red, hot, and swollen overnight is not stiffness. How to tell them apart, what to do in the first 48 hours, and what the doctor tests.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "How can I tell a gout flare from a stiff big toe?",
        a: "Timing and heat. A gout flare comes on over hours, often at night, and the joint is hot, red, swollen, and too tender for a sock or a bedsheet. Stiffness builds over months or years, is worse on push-off and stairs, and the joint isn't hot. A joint that's already stiff can also flare, so handle the flare first. Only a uric acid test and sometimes joint fluid confirm gout. If the pattern is slow and mechanical, read [big toe stiffness in men over 40](/guides/big-toe-stiffness-in-men-over-40) instead.",
      },
      {
        q: "What should I do in the first 48 hours of a gout flare?",
        a: "Stay off the foot as much as you can, keep it raised above hip level when sitting, and ice it wrapped in a cloth for up to 20 minutes at a time. Drink water through the day and skip alcohol and sugary drinks. Don't stretch, mobilize, or wear toe spacers on a flaring joint. Over-the-counter anti-inflammatories are the usual first-line treatment, but only if you know they're safe for you. If it's your first flare, book a doctor this week.",
      },
      {
        q: "Why does gout hit the big toe first?",
        a: "Urate crystals form more readily in cooler tissue, and the big toe joint is the farthest from the heart and one of the coolest joints in the body. It also carries more load per step than any other joint in the foot. Both make it the most common site for a first flare. The same joint is the one that quietly stiffens over years in men over 40, which is why the two problems get mistaken for each other.",
      },
      {
        q: "Can I take an over-the-counter anti-inflammatory for a gout flare?",
        a: "Anti-inflammatories are the usual first-line treatment for a flare. They're not safe for everyone. If you have kidney disease, a history of stomach ulcers, heart failure, or you take blood thinners or blood pressure medication, ask a doctor or pharmacist before taking one. This site doesn't give doses; the label and your doctor do. A first flare is also the reason to get the diagnosis confirmed, not just to treat the pain.",
      },
      {
        q: "Does one gout flare mean I need medication for life?",
        a: "Not automatically. Long-term urate-lowering medication is a doctor's decision, usually considered after repeat flares (a common threshold is two or more a year), visible urate deposits under the skin, or a history of kidney stones. The doctor will check a uric acid level, kidney function, and your medication list first. Diet, hydration, and cutting back on alcohol support the plan, but for most men with recurring flares they aren't enough on their own.",
      },
      {
        q: "When is a swollen big toe an emergency?",
        a: "When the hot, swollen joint comes with a fever, feeling unwell, nausea, or redness spreading up the foot. A joint infection (septic arthritis) can look identical to a gout flare, and it needs same-day treatment. Go to urgent care or the emergency room rather than waiting for a routine appointment. For a flare without those signs, a doctor visit this week is the right pace. Bring the [doctor-prep checklist](/doctor-prep) so the visit covers the tests that matter.",
      },
    ],
    sources: [
      {
        label: "NHS — Gout",
        url: "https://www.nhs.uk/conditions/gout/",
      },
      {
        label: "AAFP — Diagnosis, Treatment, and Prevention of Gout",
        url: "https://www.aafp.org/pubs/afp/issues/2014/1215/p831.html",
      },
      {
        label: "Arthritis Foundation — Gout: Symptoms, Diagnosis, and Treatment",
        url: "https://www.arthritis.org/diseases/gout",
      },
    ],
  },
  "athletes-foot-and-foot-odor-what-works": {
    metaTitle: "Athlete's Foot and Foot Odor: What Works (and Why It Comes Back)",
    metaDescription:
      "Peeling between the toes and a smell that outlasts the shower come from one damp shoe. The cream, powder, and shoe rotation that clear it, and why it returns.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "How do I know if it's athlete's foot or just dry skin?",
        a: "Match the pattern. Athlete's foot usually starts between the toes (often the fourth and fifth), is worse on one foot, itches, and doesn't improve with moisturizer. Plain dry skin sits on the heel and ball of both feet, stays out of the web spaces, and improves within days of a real moisturizer. Thick or crumbly toenails on the same foot point toward fungus. A doctor can confirm it with a skin scraping; a course of antifungal cream that clears it answers the question too.",
      },
      {
        q: "How long should I keep using the antifungal cream?",
        a: "Use it as the package directs, on the whole area (between all the toes and across any scaling on the sole), and keep going after the skin looks normal. MedlinePlus advises continuing for 1 to 2 weeks after the infection has cleared. Stopping the day the itch goes away is the most common reason athlete's foot comes back a few weeks later. We reviewed [Lamisil AT](/reviews/lamisil-at-antifungal-cream).",
      },
      {
        q: "Why does my athlete's foot keep coming back?",
        a: "Three reasons, in order: the course was stopped early; the foot went back into the same damp, untreated shoes; or an untreated fungal toenail is reseeding the skin after every course. Fix all three: finish the cream, alternate two pairs of shoes so each dries a full day and treat them with antifungal powder, and if the nails are thick or yellow, start on those too. See the [toenail fungus guide](/guides/toenail-fungus-what-works).",
      },
      {
        q: "Does smelly feet mean I have athlete's foot?",
        a: "Not always, but they travel together. Foot odor comes from bacteria on the skin breaking sweat down; the byproducts are what you smell. A fungal infection makes it worse because peeling, soggy skin gives bacteria more to feed on, and the damp shoe that grew the fungus is the same shoe holding the sweat. If the smell survives a shower and the skin between your toes is peeling, treat both: the fungus with cream, the moisture with drying, powder, and shoe rotation.",
      },
      {
        q: "Do vinegar soaks or bleach cure athlete's foot?",
        a: "No. Vinegar may make the skin surface a little less friendly to fungus, but it doesn't clear an established infection and it stings cracked skin; treat it as a supplement at most. Bleach damages the skin barrier you're trying to repair, so skip it. The treatment with evidence behind it is an over-the-counter antifungal cream used for the full course, plus keeping the feet and shoes dry with powder and rotation.",
      },
      {
        q: "When should I see a doctor about athlete's foot?",
        a: "If it's not better after 2 to 4 weeks of cream used as directed, if it keeps returning despite finishing the course and rotating shoes, or if it has spread to the hands or nails. Go the same or next day for redness or warmth spreading up the foot or leg, cracks that weep or produce pus, or a fever. If you have diabetes, see a clinician early: cracks between the toes are an entry point for infection. Bring the [doctor-prep checklist](/doctor-prep).",
      },
    ],
    sources: [
      {
        label: "NIH MedlinePlus — Athlete's foot",
        url: "https://medlineplus.gov/ency/article/000875.htm",
      },
      {
        label: "NHS — Athlete's foot",
        url: "https://www.nhs.uk/conditions/athletes-foot/",
      },
      {
        label: "AAFP — Diagnosis and Management of Tinea Infections",
        url: "https://www.aafp.org/pubs/afp/issues/2014/1115/p702.html",
      },
    ],
  },
  "calluses-and-corns-men-over-40": {
    metaTitle: "Calluses and Corns: What to Remove and What's Causing Them",
    metaDescription:
      "A callus is skin answering pressure. File it without moving the load and it's back. How to read where it forms, thin it safely, and when a podiatrist steps in.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "What's the difference between a corn and a callus?",
        a: "Same tissue, different shape. A callus is a broad plate of thick skin with no clear edge, usually under the ball of the foot or around the heel, and it aches rather than stabs. A corn is small and dense with a central core that points inward, usually on or beside a toe joint or under a metatarsal head. A soft corn is the between-the-toes version, kept white and rubbery by sweat.",
      },
      {
        q: "Why do I get more calluses after 40?",
        a: "Four mechanical reasons stack up. The fat pad under the ball of the foot thins, so bone sits closer to the shoe. Toes drift and curl, which puts joints against shoe uppers. Feet widen and flatten while most men keep buying the size that fit at 30. And a stiff big toe or ankle shifts load to places that never carried it before. A standing job multiplies all of it.",
      },
      {
        q: "How do I tell a corn from a plantar wart?",
        a: "Press straight down, then squeeze from the sides. A corn hurts most under direct downward pressure and has a dense, slightly translucent core. A plantar wart hurts more when pinched from the sides and usually shows tiny black dots in it. If you can't tell after a soak, a podiatrist can, and the treatments are different, so it's worth asking. The [5-minute self-check](/assessment) covers the rest of the foot.",
      },
      {
        q: "Can I cut a callus off myself?",
        a: "No. Razors, callus knives, and nail scissors take skin unevenly and go deeper than you can see, and a cut under thick skin heals slowly and infects easily. Use a pumice stone or foot file after a shower, a few strokes at a time, and stop before the skin turns pink. A podiatrist can pare a large callus with a sterile blade in one visit if filing isn't enough.",
      },
      {
        q: "Are medicated corn pads safe to use?",
        a: "Not if you have diabetes, neuropathy, or poor circulation. The acid in them (salicylic acid) dissolves skin without knowing where the corn ends, and on a foot with poor sensation or blood flow it can open a wound that becomes an ulcer. On healthy skin it mostly burns the ring around the corn. Moving the pressure with a toe sleeve or a better-fitting shoe does more, with less risk.",
      },
      {
        q: "How long does it take a callus to go away?",
        a: "Pain usually eases within one to two weeks of removing the pressure, before the skin has changed much. With nightly urea cream and filing once or twice a week, a callus under the ball of the foot thins noticeably in three to four weeks, and a hard corn usually loses its core in four to six weeks. If it's still painful to walk on after four weeks, book a podiatrist.",
      },
    ],
    sources: [
      {
        label: "AAFP — Corns and Calluses Resulting from Mechanical Hyperkeratosis",
        url: "https://www.aafp.org/pubs/afp/issues/2002/0601/p2277.html",
      },
      {
        label: "APMA — Corns and Calluses",
        url: "https://www.apma.org/patients-and-the-public/conditions-affecting-the-foot-and-ankle/corns-and-calluses/",
      },
      {
        label: "NHS — Corns and calluses",
        url: "https://www.nhs.uk/conditions/corns-and-calluses/",
      },
    ],
  },
  "foot-and-calf-cramps-at-night": {
    metaTitle: "Foot and Calf Cramps at Night: Causes After 40 and What Stops Them",
    metaDescription:
      "Night calf and arch cramps rise after 40, mostly from a shortened calf held toes-down in bed. The bedtime stretch, which fixes fail, and when to see a doctor.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "Why do I get calf and foot cramps at night after 40?",
        a: "Several things stack with age: the calf and plantar fascia shorten after decades of heeled shoes and sitting, muscle mass declines, the nerves that drive the calf fire more easily, and bed holds the foot toes-down with the calf at its shortest for hours. A long day standing, dehydration, evening alcohol, or a new medication usually sets off a given night. Up to 60 percent of adults report night cramps, and the rate climbs with age.",
      },
      {
        q: "What should I do the moment a cramp hits?",
        a: "Stand up and put weight on the leg. Loading the calf usually breaks the contraction faster than anything you can do lying down. If you can't stand yet, pull the toes toward the shin and hold until the muscle releases, then walk for a minute. Use heat afterward for the soreness, not ice. A cramp that lasts longer than ten minutes despite this needs a doctor rather than another stretch.",
      },
      {
        q: "Does stretching before bed prevent night cramps?",
        a: "It has the most trial support of any option, though the evidence is limited and the trials are small. A two-minute set works: wall calf stretch with the knee straight, then bent, a towel stretch of the sole, and ankle circles. Do it nightly for four weeks before judging. Expect fewer and milder cramps rather than zero. The [recovery routine](/routines/recovery) has the same calf and sole work.",
      },
      {
        q: "Does magnesium help with leg cramps?",
        a: "Not for ordinary night cramps in older adults. A 2020 Cochrane review found the difference between magnesium and placebo was small and not statistically significant, and concluded it is unlikely to provide meaningful cramp prevention. Results in pregnancy are mixed. Unless a blood test shows a deficiency, it is a supplement with a diarrhea side effect and little else to offer for this problem.",
      },
      {
        q: "Can my medication be causing the cramps?",
        a: "Possibly. Diuretics and statins are the most often named, with some asthma inhalers, intravenous iron, and a few hormone drugs also on the list, though the evidence linking any single drug to cramps is thinner than most people assume. If cramps started within weeks of a new prescription or dose change, raise it with the prescriber. Don't stop anything on your own; whether to swap or retime a drug is their call.",
      },
      {
        q: "When are night cramps a reason to see a doctor?",
        a: "Swelling, warmth, or tenderness in one calf is urgent same-day care because it can be a blood clot. Also book a visit for weakness or numbness with the cramps, cramps that began after a new medication, visible muscle wasting, calf pain when walking that stops with rest (a circulation pattern), or cramps most nights after four weeks of nightly stretching. Bring the [doctor-prep checklist](/doctor-prep) and your two-week log.",
      },
    ],
    sources: [
      {
        label: "AAFP — Nocturnal Leg Cramps",
        url: "https://www.aafp.org/pubs/afp/issues/2012/0815/p350.html",
      },
      {
        label: "Cochrane — Magnesium for muscle cramps",
        url: "https://www.cochrane.org/CD009402/NEUROMUSC_magnesium-skeletal-muscle-cramps",
      },
      {
        label: "NHS — Leg cramps",
        url: "https://www.nhs.uk/conditions/leg-cramps/",
      },
    ],
  },
  "bunions-men-over-40": {
    metaTitle: "Bunions in Men Over 40: What Slows Them and When Surgery Is Honest",
    metaDescription:
      "A bunion is structural: shoes and spacers don't reverse it, but they change how fast it drifts and how much it hurts. Which shoes, and when surgery is honest.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "Can a bunion be reversed without surgery?",
        a: "No. The drift is structural: the metatarsal angles out and the toe angles in, and no shoe, spacer, or splint moves bone back. What conservative care changes is the speed of the drift and the pain. A wide toe box, evening spacers, a pad over the bump, and foot strength work can keep a mild bunion manageable for decades. Surgery is the only thing that changes the angle.",
      },
      {
        q: "Why do men get bunions if it's mostly a women's problem?",
        a: "Bunions are more common in women, but the causes aren't female. Family foot shape, flat feet that roll inward, arthritis in the joint, and decades of narrow dress shoes all apply to men. The difference is that men ignore the bump longer and the product marketing isn't aimed at them, so they tend to show up to a podiatrist a stage later than they should.",
      },
      {
        q: "Do toe spacers help a bunion?",
        a: "For symptoms, yes. Worn 20 minutes once or twice a day, they give the crowded joint a break, ease aching, and keep the soft tissue from tightening around the drifted position. They don't correct the angle, and no spacer will. Treat them as relief, not a fix. See [our Yoga Toes review](/reviews/yoga-toes-gem-separators) for fit and how to build up wear time.",
      },
      {
        q: "What kind of shoes are best for a bunion?",
        a: "A wide toe box so the big toe sits straight without pressure on the bump, a flat sole so the forefoot isn't pitched forward, and enough flexibility to bend at the ball of the foot. Any shoe that leaves a red mark over the joint after a day is working against you. We reviewed one that gets the shape right in the [Kuru Atom review](/reviews/kuru-atom-sneakers).",
      },
      {
        q: "When should I consider bunion surgery?",
        a: "When pain limits daily walking despite six months of correct shoes, spacers, and care, when the second toe is being pushed out of place, or when the skin over the bump keeps breaking down. Surgery is for pain and function, not appearance. Recovery runs weeks to months, there are many procedures, and bunions sometimes come back, so the decision rests on what the foot can no longer do.",
      },
      {
        q: "What if my big toe joint suddenly became hot, red, and very painful?",
        a: "That's a different problem. A bunion grows over years; a joint that goes from fine to hot, swollen, and painful overnight points to gout or infection and needs a doctor promptly, the same day if you have a fever. Don't treat it with a spacer or a pad. Bring the [doctor-prep checklist](/doctor-prep) so the visit covers when it started and what you've taken.",
      },
    ],
    sources: [
      {
        label: "AAOS OrthoInfo — Bunions",
        url: "https://www.orthoinfo.org/en/diseases--conditions/bunions/",
      },
      {
        label: "NHS — Bunions",
        url: "https://www.nhs.uk/conditions/bunions/",
      },
      {
        label: "NIH MedlinePlus — Bunions",
        url: "https://medlineplus.gov/ency/article/001231.htm",
      },
    ],
  },
  "numbness-and-tingling-in-the-feet": {
    metaTitle: "Numbness and Tingling in the Feet: Nerve, Shoe, or Something Upstream",
    metaDescription:
      "Pins and needles, a dead patch, or burning in the toes has four causes in men over 40: the shoe, a trapped nerve, the lower back, or neuropathy. Sort yours.",
    datePublished: "2026-09-22",
    faq: [
      {
        q: "Why are my toes numb in one pair of shoes and fine in the others?",
        a: "That pattern points at the shoe. The nerves on the top of the foot and between the toes sit close to the surface, and a tight lace, a stiff tongue, or a narrow toe box can press one for hours. Numbness that clears overnight and returns in the same shoes is compression until proven otherwise. Re-lace to skip the sore spot, move to a wider toe box, and give it two weeks. The [dress-shoes guide](/guides/what-your-dress-shoes-are-doing-to-your-feet) covers the work-shoe version.",
      },
      {
        q: "What does Morton's neuroma feel like?",
        a: "A thickened nerve between the third and fourth toes. It feels like a pebble or a folded sock under the ball of the foot, with burning or tingling into those two toes, worse in narrow shoes and easier once they're off. A wide toe box and a metatarsal pad placed just behind the ball of the foot bring relief for about half of people, and a podiatrist usually gives that 3 to 6 months before discussing anything else. The [ball-of-foot guide](/guides/ball-of-foot-pain-in-men-over-40) covers pad placement.",
      },
      {
        q: "Can a problem in my lower back cause numbness in my foot?",
        a: "Yes, and it is one of the four common causes. A bulging disc or a narrowed spinal canal can press a nerve root in the lower back, and you feel it at the far end of the nerve, often the outer foot or the big toe. The tell is one side only, usually with back or buttock pain, and symptoms that change with sitting, bending, or a long drive. Shoes make no difference. This version needs a clinician's exam, not a shoe change.",
      },
      {
        q: "What is the stocking pattern, and why does it matter?",
        a: "Peripheral neuropathy affects the longest nerves first, so it starts in the toes of both feet and creeps upward evenly, like a sock filling with numbness. That symmetry separates it from a shoe, a neuroma, or a back problem, which almost always affect one foot. Diabetes is the most common cause; alcohol, low B12, thyroid problems, some medications, and chemotherapy are the others. It needs bloodwork to find the cause, and the [diabetic foot care rules](/guides/diabetic-foot-care-men-over-40) apply if diabetes is in the picture.",
      },
      {
        q: "Which numbness symptoms mean I should go to the ER?",
        a: "Numbness in the groin, buttocks, or inner thighs with any change in bladder or bowel control, or sudden numbness with new weakness in a leg. That pattern (cauda equina syndrome) is a surgical emergency, and the outcome depends on how fast the pressure comes off the nerves. Separately, both feet with balance loss or a fall, a foot you can't lift, numbness after an injury, or a wound you can't feel are same-week doctor visits, not emergencies.",
      },
      {
        q: "Will a vitamin B supplement fix numb feet?",
        a: "Only if a blood test shows your B12 is low, and in that case a doctor manages the replacement. Without a measured deficiency, a supplement does nothing for the nerve and delays the workup that finds the real cause. The same goes for massage and circulation gadgets: they feel good for an hour and don't move a disc, widen a shoe, or shrink a neuroma. Test first, then treat what the test finds.",
      },
    ],
    sources: [
      {
        label: "American Academy of Family Physicians — Peripheral Neuropathy: Evaluation and Differential Diagnosis",
        url: "https://www.aafp.org/pubs/afp/issues/2020/1215/p732.html",
      },
      {
        label: "AAOS OrthoInfo — Morton's Neuroma",
        url: "https://www.orthoinfo.org/en/diseases--conditions/mortons-neuroma/",
      },
      {
        label: "AAOS OrthoInfo — Cauda Equina Syndrome",
        url: "https://www.orthoinfo.org/en/diseases--conditions/cauda-equina-syndrome/",
      },
    ],
  },
  // ── 2026-09-18 expansion. Nails + alignment + occupation + kinetic-chain
  // + runners cluster. Newest first per feedback_new_articles_top_of_list.
  "ingrown-toenail-what-actually-stops-the-cycle": {
    metaTitle: "Ingrown Toenail: What Actually Stops the Cycle",
    metaDescription:
      "Ingrown toenails come back because the trim technique reproduces the same edge. Straight-across cutting, warm-soak protocol, when to see a podiatrist, and the shoe fit that stops recurrence.",
    datePublished: "2026-09-18",
    faq: [
      {
        q: "Why does my ingrown toenail keep coming back?",
        a: "Because the trim technique keeps producing the same problematic edge. When a nail is rounded at the corner (like fingernails), the growing nail dives into the flesh instead of growing straight out. Straight-across cuts, corners left square, is the mechanism-level fix. Most men were taught to round toenail corners and don't realize that's the recurrence engine.",
      },
      {
        q: "How do I trim it straight across without leaving a sharp corner?",
        a: "Clip the nail straight across at the free edge, then file (not clip) the very corner to smooth the edge without rounding it. The corner should be blunt, not pointed and not rounded. A cheap glass or fine metal file handles this in 10 seconds.",
      },
      {
        q: "Does the warm-water soak actually help?",
        a: "For an active flare, yes: 15 minutes in warm water twice daily softens the skin around the nail, reduces inflammation, and lets the ingrown edge lift slightly on its own. Add a tablespoon of Epsom salt if you want; the salt effect is minor but the ritual helps consistency. Do not soak longer than 20 minutes; over-hydrated skin is more fragile.",
      },
      {
        q: "Can I lift the nail with dental floss or a cotton wisp?",
        a: "Yes, once inflammation is down (day 3 or 4 of the soak protocol). Gently insert a small piece of dental floss or cotton under the ingrown edge to encourage it to grow above the skin rather than into it. Change daily. Stop if it causes pain; that means the tissue is still too inflamed and needs more soak time first.",
      },
      {
        q: "When do I need to see a podiatrist?",
        a: "Red, hot, swollen, or draining pus (possible infection) needs a visit within 24 to 48 hours. Diabetes plus any ingrown needs professional trim, not DIY. A recurring ingrown that resists 3 rounds of the home protocol may need partial nail avulsion (a 20-minute in-office procedure) to permanently narrow the nail.",
      },
      {
        q: "What shoe fit prevents recurrence?",
        a: "A wide-enough toe box that your longest toe has a full thumb's width of space at the front. Narrow toe boxes crush the big toe against its neighbor and press the nail edge into the flesh with every step. See our [dress-shoes guide](/guides/what-your-dress-shoes-are-doing-to-your-feet) for the fit rules that apply to work shoes too.",
      },
    ],
    sources: [
      {
        label: "AAFP — Ingrown Toenails: Diagnosis and Treatment",
        url: "https://www.aafp.org/pubs/afp/issues/2019/0201/p158.html",
      },
      {
        label: "NIH StatPearls — Ingrown Toenail (Onychocryptosis)",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK546697/",
      },
    ],
  },
  "big-toe-stiffness-in-men-over-40": {
    metaTitle: "Big Toe Stiffness in Men Over 40 (Hallux Limitus and Rigidus)",
    metaDescription:
      "Hallux limitus reduces big-toe range; hallux rigidus locks it. Both progress from decades of restrictive shoes and slow to reverse. The mobility protocol that keeps the joint moving before it locks.",
    datePublished: "2026-09-18",
    faq: [
      {
        q: "What's the difference between hallux limitus and hallux rigidus?",
        a: "Hallux limitus is reduced range of motion at the big toe joint (metatarsophalangeal joint), typically less than 60 degrees of extension. Hallux rigidus is the end-stage: the joint is essentially locked with under 10 degrees of extension. Limitus is reversible with mobility work; rigidus usually needs surgical management. The window matters.",
      },
      {
        q: "How do I check my big toe range at home?",
        a: "Sit with your foot flat. Manually pull your big toe upward as far as it comfortably goes. If the toe extends to roughly 45-60 degrees, that's normal. Less than 30 degrees is hallux limitus territory. Less than 10 degrees is rigidus and you need a podiatrist to assess options.",
      },
      {
        q: "Can I fix hallux limitus without surgery?",
        a: "Often yes if caught early. Daily mobility work (see the article for the specific 3-move protocol), a wider-toe-box shoe, and toe separators worn at night can slow or halt progression. Studies show 60-80% of hallux limitus cases don't progress to rigidus with consistent 12-month conservative care. But it requires actual daily consistency.",
      },
      {
        q: "Do toe separators or Yoga Toes help?",
        a: "For preventing further drift and stiffness, yes. For reversing existing stiffness, marginally. Wear them 20 minutes twice a day; longer causes soreness in men whose toes have been crushed together for decades. See [our Yoga Toes review](/reviews/yoga-toes-gem-separators) for the specific product.",
      },
      {
        q: "Will running make hallux rigidus worse?",
        a: "Running through unmanaged rigidus can accelerate cartilage wear. But total rest doesn't help either; the joint stiffens further without load. Compromise: reduce mileage by 30%, switch to a rocker-sole shoe that reduces big toe extension per step, and see a podiatrist for a proper assessment.",
      },
      {
        q: "How long does the mobility protocol take to show results?",
        a: "Most men see meaningful range improvement (5-10 degrees) by week 8 of daily consistent work. Full plateau is at 6 months. If you're not seeing gain by week 8, the joint may already be past the reversible window; time for the podiatrist visit.",
      },
    ],
    sources: [
      {
        label: "NIH StatPearls — Hallux Rigidus",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK430886/",
      },
      {
        label: "AAFP — Common Foot Conditions",
        url: "https://www.aafp.org/pubs/afp/issues/2019/0715/p86.html",
      },
    ],
  },
  "foot-pain-from-standing-all-day": {
    metaTitle: "Foot Pain from Standing All Day: The On-Shift Protocol",
    metaDescription:
      "8+ hours on hard floors flattens the fat pad, fatigues the arch, and inflames the plantar fascia within weeks. Shoe fit, insole, on-shift micro-break protocol, and the recovery routine that undoes the day.",
    datePublished: "2026-09-18",
    faq: [
      {
        q: "Why do my feet hurt after standing 8 hours when they didn't at 30?",
        a: "Three things changed in your 40s. The fat pad under the heel and forefoot lost 15 to 30 percent of its thickness. Recovery slowed, so a hard day now bleeds into the next. And the calf shortened from decades of sitting outside work, so what was a manageable load at 30 now compounds into plantar fasciitis in weeks.",
      },
      {
        q: "What's the single most important shoe fit change for standing workers?",
        a: "A wider toe box. Standing on a hard floor for 8 hours in a narrow shoe forces the metatarsal heads together and concentrates load on 3 of the 5 heads, which is what drives most metatarsalgia and morning heel pain in this population. Wide-toe-box lines (Altra, Topo, Xero, wider fits of Brooks) plus a supportive insole is the base config.",
      },
      {
        q: "Do compression socks help?",
        a: "For end-of-day swelling, yes: 15-20 mmHg graduated compression reduces venous pooling and the ankle-swell that shows up around hour 6. They don't fix arch pain or heel pain on their own; they address a different mechanism (circulation). Wear them if your feet swell visibly by mid-shift.",
      },
      {
        q: "What if I can't wear the shoe I want to work?",
        a: "Add the widest insole that fits (Superfeet or Powerstep), replace anti-fatigue standing mats if you control the workstation, and prioritize the post-shift recovery routine. Two of those three are still a meaningful upgrade even if the shoe is locked in by dress code.",
      },
      {
        q: "How long until the on-shift protocol works?",
        a: "Most men see meaningful reduction in end-of-day pain within 2 to 3 weeks of the shoe fit + insole + micro-break combination. If nothing has changed by week 4, the pattern is likely plantar fasciitis or metatarsalgia specifically and needs the diagnostic articles ([heel pain](/guides/heel-pain-first-thing-in-the-morning) or [ball of foot](/guides/ball-of-foot-pain-in-men-over-40)) to address the mechanism.",
      },
      {
        q: "Are anti-fatigue mats worth it?",
        a: "Yes if you control the workstation. Studies show 15 to 30 percent reduction in end-of-day fatigue on mats versus bare concrete. The mat surface encourages micro-weight-shifts that keep blood flowing and prevent the static-load fatigue that concrete produces. Cost is $50-100 for a decent one.",
      },
    ],
    sources: [
      {
        label: "PubMed — Occupational standing and lower-limb musculoskeletal disorders",
        url: "https://pubmed.ncbi.nlm.nih.gov/24659000/",
      },
      {
        label: "NIH StatPearls — Metatarsalgia",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK560873/",
      },
    ],
  },
  "knee-pain-that-starts-in-the-feet": {
    metaTitle: "Knee Pain That Starts in the Feet: The Pronation Chain",
    metaDescription:
      "Knee pain over 40 often traces to the feet: overpronation rotates the shin inward and pulls the kneecap off track. The self-check that tells you if this is you, and the strengthen + support fix that unwinds it.",
    datePublished: "2026-09-18",
    faq: [
      {
        q: "How can I tell if my knee pain starts in my feet?",
        a: "The single-leg squat mirror check: stand in front of a mirror, lift one foot slightly, slowly lower into a quarter-squat on the standing leg. If the knee visibly drifts inward past the big toe, the arch is collapsing and rotating the shin. That's the pronation chain in action. If the knee stays over the middle of the foot, your knee pain is likely from something else.",
      },
      {
        q: "What is overpronation exactly?",
        a: "Excessive inward roll of the foot during walking or running. Some pronation is normal and useful; overpronation is when the arch flattens too far, the shin rotates internally, and the femur follows. That internal rotation pulls the kneecap off its groove, which is the mechanical cause of most patellofemoral pain (runner's knee).",
      },
      {
        q: "Will arch support insoles fix my knee pain?",
        a: "For pronation-driven knee pain, often yes: a supportive insole ([Superfeet BLUE](/reviews/superfeet-blue-insoles) is our default recommendation) reduces the arch collapse that drives the shin rotation, which stops the kneecap from being pulled off track. Give it a 4-week trial. If knee pain drops by more than half, the diagnosis is correct.",
      },
      {
        q: "Do I need custom orthotics?",
        a: "Off-the-shelf insoles work for 70-80% of pronation cases. Custom orthotics ($300-600, made by a podiatrist from a mold of your foot) are worth it if you've tried 2 off-the-shelf brands with 4-week trials each and neither moved the knee pain. Not first-line.",
      },
      {
        q: "Should I strengthen or stretch the knee?",
        a: "Strengthen the feet AND the hip, not the knee itself. Weak intrinsic foot muscles let the arch collapse; weak hip abductors let the femur rotate. Both feed the same pronation chain. See the [foot strength routine](/routines/strength) for the foot side; add clamshells and side-planks for hip abductors.",
      },
      {
        q: "How long until my knee pain resolves?",
        a: "Pronation-driven knee pain typically responds in 4 to 8 weeks with the insole + strengthening protocol. If pain persists past 12 weeks with consistency, either the diagnosis is wrong or there's cartilage damage that needs imaging. See an orthopedist at that point.",
      },
    ],
    sources: [
      {
        label: "PubMed — Foot pronation and patellofemoral pain syndrome",
        url: "https://pubmed.ncbi.nlm.nih.gov/24659000/",
      },
      {
        label: "NIH StatPearls — Patellofemoral Pain Syndrome",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK557657/",
      },
    ],
  },
  "runners-over-40-foot-pain": {
    metaTitle: "Runners Over 40: Foot Pain That Wasn't There at 30",
    metaDescription:
      "The four foot problems that show up in runners after 40: plantar fasciitis, metatarsalgia, Achilles tendinopathy, big-toe stiffness. Why they cluster in this decade, and the mileage + shoe fixes that keep you running.",
    datePublished: "2026-09-18",
    faq: [
      {
        q: "Why are my feet suddenly hurting when I run at 45?",
        a: "Four things changed. Fat pad under the heel and forefoot thinned. Tendon collagen turnover slowed, so mileage that used to bounce back now accumulates as micro-tears. Calf shortened from more sitting and less standing time. And decades of shoes with narrow toe boxes finally caught up as reduced big-toe extension. Any one of these can be handled; all four at once is what makes running over 40 feel like a different sport.",
      },
      {
        q: "Should I stop running?",
        a: "Almost never. Complete rest for weeks lets tendons weaken and doesn't accelerate healing for the chronic issues (tendinopathy, fasciitis) that dominate over-40 runners. The right answer is nearly always to reduce mileage by 30-50%, address the specific mechanism (see the diagnostic guides linked below), and rebuild volume gradually.",
      },
      {
        q: "What's the safest weekly mileage increase after 40?",
        a: "10% max, and only if the current week was pain-free at 3-out-of-10 or under. The classic 10% rule holds; what changes over 40 is the tolerance for breaking it. Under 30 you might get away with a 20% jump; over 40 that same jump triggers a flare in about half of men.",
      },
      {
        q: "Do minimalist / barefoot shoes help or hurt?",
        a: "It depends where you're starting from. Runners who transition slowly (6+ months, starting with 10% of weekly miles in minimalist shoes) usually strengthen the intrinsic foot muscles and reduce chronic pain. Runners who switch abruptly at 40+ trigger metatarsal stress fractures and Achilles flares within weeks. Slow or don't switch.",
      },
      {
        q: "Should I change my running form?",
        a: "Form changes at 40+ carry risk: what you're changing FROM has 30 years of neuromuscular pattern behind it, and forcing a new pattern often produces new injuries. Small adjustments (slightly higher cadence, less overstriding) are reasonable; deliberately switching from heel-strike to forefoot-strike is not. Address shoe and mileage first, form last.",
      },
      {
        q: "How do I know if my foot pain needs a podiatrist versus rest?",
        a: "Sharp pain during a run that doesn't ease within 5 minutes of continued running; pain that gets worse the next day rather than better; visible swelling; numbness or tingling; or foot pain that follows a specific painful event. Any of those, book a sports podiatrist. Everything else responds to the mileage-plus-shoe protocol first.",
      },
    ],
    sources: [
      {
        label: "PubMed — Running injuries in masters (40+) athletes",
        url: "https://pubmed.ncbi.nlm.nih.gov/26461487/",
      },
      {
        label: "NIH StatPearls — Plantar Fasciitis",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
      {
        label: "PubMed — Eccentric loading in Achilles tendinopathy (Alfredson 1998)",
        url: "https://pubmed.ncbi.nlm.nih.gov/9617396/",
      },
    ],
  },
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
    metaTitle: "Toenail Fungus: What Works, What's a Scam, Where to Start",
    metaDescription:
      "The five ways to treat toenail fungus ranked by cure rate, plus the guides that cover diagnosis, the 12-month timeline, prevention, and home remedies.",
    datePublished: "2026-03-01",
    dateModified: "2026-09-25",
    faq: [
      {
        q: "Is my thick yellow toenail fungus?",
        a: "About half the time, no. Old trauma, age, psoriasis, and a bacterial tint all thicken or discolor a nail, and none of them respond to antifungals. The pattern that points to fungus is a nail that goes yellow and crumbly from the tip or side and works back, often with peeling skin between the toes. A nail clipping test at the podiatrist settles it in one visit; the self-check guide covers the look-alikes.",
      },
      {
        q: "What is the most effective treatment for toenail fungus?",
        a: "Oral terbinafine, a daily tablet for 12 weeks. In its trials about 4 men in 10 reached a completely normal nail and about 7 in 10 were fungus-free on the lab test, the best figures of any treatment. It needs a confirmed diagnosis, a liver blood test first, and a medication check. The prescription topicals cure fewer and suit mild cases at the tip.",
      },
      {
        q: "Does Lamisil cream work on toenail fungus?",
        a: "No. Terbinafine cream works on skin, where it can reach the fungus. A nail plate stops it. It's the right treatment for athlete's foot between the toes, which usually comes with a fungal nail and should be treated at the same time, and the wrong treatment for the nail itself.",
      },
      {
        q: "How long does it take to get rid of toenail fungus?",
        a: "About a year for a big toenail, sometimes 18 months in men over 50. A toenail grows roughly a millimeter a month, and new clean nail has to travel from the cuticle to the tip. The pill course is 12 weeks; the topicals are 48 weeks. Progress shows at the base as a clear band, not at the tip, which looks the same until it's trimmed off.",
      },
      {
        q: "Why does toenail fungus come back?",
        a: "Because the fungus is still in the shoes, on shared floors, and usually on the skin of the same foot. Between one in ten and one in two treated nails get reinfected. Two pairs of shoes in rotation and treated, wicking socks changed daily, thirty seconds drying between the toes, athlete's foot treated at the first peel, and often a twice-weekly topical after the cure are what keep it away.",
      },
      {
        q: "Do Vicks, vinegar, or tea tree oil cure toenail fungus?",
        a: "Not at any rate close to the prescriptions. Vicks has one small uncontrolled study in which about a quarter of 18 people cleared. Tea tree oil has old, weak evidence and can cause a rash. Vinegar, baking soda, garlic, mouthwash, and peroxide have no nail trials at all. They're harmless alongside real treatment and a year lost instead of it.",
      },
    ],
    sources: [
      {
        label: "AAFP — Onychomycosis: Rapid Evidence Review (2021)",
        url: "https://www.aafp.org/pubs/afp/issues/2021/1000/p359.html",
      },
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
  "ball-of-foot-pain-in-men-over-40": {
    metaTitle: "Ball-of-Foot Pain in Men Over 40 (Metatarsalgia): What Fixes It",
    metaDescription:
      "Burning or aching under the ball of the foot at the end of a standing day is metatarsalgia. Two things drive it after 40: fat-pad thinning and narrow toe boxes. The specific fix, and when to see a specialist.",
    datePublished: "2026-09-10",
    faq: [
      {
        q: "What causes ball-of-foot pain in men over 40?",
        a: "Two overlapping things drive most cases. First, the fat pad under the metatarsal heads thins and loses elasticity progressively from about age 40; less cushion means more direct bone-to-shoe pressure per step. Second, narrow-toe-box shoes force the metatarsal heads together and load the middle three heads with force meant for all five. Fat pad thinning is the biology; footwear is the trigger.",
      },
      {
        q: "Is metatarsalgia the same as a Morton's neuroma?",
        a: "No, and the distinction matters for treatment. Metatarsalgia is diffuse aching or burning across the ball of the foot, usually worse at end of day and better with rest. Morton's neuroma is a specific nerve entrapment between the 3rd and 4th metatarsal heads that produces sharp, shooting, sometimes electric pain often with the sensation of a pebble under the foot. If it feels sharp and specific rather than diffuse and dull, see a podiatrist.",
      },
      {
        q: "Do metatarsal pads actually work?",
        a: "Yes, when placed correctly. A metatarsal pad sits just BEHIND the metatarsal heads (proximal to them), not directly under them, so it lifts the arch of the metatarsal bones and offloads the heads. Placement is the whole game; a pad in the wrong spot makes the pain worse. Buy an off-the-shelf pad (Pedag, Superfeet), position it, walk in it for 20 minutes, adjust until end-of-day pain drops by half.",
      },
      {
        q: "Can I fix this with better shoes alone?",
        a: "Sometimes, if the shoe change is significant. Wider toe box (measure at the ball of foot, not the toe tip), lower heel-to-toe drop (8 mm or less), and a firmer forefoot rocker sole together offload the metatarsal heads meaningfully. Add a metatarsal pad in the new shoe for maximum effect. Most men who buy new shoes without the pad get partial relief and give up too soon.",
      },
      {
        q: "How long until it improves?",
        a: "Most training-related metatarsalgia improves noticeably within 4 to 6 weeks of the shoe fix plus met-pad plus a graded reduction in standing/walking volume. If nothing has changed by week 6 with consistency, book a podiatrist to rule out a stress fracture, a neuroma, or capsulitis.",
      },
      {
        q: "Are cortisone injections worth it?",
        a: "For confirmed neuroma or capsulitis at the metatarsal joint, cortisone can quiet the flare enough to make the shoe-and-pad protocol tolerable. For plain metatarsalgia driven by fat-pad thinning, cortisone doesn't address the mechanism and repeated injections can further thin the fat pad. Ask specifically what the injection is targeting before agreeing.",
      },
    ],
    sources: [
      {
        label: "NIH StatPearls — Metatarsalgia",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK560873/",
      },
      {
        label: "PMC — Fat Pad Atrophy in the Foot",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7304558/",
      },
      {
        label: "AAFP — Metatarsalgia: Common Causes and Treatment",
        url: "https://www.aafp.org/pubs/afp/issues/2019/0715/p86.html",
      },
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
  daily: {
    metaTitle: "The Nightly 5-Minute Foot-Care Checklist for Men Over 40",
    metaDescription:
      "The daily 5-minute foot-care routine as a pure checklist: wash, dry between toes, inspect, moisturize. Print it, tape it above the bathroom sink, and do it before bed.",
    datePublished: "2026-09-18",
    howTo: {
      totalTime: "PT5M",
      supplies: ["Urea-based foot cream (10-25%)", "Cotton socks (optional, for cracked heels)"],
      tools: ["Towel", "Nail clipper (weekly-ish)"],
      steps: [
        { name: "Wash", text: "Warm water and mild soap. Rub between the toes with your fingers, not just water. Rinse. Skip if you already showered." },
        { name: "Dry between the toes", text: "Toe-by-toe with a towel. The space between the 4th and 5th toe is where 80% of athlete's foot infections start. Fungi need moisture; dry toe webs starve them." },
        { name: "Inspect", text: "Quick visual scan for color change, new callus, small cuts, blisters, or nail edge lifting. 15 seconds. Catches problems at week 1 instead of week 4." },
        { name: "Moisturize", text: "Urea-based cream (10-25%) on damp feet. Focus on heels, sides, dry patches. Skip between the toes; that's where you want dryness." },
        { name: "Nail glance (weekly-ish)", text: "Not a nightly trim; a nightly glance. Most men over 40 need a full trim every 2-3 weeks. Straight across, corners left square, file the edge smooth." },
      ],
    },
    faq: [
      {
        q: "Why is drying between toes important?",
        a: "Fungal spores need moisture and warmth to grow, and the space between the 4th and 5th toe is the darkest, dampest microclimate on the foot. Most athlete's foot infections start there. A 3-second toe-by-toe dry after every shower is the single highest-leverage prevention move.",
      },
      {
        q: "Do I really need to inspect my feet every day?",
        a: "Yes if you're diabetic, on blood thinners, or have reduced foot sensation. Otherwise a 10-second daily glance is fine (color change, new callus, small cut). The inspection matters because you catch things at week 1 instead of week 4, when they're 10x easier to fix.",
      },
      {
        q: "What moisturizer should I use?",
        a: "A urea-based cream (10 to 25 percent). Urea both moisturizes AND softens callus, so it does two jobs at once. Apply to damp (not wet) feet, skip between the toes to avoid fungal moisture traps.",
      },
      {
        q: "Can I do this in the morning instead?",
        a: "Yes, though evening is stronger. Overnight skin repair is when the urea cream does most of its work, and the routine also functions as a wind-down anchor for sleep. Morning is fine if evening won't stick; consistency matters more than timing.",
      },
      {
        q: "What if I miss a day?",
        a: "One day is nothing. Three days is a habit break, restart tonight. The pattern that breaks the habit is skipping when tired and then feeling too behind to start again. The routine is 5 minutes; you have 5 minutes.",
      },
    ],
    sources: [
      {
        label: "AAFP — Common Foot Problems: OTC Treatments and Home Care",
        url: "https://www.aafp.org/pubs/afp/issues/2019/1015/p498.html",
      },
    ],
  },
  "office-day": {
    metaTitle: "Desk Micro-Routines: Foot Exercises at Work for Men Over 40",
    metaDescription:
      "Six micro-routines you can do at the desk in under two minutes each. Break up 8 hours of sitting, prevent calf shortening and ankle stiffness that show up on the walk home.",
    datePublished: "2026-09-18",
    howTo: {
      totalTime: "PT2M",
      tools: ["Pen or small towel (for toe grip)", "Chair", "Wall or desk edge"],
      steps: [
        { name: "Seated calf pumps", text: "Feet flat on the floor. Lift both heels as high as they'll go while keeping the balls on the floor. Lower slowly. 30 reps." },
        { name: "Ankle circles", text: "One foot at a time. Extend the leg slightly. Rotate the ankle 10 times clockwise, 10 counter-clockwise. Switch feet." },
        { name: "Toe spreads", text: "Feet flat, socks off if possible. Spread the toes as wide as they'll go. Hold 2 seconds. 20 reps." },
        { name: "Seated toe grip", text: "Place a pen or small towel under one foot. Pick it up with your toes. Hold 2 seconds. 10 reps per side." },
        { name: "Wall calf stretch", text: "Every 3-4 hours, stand up. Face a wall. One foot back, heel down, back leg straight. 20 seconds. Then back knee bent, 20 more. Switch." },
        { name: "Squat-to-stand transitions", text: "Every 3-4 hours, do 10 slow squats to a comfortable depth. Use desk for balance if needed. Breaks the seated position with a full-body load." },
      ],
    },
    faq: [
      {
        q: "Why does sitting all day cause foot problems?",
        a: "Two mechanisms. First, prolonged plantarflexion (foot pointing slightly down while seated) shortens the calf and Achilles over months to years. Second, immobility reduces venous return, so blood pools in the feet and ankles causing end-of-day swelling. Both are undone by 2 minutes of movement per hour.",
      },
      {
        q: "Do I really need to do this every hour?",
        a: "Every 90 minutes is the ceiling that catches the compensation before it locks in. Two hours between is where the calf starts to stiffen enough that the next stand-up hurts. Set a quiet timer.",
      },
      {
        q: "Can I do these barefoot?",
        a: "Yes and preferred if your office setting allows it. The intrinsic foot muscles fire more with a bare foot on the floor than trapped in a shoe. If you can't go barefoot, slip off the heel of your shoe during the calf pumps.",
      },
      {
        q: "What if I'm in a meeting the whole hour?",
        a: "Do the seated micro-set under the table: ankle circles, toe spreads, and a subtle calf pump. All three are invisible and take 60 seconds. Your feet don't care that no one can see them working.",
      },
      {
        q: "Will this replace an actual walk?",
        a: "No. Micro-routines prevent stiffness accumulation; walks reset it. Aim for one 10-minute walk in the middle of the day on top of the desk work. Ideally outside; the change of surface (grass, gravel) is what makes the walk more valuable than the desk work.",
      },
    ],
    sources: [
      {
        label: "PubMed — Prolonged sitting and lower-limb vascular changes",
        url: "https://pubmed.ncbi.nlm.nih.gov/26461487/",
      },
    ],
  },
  "post-workout": {
    metaTitle: "Post-Workout Foot Recovery: An 8-Minute Routine for Men Over 40",
    metaDescription:
      "An 8-minute foot recovery routine after a run, lift, or long walk. Calf release, plantar fascia work, and toe extension to prevent the next-day flare that sidelines men over 40.",
    datePublished: "2026-09-18",
    howTo: {
      totalTime: "PT8M",
      tools: ["Foam roller", "Lacrosse or tennis ball"],
      steps: [
        { name: "Calf release", text: "Sit on the floor. Foam roller (or lacrosse ball for depth) under your calf. Cross the other leg on top for extra pressure. Roll slowly from Achilles to back of knee. 90 seconds per side. Pause on tender spots for 20-30 seconds." },
        { name: "Plantar fascia work", text: "Sit in a chair. Lacrosse or tennis ball under one foot's arch. Slowly roll from heel to ball of foot. 90 seconds per side. Slow rolls, not fast passes. Skip during a PF flare." },
        { name: "Toe extension work", text: "Sit with one foot in your lap. Grip the toes and gently pull upward as far as they comfortably go. Hold 30 seconds. 2 holds per side." },
      ],
    },
    faq: [
      {
        q: "Why is post-workout foot care more important after 40?",
        a: "Tissue turnover slows in the 40s. What used to bounce back overnight now needs 48 to 72 hours to recover, and skipping post-workout care lets small irritations accumulate into flares within 2 to 3 weeks. The 8 minutes is what shrinks the recovery window back to overnight.",
      },
      {
        q: "How soon after training should I do this?",
        a: "Within 30 minutes. The muscles and fascia are still warm from load, and release + stretch work is more effective on warm tissue than cold tissue. If you can only do it 2 hours later, warm up with a 5-minute walk first.",
      },
      {
        q: "Do I need any equipment?",
        a: "One tennis or lacrosse ball is enough. Nothing else required. A foam roller helps for the calf but the ball can substitute.",
      },
      {
        q: "What if I only have 3 minutes?",
        a: "Prioritize the calf release. Tight calves are the single most common upstream cause of plantar fasciitis, Achilles tendinopathy, and morning heel pain in men over 40 who train. Three minutes of calf work beats skipping the routine.",
      },
      {
        q: "Should I ice my feet after a run?",
        a: "Only for a specific sharp pain, and only for 5 to 10 minutes. Routine post-workout icing dampens the adaptation signal you want for the next training block. Save ice for actual injury flares.",
      },
    ],
    sources: [
      {
        label: "NIH StatPearls — Plantar Fasciitis",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
      },
      {
        label: "PubMed — Eccentric loading in Achilles tendinopathy (Alfredson 1998)",
        url: "https://pubmed.ncbi.nlm.nih.gov/9617396/",
      },
    ],
  },
  movement: {
    metaTitle: "The Plantar Stretch Sequence: A 3-Minute Morning Routine",
    metaDescription:
      "The three-move plantar and calf stretch protocol men over 40 can do in bed. Three minutes, done before your feet hit the floor. Four weeks to noticeable morning-pain reduction for most.",
    datePublished: "2026-09-10",
    howTo: {
      totalTime: "PT3M",
      tools: ["Towel, belt, or resistance band", "Wall or bed frame"],
      steps: [
        { name: "Towel calf stretch (in bed)", text: "Sit up in bed with legs extended. Loop a towel or band around the ball of one foot. Gently pull the toes back toward you until you feel a firm stretch in the calf and arch. Hold 30 seconds. Switch. Repeat once per side." },
        { name: "Plantar fascia stretch (bedside)", text: "Sit on the edge of the bed. Cross one ankle over the opposite knee, sole facing up. Pull the toes back with one hand. Press your thumb along the arch, walking from heel to ball. Hold 30 seconds per side." },
        { name: "Wall calf stretch (before first step)", text: "Face a wall or bed frame, hands on it. Step one foot back, heel down, back knee straight. Hold 20 seconds. Bend the back knee slightly, hold 20 more. Switch. Both variations, both sides." },
      ],
    },
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
    howTo: {
      totalTime: "PT6M",
      tools: ["Lacrosse ball (or tennis ball to start)"],
      steps: [
        { name: "Roll the length of the arch", text: "Stand or sit with the ball under one arch. Slowly roll from heel to ball of foot using controlled body weight. 90 seconds per side. Pressure at 5-6 out of 10; slow, not fast." },
        { name: "Hold on tender spots", text: "While rolling, find spots more tender than the rest. Stop, hold static pressure, breathe. Wait for discomfort to drop by half. 60 seconds per spot, 2 spots per side." },
        { name: "Cross-friction across the arch", text: "Sit. Ball under the midfoot. Roll side-to-side across the arch, medial to lateral. 60 seconds per side. Least tender, most missed." },
      ],
    },
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
    howTo: {
      totalTime: "PT20M",
      supplies: ["Urea-based foot cream (10-25% maintenance, 40% for cracks)", "Epsom salt (optional)", "Cotton socks"],
      tools: ["Basin or tub", "Pumice stone or fine-grit foot file", "Nail clipper", "Small nail file"],
      steps: [
        { name: "Warm foot soak (10 minutes)", text: "Fill a basin with water at 100-104°F (comfortably warm, not hot). Add Epsom salt if you like the ritual. Sit with feet submerged for a full 10 minutes." },
        { name: "Callus knock-down (3 minutes)", text: "While skin is soft, use a pumice stone or fine-grit foot file on the thickest callused areas. Light pressure, one direction, not back-and-forth grinding. Reduce, don't remove." },
        { name: "Nail check and trim (3 minutes)", text: "Dry feet completely. Inspect each nail. Trim straight across (not curved) if needed. File corners smooth to prevent ingrown edges." },
        { name: "Heel cream + socks overnight (2 minutes to apply)", text: "While skin is still slightly damp, apply urea-based cream. Focus on heels, sides, dry patches. Skip between the toes. Put on cotton socks. Sleep in them; occlusion multiplies cream effectiveness 3-5x." },
      ],
    },
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
    howTo: {
      totalTime: "PT5M",
      tools: ["Hand towel", "Chair (for balance progression)"],
      steps: [
        { name: "Short-foot activation", text: "Sit with feet flat. Without curling the toes, draw the ball of the foot toward the heel; the arch should rise slightly. Hold 5 seconds. Release. 10 reps per side, 2 rounds. Toes stay flat — no cheating by curling." },
        { name: "Towel scrunch", text: "Sit, feet flat, hand towel spread flat under one foot. Without lifting the heel, scrunch the towel toward you using only the toes. 10 reps per side, 2 rounds. Progress by adding a small weight (soup can) to the towel." },
        { name: "Single-leg balance", text: "Stand on one foot on a flat floor. Keep foot flat, standing knee soft. Hold 30 seconds. Once easy, close your eyes. 2 rounds per side. Progress to a folded pillow surface." },
      ],
    },
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
      acceptedAnswer: { "@type": "Answer", text: stripInlineLinks(f.a) },
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
      acceptedAnswer: { "@type": "Answer", text: stripInlineLinks(f.a) },
    })),
  };

  const breadcrumb = buildBreadcrumb([
    { name: "Routines", path: "/routines" },
    { name: seo.metaTitle, path: `/routines/${slug}` },
  ]);

  // HowTo — emit only when the routineSeo entry declares one. Cast to
  // Record<string, unknown> so the optional supply / tool fields don't
  // conflict with schema.org's HowTo shape when omitted.
  const howToArr = seo.howTo
    ? [{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: seo.metaTitle,
        description: seo.metaDescription,
        totalTime: seo.howTo.totalTime,
        ...(seo.howTo.supplies && seo.howTo.supplies.length > 0
          ? { supply: seo.howTo.supplies.map((s) => ({ "@type": "HowToSupply", name: s })) }
          : {}),
        ...(seo.howTo.tools && seo.howTo.tools.length > 0
          ? { tool: seo.howTo.tools.map((t) => ({ "@type": "HowToTool", name: t })) }
          : {}),
        step: seo.howTo.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
          url: `${url}#step-${i + 1}`,
        })),
      }]
    : [];

  return [article, faqPage, breadcrumb, ...howToArr];
}
