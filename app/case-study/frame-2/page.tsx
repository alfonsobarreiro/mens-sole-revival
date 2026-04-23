import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";

export const metadata: Metadata = {
  title: "Case Study — Frame 2: Problem Definition",
  robots: { index: false, follow: false },
};

// ── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "63%", label: "of Americans report foot pain" },
  { value: "12%", label: "ever see a podiatrist" },
  { value: "3\u00D7", label: "higher fungal rate in men" },
  { value: "10%", label: "CAGR men\u2019s foot-care segment" },
];

const buckets = [
  {
    id: "clinical",
    label: "Clinical / Medical",
    color: "#1C3F5E",
    examples: ["WebMD", "Mayo Clinic", "Cleveland Clinic"],
    traits: ["Clinically grounded", "Gender-neutral", "No product guidance"],
  },
  {
    id: "wellness",
    label: "Gender-Neutral Wellness",
    color: "#6B6560",
    examples: ["Healthline", "Verywell Health", "Foot Health Facts"],
    traits: ["Broad audience", "SEO-optimized", "Not male-specific"],
  },
  {
    id: "product",
    label: "Product-First / Affiliate",
    color: "#A35E32",
    examples: ["Sneaker blogs", "GQ roundups", "Amazon listicles"],
    traits: ["Product-informed", "Male-targeted", "No clinical rigor"],
  },
];

const msrTraits = ["Male-specific", "Clinically grounded", "Product-informed"];

// ── Frame 2: Problem Definition ─────────────────────────────────────────────

export default function Frame2() {
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
            02
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            Problem Definition
          </span>
        </div>

        {/* ── Origin story ── */}
        <div className="max-w-[680px] mb-12">
          <p
            className="font-heading italic leading-relaxed"
            style={{ color: "#091016", fontSize: 20 }}
          >
            I kept Googling the same thing &mdash; &ldquo;cracked heels men
            fix&rdquo; &mdash; and landing on the same three articles written
            for women, repackaged with a stock photo of a guy.
          </p>
          <p
            className="font-body leading-relaxed mt-4"
            style={{ color: "#6B6560", fontSize: 15 }}
          >
            The clinical sources were accurate but impersonal. The product sites
            were selling, not teaching. Nothing spoke to men who actually wanted
            to understand what was happening to their feet &mdash; and what to do
            about it without a referral.
          </p>
        </div>

        {/* ── Stat chips ── */}
        <div className="flex gap-4 mb-14">
          {stats.map((s) => (
            <div
              key={s.value}
              className="flex-1 rounded-lg px-5 py-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EEEDEC",
              }}
            >
              <span
                className="font-display block leading-none"
                style={{ color: "#C4703A", fontSize: 32, fontWeight: 700 }}
              >
                {s.value}
              </span>
              <span
                className="font-body block mt-2 leading-snug"
                style={{ color: "#6B6560", fontSize: 13 }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Competitive gap diagram ── */}
        <div className="flex-1 flex flex-col">
          <h3
            className="font-display uppercase tracking-[0.15em] mb-6"
            style={{ color: "#938C86", fontSize: 11 }}
          >
            Competitive landscape &mdash; Where does the gap live?
          </h3>

          <div className="flex gap-5 flex-1 items-stretch">
            {/* Three competitor buckets */}
            {buckets.map((b) => (
              <div
                key={b.id}
                className="rounded-xl p-6 flex flex-col"
                style={{
                  flex: "1 1 0",
                  background: "#FFFFFF",
                  border: "1px solid #EEEDEC",
                  opacity: 0.75,
                }}
              >
                {/* Bucket header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: b.color }}
                  />
                  <span
                    className="font-body font-medium"
                    style={{ color: "#091016", fontSize: 14 }}
                  >
                    {b.label}
                  </span>
                </div>

                {/* Examples */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {b.examples.map((ex) => (
                    <span
                      key={ex}
                      className="font-body rounded-full px-2.5 py-0.5"
                      style={{
                        fontSize: 11,
                        color: "#6B6560",
                        background: "#F8F7F7",
                      }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                {/* Trait checklist */}
                <div className="mt-auto flex flex-col gap-2">
                  {msrTraits.map((trait) => {
                    const has = b.traits.includes(trait);
                    return (
                      <div key={trait} className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: 13,
                            color: has ? "#B7B2AE" : "#D6D3D1",
                          }}
                        >
                          {has ? "\u2713" : "\u2715"}
                        </span>
                        <span
                          className="font-body"
                          style={{
                            fontSize: 12,
                            color: has ? "#938C86" : "#D6D3D1",
                            textDecoration: has ? "none" : "line-through",
                          }}
                        >
                          {trait}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* MSR intersection card — THE PUNCHLINE */}
            <div
              className="rounded-xl p-7 flex flex-col relative overflow-hidden"
              style={{
                flex: "1.35 1 0",
                background:
                  "linear-gradient(135deg, #C4703A 0%, #A35E32 100%)",
                border: "2px solid #C4703A",
                boxShadow:
                  "0 8px 32px rgba(196,112,58,0.25), 0 2px 8px rgba(196,112,58,0.15)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />

              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 0 12px rgba(255,255,255,0.4)",
                  }}
                />
                <span
                  className="font-body font-semibold"
                  style={{ color: "#FFFFFF", fontSize: 15 }}
                >
                  Men&rsquo;s Sole Revival
                </span>
              </div>

              <p
                className="font-body leading-snug mb-5"
                style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}
              >
                The resource that should exist at the intersection of all three.
              </p>

              {/* All three traits — check */}
              <div className="mt-auto flex flex-col gap-2.5">
                {msrTraits.map((trait) => (
                  <div key={trait} className="flex items-center gap-2.5">
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 20,
                        height: 20,
                        background: "rgba(255,255,255,0.2)",
                        fontSize: 11,
                        color: "#FFFFFF",
                        fontWeight: 700,
                      }}
                    >
                      {"\u2713"}
                    </span>
                    <span
                      className="font-body font-semibold"
                      style={{ color: "#FFFFFF", fontSize: 13 }}
                    >
                      {trait}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-7 right-7 h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <CaseStudyNav current={2} />
    </div>
  );
}
