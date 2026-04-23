import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";

export const metadata: Metadata = {
  title: "Case Study — Frame 6: Typography + Token Architecture",
  robots: { index: false, follow: false },
};

// ── Typeface data ──────────────────────────────────────────────────────────

const typefaces = [
  {
    family: "Barlow Condensed",
    specimen: "Aa",
    cssClass: "font-display",
    weight: 700,
    role: "Display",
    usage: "Headlines, brand statements. Authority and presence.",
    weights: "700 – 800",
  },
  {
    family: "Lora",
    specimen: "Aa",
    cssClass: "font-heading",
    weight: 400,
    italic: true,
    role: "Editorial",
    usage: "Subheads, article titles, key quotes. Readable, approachable.",
    weights: "400 – 700",
  },
  {
    family: "DM Sans",
    specimen: "Aa",
    cssClass: "font-body",
    weight: 400,
    role: "Interface",
    usage: "Body copy, UI elements, metadata. Legibility at scale.",
    weights: "400 – 600",
  },
];

// ── Token tiers ────────────────────────────────────────────────────────────

const tiers = [
  {
    label: "CSS Custom Properties",
    desc: "Source of truth. Defined in globals.css under @theme.",
    example: "--color-brand-500",
  },
  {
    label: "TypeScript Semantic Aliases",
    desc: "Semantic mapping. Brand-aware naming in TypeScript.",
    example: "tokens.color.primary",
  },
  {
    label: "Tailwind Utilities",
    desc: "Consumed in components. Utility-first, zero hardcoded values.",
    example: "bg-brand-500",
  },
];

// ── AB Core Library token rows ─────────────────────────────────────────────

const tokenRows = [
  {
    token: "brand-500",
    brand: "#1C3F5E",
    wayfarer: "#2D5A3D",
    msr: "#1C3F5E",
  },
  {
    token: "brand-900",
    brand: "#091016",
    wayfarer: "#0A1A10",
    msr: "#091016",
  },
  {
    token: "accent-500",
    brand: "#C4703A",
    wayfarer: "#B8860B",
    msr: "#C4703A",
  },
  {
    token: "neutral-50",
    brand: "#F8F7F7",
    wayfarer: "#F7F8F5",
    msr: "#F8F7F7",
  },
  {
    token: "neutral-500",
    brand: "#6B6560",
    wayfarer: "#5E6B5A",
    msr: "#6B6560",
  },
];

// ── Frame 6: Typography + Token Architecture ──────────────────────────────

export default function Frame6() {
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
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            06
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            Typography + Token Architecture
          </span>
        </div>

        {/* ── Frame headline ── */}
        <h1
          className="font-display uppercase leading-[1.08] tracking-tight mb-6"
          style={{
            color: "#091016",
            fontSize: 30,
            fontWeight: 800,
            maxWidth: 900,
          }}
        >
          Three typefaces, each with a job.{" "}
          <span style={{ color: "#C4703A" }}>
            One token system, zero drift.
          </span>
        </h1>

        {/* ══════════════════════════════════════════════════════════
            TOP HALF — Typography System
            ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-5 mb-4">
          {typefaces.map((tf) => (
            <div
              key={tf.family}
              className="rounded-lg p-5 relative overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EEEDEC",
              }}
            >
              {/* Specimen */}
              <div
                className={tf.cssClass}
                style={{
                  fontSize: 56,
                  fontWeight: tf.weight,
                  fontStyle: tf.italic ? "italic" : "normal",
                  color: "#091016",
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {tf.specimen}
              </div>

              {/* Family name + role badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-body font-semibold"
                  style={{ color: "#091016", fontSize: 13 }}
                >
                  {tf.family}
                </span>
                <span
                  className="font-body rounded-full px-2 py-0.5"
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: "#C4703A",
                    background: "rgba(196,112,58,0.08)",
                    border: "1px solid rgba(196,112,58,0.2)",
                  }}
                >
                  {tf.role}
                </span>
              </div>

              {/* Usage */}
              <p
                className="font-body leading-snug"
                style={{ color: "#6B6560", fontSize: 11 }}
              >
                {tf.usage}
              </p>

              {/* Weights */}
              <p
                className="font-body mt-1.5"
                style={{ color: "#938C86", fontSize: 10 }}
              >
                Weights: {tf.weights}
              </p>
            </div>
          ))}
        </div>

        {/* Typography insight */}
        <p
          className="font-heading italic leading-relaxed mb-5"
          style={{ color: "#C4703A", fontSize: 13 }}
        >
          &ldquo;The roles are explicit, not decorative. Each typeface was
          chosen for what it does in context — not how it looks next to the
          others.&rdquo;
        </p>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM HALF — Token Architecture
            ══════════════════════════════════════════════════════════ */}
        <div className="flex gap-5">
          {/* ── Left: 3-Tier Token System ── */}
          <div className="flex flex-col" style={{ flex: "1 1 0" }}>
            <h2
              className="font-display uppercase tracking-tight mb-3"
              style={{
                color: "#091016",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              3-Tier Token System
            </h2>

            {/* Horizontal flow diagram */}
            <div className="flex items-center gap-0">
              {tiers.map((tier, i) => (
                <div key={tier.label} className="flex items-center flex-1 min-w-0">
                  {/* Tier card */}
                  <div
                    className="rounded-lg p-3 flex flex-col w-full"
                    style={{
                      background: i === 0
                        ? "linear-gradient(135deg, rgba(196,112,58,0.08) 0%, rgba(196,112,58,0.02) 100%)"
                        : "#FFFFFF",
                      border: i === 0
                        ? "1px solid rgba(196,112,58,0.25)"
                        : "1px solid #EEEDEC",
                    }}
                  >
                    {/* Tier number */}
                    <span
                      className="font-display"
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: i === 0 ? "#C4703A" : "#B7B2AE",
                        letterSpacing: "0.15em",
                      }}
                    >
                      TIER {i + 1}
                    </span>

                    {/* Label */}
                    <span
                      className="font-body font-semibold mt-1"
                      style={{ color: "#091016", fontSize: 10, lineHeight: 1.3 }}
                    >
                      {tier.label}
                    </span>

                    {/* Description */}
                    <p
                      className="font-body mt-1"
                      style={{ color: "#6B6560", fontSize: 9, lineHeight: 1.4 }}
                    >
                      {tier.desc}
                    </p>

                    {/* Code example */}
                    <div
                      className="rounded px-2 py-0.5 mt-2"
                      style={{
                        background: "#F8F7F7",
                        border: "1px solid #EEEDEC",
                      }}
                    >
                      <code
                        className="font-body"
                        style={{ fontSize: 8, color: "#C4703A" }}
                      >
                        {tier.example}
                      </code>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {i < tiers.length - 1 && (
                    <div className="flex-shrink-0 px-1" style={{ color: "#C4703A" }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8H13M10 5L13 8L10 11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: AB Core Library Evidence ── */}
          <div className="flex flex-col" style={{ flex: "1.1 1 0" }}>
            <h2
              className="font-display uppercase tracking-tight mb-3"
              style={{
                color: "#091016",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              AB Core Library Variables
            </h2>

            {/* Token table */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EEEDEC",
              }}
            >
              {/* Table header */}
              <div
                className="grid px-4 py-1.5"
                style={{
                  gridTemplateColumns: "100px 1fr 1fr 1fr",
                  background: "#F8F7F7",
                  borderBottom: "1px solid #EEEDEC",
                }}
              >
                <span
                  className="font-display uppercase tracking-[0.15em]"
                  style={{ color: "#938C86", fontSize: 8 }}
                >
                  Token
                </span>
                <span
                  className="font-display uppercase tracking-[0.15em]"
                  style={{ color: "#938C86", fontSize: 8 }}
                >
                  Brand
                </span>
                <span
                  className="font-display uppercase tracking-[0.15em]"
                  style={{ color: "#938C86", fontSize: 8 }}
                >
                  Wayfarer
                </span>
                <span
                  className="font-display uppercase tracking-[0.15em] font-bold"
                  style={{ color: "#C4703A", fontSize: 8 }}
                >
                  Men&rsquo;s Sole Revival
                </span>
              </div>

              {/* Table rows */}
              {tokenRows.map((row, i) => (
                <div
                  key={row.token}
                  className="grid px-4 py-1 items-center"
                  style={{
                    gridTemplateColumns: "100px 1fr 1fr 1fr",
                    background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF9",
                    borderBottom:
                      i < tokenRows.length - 1
                        ? "1px solid #EEEDEC"
                        : "none",
                  }}
                >
                  <code
                    className="font-body"
                    style={{ fontSize: 9, color: "#6B6560" }}
                  >
                    {row.token}
                  </code>
                  <TokenCell hex={row.brand} />
                  <TokenCell hex={row.wayfarer} />
                  <TokenCell hex={row.msr} highlight />
                </div>
              ))}
            </div>

            {/* Caption */}
            <p
              className="font-body leading-snug mt-2"
              style={{ color: "#938C86", fontSize: 9 }}
            >
              Same naming convention, different values per project. The AB Core
              Library holds primitives for Brand, Wayfarer, and Men&rsquo;s Sole
              Revival. This wasn&rsquo;t retrofitted — it was a decision made
              before the first component was built.
            </p>
          </div>
        </div>

        {/* ── Closing insight ── */}
        <div
          className="mt-4 rounded-lg px-6 py-3 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(196,112,58,0.06) 0%, rgba(196,112,58,0.01) 100%)",
            border: "1px solid rgba(196,112,58,0.2)",
          }}
        >
          <p
            className="font-heading italic leading-relaxed"
            style={{ color: "#C4703A", fontSize: 15 }}
          >
            &ldquo;Token parity between Figma and code. One file change
            propagates everywhere.&rdquo;
          </p>
        </div>
      </div>
      <CaseStudyNav current={6} />
    </div>
  );
}

// ── Token cell helper ─────────────────────────────────────────────────────

function TokenCell({ hex, highlight }: { hex: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-sm flex-shrink-0"
        style={{
          width: 14,
          height: 14,
          background: hex,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      />
      <code
        className="font-body"
        style={{
          fontSize: 9,
          color: highlight ? "#091016" : "#938C86",
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {hex}
      </code>
    </div>
  );
}
