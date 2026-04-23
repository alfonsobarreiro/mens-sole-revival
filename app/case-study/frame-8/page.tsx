import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";

export const metadata: Metadata = {
  title: "Case Study — Frame 8: Evaluation Plan",
  robots: { index: false, follow: false },
};

// ── Success criteria ───────────────────────────────────────────────────────

const criteria = [
  {
    measure: "Organic search traffic",
    metric: "Monthly visits at 3, 6, 12 months",
    why: "Do men find this content when searching?",
  },
  {
    measure: "Email list growth",
    metric: "Signup rate from article pages",
    why: "A reader who signs up plans to come back.",
  },
  {
    measure: "Time on product reviews",
    metric: "Average time on page",
    why: "If they\u2019re spending time, the e-commerce layout works. If bouncing, the format hypothesis was wrong.",
  },
  {
    measure: "Brand partnership inquiries",
    metric: "Outreach to Vivobarefoot, Altra, Correct Toes",
    why: "Does the site read as a credible media property to brands?",
  },
  {
    measure: "Reddit engagement",
    metric: "Shares in r/BarefootRunning, r/PlantarFasciitis",
    why: "Organic community uptake is the early trust signal.",
  },
];

// ── Reflections ────────────────────────────────────────────────────────────

const reflections = [
  "The first build spent three weeks fighting a stack that wasn\u2019t right for the problem. The friction was the signal and I waited too long to act on it.",
  "The absence of user validation is the biggest open question. The e-commerce layout for reviews is the call I\u2019d make again, but it hasn\u2019t been tested with the actual audience.",
  "Content authority takes time. The honest uncertainty: whether the SEO ramp will produce the audience before the motivation to sustain the project runs out. That\u2019s not a design problem. It\u2019s the real risk of building something this slowly, alone.",
];

// ── Frame 8: Evaluation Plan + Reflection ─────────────────────────────────

export default function Frame8() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 1440,
        minHeight: 900,
        background: "#F8F7F7",
      }}
    >
      <div className="relative z-10 flex flex-col px-[88px] pt-[40px] pb-14 h-full min-h-[900px]">
        {/* ── Section label ── */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            08
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            Evaluation Plan
          </span>
        </div>

        {/* ── Frame headline ── */}
        <h1
          className="font-display uppercase leading-[1.08] tracking-tight mb-6"
          style={{
            color: "#091016",
            fontSize: 28,
            fontWeight: 800,
            maxWidth: 1000,
          }}
        >
          Reasoned, not tested.{" "}
          <span style={{ color: "#C4703A" }}>
            Here&rsquo;s how I&rsquo;ll find out if the reasoning holds.
          </span>
        </h1>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — Success Criteria Table
            ══════════════════════════════════════════════════════════ */}
        <div
          className="rounded-lg overflow-hidden mb-5"
          style={{
            background: "#FFFFFF",
            border: "1px solid #EEEDEC",
          }}
        >
          {/* Header */}
          <div
            className="grid px-5 py-2"
            style={{
              gridTemplateColumns: "200px 240px 1fr",
              background: "#F8F7F7",
              borderBottom: "1px solid #EEEDEC",
            }}
          >
            {["What to Measure", "Metric", "Why It Matters"].map((h) => (
              <span
                key={h}
                className="font-display uppercase tracking-[0.15em]"
                style={{
                  color: h === "Why It Matters" ? "#C4703A" : "#938C86",
                  fontSize: 8,
                  fontWeight: h === "Why It Matters" ? 700 : 500,
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {criteria.map((c, i) => (
            <div
              key={c.measure}
              className="grid px-5 py-[7px] items-start"
              style={{
                gridTemplateColumns: "200px 240px 1fr",
                background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF9",
                borderBottom:
                  i < criteria.length - 1 ? "1px solid #EEEDEC" : "none",
              }}
            >
              <span
                className="font-body font-medium"
                style={{ fontSize: 11, color: "#091016" }}
              >
                {c.measure}
              </span>
              <span
                className="font-body"
                style={{ fontSize: 10, color: "#6B6560" }}
              >
                {c.metric}
              </span>
              <span
                className="font-body"
                style={{ fontSize: 10, color: "#6B6560" }}
              >
                {c.why}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — What Wasn't Done
            ══════════════════════════════════════════════════════════ */}
        <div className="flex gap-5 mb-5">
          <div
            className="rounded-lg p-5 relative overflow-hidden"
            style={{
              flex: "1 1 0",
              background: "#FFFFFF",
              border: "1px solid #D6D3D1",
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute top-0 left-0 bottom-0 w-[3px]"
              style={{
                background:
                  "linear-gradient(180deg, #938C86 0%, rgba(147,140,134,0.2) 100%)",
              }}
            />

            <div className="pl-3">
              <span
                className="font-display uppercase tracking-[0.2em] block mb-2"
                style={{ color: "#938C86", fontSize: 9, fontWeight: 700 }}
              >
                What Wasn&rsquo;t Done
              </span>
              <p
                className="font-body leading-relaxed"
                style={{ color: "#6B6560", fontSize: 11 }}
              >
                I didn&rsquo;t conduct user interviews before building. I
                didn&rsquo;t run usability tests on the review page layout. The
                e-commerce UX pattern is based on competitive analysis and
                reasoning about mental models, not observed behavior with real
                users. Self-initiated, no research budget. The decisions are
                reasoned, not tested. The evaluation plan is how I&rsquo;ll find
                out if the reasoning holds.
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              SECTION 3 — Reflection
              ══════════════════════════════════════════════════════════ */}
          <div
            className="rounded-lg p-5 flex flex-col gap-3"
            style={{
              flex: "1 1 0",
              background:
                "linear-gradient(135deg, rgba(196,112,58,0.04) 0%, rgba(196,112,58,0.01) 100%)",
              border: "1px solid rgba(196,112,58,0.15)",
            }}
          >
            <span
              className="font-display uppercase tracking-[0.2em] block"
              style={{ color: "#C4703A", fontSize: 9, fontWeight: 700 }}
            >
              Reflection
            </span>
            {reflections.map((r, i) => (
              <p
                key={i}
                className="font-body leading-relaxed"
                style={{ color: "#6B6560", fontSize: 11 }}
              >
                {r}
              </p>
            ))}
          </div>
        </div>

        {/* ── Closing quote ── */}
        <div
          className="mt-5 rounded-lg px-8 py-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(196,112,58,0.08) 0%, rgba(196,112,58,0.02) 100%)",
            border: "1px solid rgba(196,112,58,0.25)",
          }}
        >
          <div
            className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl"
            style={{ background: "rgba(196,112,58,0.06)" }}
          />
          <p
            className="font-heading italic leading-relaxed relative z-10"
            style={{ color: "#C4703A", fontSize: 17 }}
          >
            &ldquo;Design thinking is not something you perform for a case
            study. It is something you reveal through it.&rdquo;
          </p>
        </div>
      </div>
      <CaseStudyNav current={8} />
    </div>
  );
}
