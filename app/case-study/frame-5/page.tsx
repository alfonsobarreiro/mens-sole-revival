import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";
export const metadata: Metadata = {
  title: "Case Study — Frame 5: Brand Exploration",
  robots: { index: false, follow: false },
};

// ── Direction cards ─────────────────────────────────────────────────────────

const directions = [
  {
    id: "wireframe",
    label: "Wireframe — Structure Test",
    status: "neutral" as const,
    image: "/images/cs-wireframe.png",
    annotation:
      "Does the content hierarchy communicate the site\u2019s purpose without visual design? Confirmed: topics section needs to sit above the article feed.",
  },
  {
    id: "clinical",
    label: "Clinical — Rejected",
    status: "rejected" as const,
    image: "/images/cs-clinical.png",
    annotation:
      "Medical authority is precisely the barrier these men are already dealing with. Clinical design confirms the user\u2019s fear: this requires professional help. That\u2019s what drives them away.",
  },
  {
    id: "salesy",
    label: "Salesy — Rejected",
    status: "rejected" as const,
    image: "/images/cs-salesy.png",
    annotation:
      "Hesitation in this audience comes from shame, not indecision. Pressure amplifies shame. Fear-based design destroys trust before it starts.",
  },
  {
    id: "editorial",
    label: "Dark Editorial — Chosen",
    status: "chosen" as const,
    image: "/images/cs-editorial.png",
    annotation:
      "The visual language of premium grooming brands and men\u2019s performance gear. Brands men already trust for personal care. The aesthetic says this topic is handled here with confidence, not apology.",
  },
];

// ── Frame 5: Brand Exploration ──────────────────────────────────────────────

export default function Frame5() {
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
        <div className="flex items-center gap-3 mb-8">
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            05
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            Brand Exploration
          </span>
        </div>

        {/* ── Frame headline ── */}
        <h1
          className="font-display uppercase leading-[1.08] tracking-tight mb-3"
          style={{
            color: "#091016",
            fontSize: 32,
            fontWeight: 800,
            maxWidth: 1100,
          }}
        >
          Clinical says &lsquo;this is a medical problem.&rsquo; Salesy says
          &lsquo;this is an emergency.&rsquo;{" "}
          <span style={{ color: "#C4703A" }}>
            Editorial says &lsquo;this is something men handle.&rsquo;
          </span>
        </h1>

        {/* ── Prototype question ── */}
        <p
          className="font-body leading-relaxed mb-8"
          style={{ color: "#938C86", fontSize: 13 }}
        >
          Does this aesthetic lower the stigma barrier before the first word is
          read?
        </p>

        {/* ── 4-column grid ── */}
        <div className="grid grid-cols-4 gap-5 flex-1">
          {directions.map((d) => {
            const isChosen = d.status === "chosen";
            const isRejected = d.status === "rejected";

            return (
              <div key={d.id} className="flex flex-col">
                {/* Status label */}
                <div className="flex items-center gap-2 mb-3">
                  {isRejected && (
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 18,
                        height: 18,
                        background: "#EEEDEC",
                        color: "#B7B2AE",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ✕
                    </div>
                  )}
                  {isChosen && (
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 18,
                        height: 18,
                        background: "#C4703A",
                        color: "#FFFFFF",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>
                  )}
                  {d.status === "neutral" && (
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 18,
                        height: 18,
                        background: "#EEEDEC",
                        color: "#938C86",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ○
                    </div>
                  )}
                  <span
                    className="font-body"
                    style={{
                      fontSize: 12,
                      fontWeight: isChosen ? 600 : 500,
                      color: isChosen
                        ? "#091016"
                        : isRejected
                          ? "#938C86"
                          : "#6B6560",
                    }}
                  >
                    {d.label}
                  </span>
                </div>

                {/* Actual screenshot card */}
                <div
                  className="rounded-lg overflow-hidden relative"
                  style={{
                    height: 370,
                    border: isChosen
                      ? "2px solid #C4703A"
                      : "1px solid #EEEDEC",
                    boxShadow: isChosen
                      ? "0 6px 24px rgba(196,112,58,0.18)"
                      : "none",
                    opacity: isRejected ? 0.55 : 1,
                  }}
                >
                  {/* Top accent for chosen — removed */}

                  {/* Screenshot — width fits card, height overflows and clips */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.image}
                    alt={d.label}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>

                {/* Annotation */}
                <p
                  className="font-body leading-snug mt-3"
                  style={{
                    color: isChosen ? "#6B6560" : "#938C86",
                    fontSize: 11,
                  }}
                >
                  {d.annotation}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Key insight ── */}
        <div
          className="mt-6 rounded-lg px-6 py-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(196,112,58,0.06) 0%, rgba(196,112,58,0.01) 100%)",
            border: "1px solid rgba(196,112,58,0.2)",
          }}
        >
          <p
            className="font-heading italic leading-relaxed"
            style={{ color: "#C4703A", fontSize: 17 }}
          >
            &ldquo;Dark editorial as stigma reduction through visual
            familiarity.&rdquo;
          </p>
        </div>
      </div>
      <CaseStudyNav current={5} />
    </div>
  );
}
