import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";

export const metadata: Metadata = {
  title: "Case Study — Frame 3: The Pivot",
  robots: { index: false, follow: false },
};

// ── Data ────────────────────────────────────────────────────────────────────

const comparisons = [
  {
    dimension: "Revenue",
    before: "Product sales",
    after: "Affiliate links + brand partnerships",
  },
  {
    dimension: "Page design",
    before: "Product listings",
    after: "Review pages using e-commerce UX patterns",
  },
  {
    dimension: "Content",
    before: "Catalog copy",
    after: "Pillar articles + product comparison reviews",
  },
  {
    dimension: "Growth",
    before: "Paid acquisition",
    after: "SEO, social, direct brand outreach",
  },
];

// ── Frame 3: The Pivot ─────────────────────────────────────────────────────

export default function Frame3() {
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
        <div className="flex items-center gap-3 mb-10">
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            03
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            The Pivot
          </span>
        </div>

        {/* ── Frame headline ── */}
        <h1
          className="font-display uppercase leading-[1.05] tracking-tight mb-14"
          style={{
            color: "#091016",
            fontSize: 44,
            fontWeight: 800,
            maxWidth: 720,
          }}
        >
          The numbers kept breaking.
          <br />
          <span style={{ color: "#C4703A" }}>That was the signal.</span>
        </h1>

        {/* ── Two-column layout ── */}
        <div className="flex gap-8 flex-1">
          {/* ── Left column: Hypothesis + The Moment ── */}
          <div className="flex-1 flex flex-col gap-8">
            {/* The Original Hypothesis */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EEEDEC",
              }}
            >
              <span
                className="font-display text-[10px] tracking-[0.25em] uppercase block mb-4"
                style={{ color: "#938C86" }}
              >
                The original plan
              </span>
              <p
                className="font-body leading-relaxed"
                style={{ color: "#6B6560", fontSize: 15 }}
              >
                Build a premium men&rsquo;s foot care e-commerce site. Curated
                product kits&nbsp;&mdash; antifungal treatment, toe separators,
                insoles, foot cream. Headless Shopify setup, Next.js frontend,
                dark editorial brand.
              </p>
            </div>

            {/* Cognac divider — the break point */}
            <div className="flex items-center gap-3 px-2">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(196,112,58,0.5) 0%, rgba(196,112,58,0.05) 100%)",
                }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M10 4 L10 16 M6 12 L10 16 L14 12"
                  stroke="#C4703A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(196,112,58,0.5) 0%, rgba(196,112,58,0.05) 100%)",
                }}
              />
            </div>

            {/* The Moment — emotional core */}
            <div
              className="rounded-xl p-8 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(196,112,58,0.06) 0%, rgba(196,112,58,0.01) 100%)",
                border: "1px solid rgba(196,112,58,0.25)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl"
                style={{ background: "rgba(196,112,58,0.06)" }}
              />

              <p
                className="font-heading italic leading-relaxed relative z-10"
                style={{ color: "#C4703A", fontSize: 20 }}
              >
                &ldquo;I was modeling margin math. The numbers kept breaking.
                Commodity products with thin margins, fulfillment costs, customer
                acquisition on a cold audience. I kept trying to make it work and
                it kept not working.&rdquo;
              </p>

              <p
                className="font-body leading-relaxed mt-5 relative z-10"
                style={{ color: "#6B6560", fontSize: 14 }}
              >
                The margin issue wasn&rsquo;t a business execution problem. It
                was a signal I was starting in the wrong place.
              </p>

              {/* Bottom accent bar — removed */}
              <div
                className="hidden"
                style={{
                  background: "none",
                }}
              />
            </div>
          </div>

          {/* ── Right column: What Changed ── */}
          <div className="flex-1 flex flex-col">
            <span
              className="font-display text-[10px] tracking-[0.25em] uppercase block mb-5"
              style={{ color: "#938C86" }}
            >
              What changed
            </span>

            <div
              className="rounded-xl overflow-hidden flex-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EEEDEC",
              }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-[140px_1fr_1fr] px-6 py-3"
                style={{
                  background: "#F8F7F7",
                  borderBottom: "1px solid #EEEDEC",
                }}
              >
                <span
                  className="font-display text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "#938C86" }}
                >
                  &nbsp;
                </span>
                <span
                  className="font-display text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "#B7B2AE" }}
                >
                  Before
                </span>
                <span
                  className="font-display text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "#C4703A" }}
                >
                  After
                </span>
              </div>

              {/* Table rows */}
              {comparisons.map((row, i) => (
                <div
                  key={row.dimension}
                  className="grid grid-cols-[140px_1fr_1fr] px-6 py-4 items-start"
                  style={{
                    background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF9",
                    borderBottom:
                      i < comparisons.length - 1
                        ? "1px solid #EEEDEC"
                        : "none",
                  }}
                >
                  <span
                    className="font-body font-medium"
                    style={{ color: "#6B6560", fontSize: 13 }}
                  >
                    {row.dimension}
                  </span>
                  <span
                    className="font-body"
                    style={{
                      color: "#B7B2AE",
                      fontSize: 13,
                      textDecoration: "line-through",
                      textDecorationColor: "#D6D3D1",
                    }}
                  >
                    {row.before}
                  </span>
                  <span
                    className="font-body font-medium"
                    style={{ color: "#091016", fontSize: 13 }}
                  >
                    {row.after}
                  </span>
                </div>
              ))}
            </div>

            {/* Insight callout */}
            <div
              className="mt-5 rounded-lg px-5 py-4 flex items-start gap-3"
              style={{
                background: "rgba(196,112,58,0.05)",
                border: "1px solid rgba(196,112,58,0.15)",
              }}
            >
              <span
                className="font-display block mt-0.5"
                style={{ color: "#C4703A", fontSize: 16 }}
              >
                &#x2192;
              </span>
              <p
                className="font-body leading-relaxed"
                style={{ color: "#6B6560", fontSize: 13 }}
              >
                The pivot wasn&rsquo;t away from e-commerce&nbsp;&mdash; it was
                toward{" "}
                <span style={{ color: "#C4703A", fontWeight: 600 }}>
                  content as the product
                </span>
                , using e-commerce UX patterns to frame editorial decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CaseStudyNav current={3} />
    </div>
  );
}
