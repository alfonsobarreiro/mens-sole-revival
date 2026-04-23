import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";

export const metadata: Metadata = {
  title: "Case Study — Frame 4: E-Commerce UX Patterns",
  robots: { index: false, follow: false },
};

// ── Wireframe data ──────────────────────────────────────────────────────────

const blogWireframeLines = [
  { w: "60%", h: 8, mt: 0 },
  { w: "90%", h: 4, mt: 10 },
  { w: "100%", h: 4, mt: 4 },
  { w: "85%", h: 4, mt: 4 },
  { w: "95%", h: 4, mt: 4 },
  { w: "70%", h: 4, mt: 4 },
  { w: "90%", h: 4, mt: 12 },
  { w: "100%", h: 4, mt: 4 },
  { w: "80%", h: 4, mt: 4 },
  { w: "95%", h: 4, mt: 4 },
  { w: "88%", h: 4, mt: 4 },
  { w: "60%", h: 4, mt: 4 },
  { w: "92%", h: 4, mt: 12 },
  { w: "100%", h: 4, mt: 4 },
  { w: "75%", h: 4, mt: 4 },
  { w: "90%", h: 4, mt: 4 },
];

const ecomElements = [
  { label: "Hero image", h: 64 },
  { label: "Specs grid", h: 36 },
  { label: "Rating", h: 16 },
  { label: "Pros / Cons", h: 44 },
  { label: "Buy at →", h: 24 },
];

// ── Frame 4: E-Commerce UX Patterns ────────────────────────────────────────

export default function Frame4() {
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
            04
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            E-Commerce UX Patterns
          </span>
        </div>

        {/* ── Frame headline ── */}
        <h1
          className="font-display uppercase leading-[1.05] tracking-tight mb-8"
          style={{
            color: "#091016",
            fontSize: 40,
            fontWeight: 800,
            maxWidth: 820,
          }}
        >
          The user&rsquo;s task is evaluation, not reading.{" "}
          <span style={{ color: "#C4703A" }}>
            The layout should match the task.
          </span>
        </h1>

        {/* ── Side-by-side comparison ── */}
        <div className="flex gap-8 flex-1">
          {/* ── LEFT: Blog Layout (Rejected) ── */}
          <div className="flex-1 flex flex-col">
            {/* Label */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 22,
                  height: 22,
                  background: "#EEEDEC",
                  color: "#B7B2AE",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✕
              </div>
              <span
                className="font-body font-medium"
                style={{ color: "#938C86", fontSize: 14 }}
              >
                Blog Format &mdash; Rejected
              </span>
            </div>

            {/* Wireframe card */}
            <div
              className="rounded-xl p-6 flex-1 relative"
              style={{
                background: "#FFFFFF",
                border: "1px solid #EEEDEC",
                opacity: 0.7,
              }}
            >
              {/* Diagonal strike overlay */}
              <div
                className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                style={{ zIndex: 2 }}
              >
                <svg
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="100"
                    y2="100"
                    stroke="#D6D3D1"
                    strokeWidth="0.15"
                  />
                </svg>
              </div>

              {/* Simulated blog wireframe */}
              <div className="relative z-1">
                {/* Title placeholder */}
                <div
                  className="rounded"
                  style={{
                    width: "55%",
                    height: 10,
                    background: "#D6D3D1",
                  }}
                />
                <div
                  className="rounded mt-2"
                  style={{
                    width: "35%",
                    height: 6,
                    background: "#EEEDEC",
                  }}
                />

                {/* Image placeholder */}
                <div
                  className="rounded mt-4 flex items-center justify-center"
                  style={{
                    width: "100%",
                    height: 56,
                    background: "#F8F7F7",
                    border: "1px dashed #D6D3D1",
                  }}
                >
                  <span
                    className="font-body"
                    style={{ color: "#D6D3D1", fontSize: 9 }}
                  >
                    Featured image
                  </span>
                </div>

                {/* Paragraph lines */}
                {blogWireframeLines.map((line, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      width: line.w,
                      height: line.h,
                      marginTop: line.mt,
                      background: "#EEEDEC",
                    }}
                  />
                ))}

                {/* Comparison table buried at bottom */}
                <div
                  className="rounded mt-4 flex items-center justify-center"
                  style={{
                    width: "100%",
                    height: 32,
                    background: "#F8F7F7",
                    border: "1px dashed #D6D3D1",
                  }}
                >
                  <span
                    className="font-body"
                    style={{ color: "#D6D3D1", fontSize: 8 }}
                  >
                    Comparison table (buried)
                  </span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p
              className="font-body leading-relaxed mt-4"
              style={{ color: "#938C86", fontSize: 12 }}
            >
              The user has to read to evaluate. Signal is buried in narrative.
              Extra cognitive work when they&rsquo;re already in decision mode.
            </p>
          </div>

          {/* ── RIGHT: E-Commerce Layout (Chosen) ── */}
          <div className="flex-1 flex flex-col">
            {/* Label */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 22,
                  height: 22,
                  background: "#C4703A",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <span
                className="font-body font-semibold"
                style={{ color: "#091016", fontSize: 14 }}
              >
                E-Commerce Pattern &mdash; Chosen
              </span>
            </div>

            {/* Wireframe card */}
            <div
              className="rounded-xl p-6 flex-1 relative overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "2px solid #C4703A",
                boxShadow: "0 4px 20px rgba(196,112,58,0.1)",
              }}
            >
              {/* Cognac top accent — removed */}

              {/* E-commerce wireframe */}
              <div className="flex flex-col gap-3">
                {ecomElements.map((el) => (
                  <div key={el.label}>
                    <span
                      className="font-display block mb-1.5 uppercase tracking-[0.15em]"
                      style={{ color: "#938C86", fontSize: 8 }}
                    >
                      {el.label}
                    </span>
                    <div
                      className="rounded flex items-center justify-center"
                      style={{
                        width: "100%",
                        height: el.h,
                        background:
                          el.label === "Buy at →"
                            ? "linear-gradient(135deg, rgba(196,112,58,0.12) 0%, rgba(196,112,58,0.04) 100%)"
                            : "#F8F7F7",
                        border:
                          el.label === "Buy at →"
                            ? "1px solid rgba(196,112,58,0.25)"
                            : "1px solid #EEEDEC",
                      }}
                    >
                      {el.label === "Hero image" && (
                        <span
                          className="font-body"
                          style={{ color: "#B7B2AE", fontSize: 9 }}
                        >
                          Product hero — full width
                        </span>
                      )}
                      {el.label === "Specs grid" && (
                        <div className="grid grid-cols-3 gap-2 w-full px-3">
                          {["Weight", "Drop", "Price"].map((spec) => (
                            <div key={spec} className="text-center">
                              <span
                                className="font-body block"
                                style={{ color: "#B7B2AE", fontSize: 7 }}
                              >
                                {spec}
                              </span>
                              <div
                                className="rounded mx-auto mt-1"
                                style={{
                                  width: "60%",
                                  height: 4,
                                  background: "#D6D3D1",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {el.label === "Rating" && (
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4].map((s) => (
                            <span
                              key={s}
                              style={{ color: "#C4703A", fontSize: 10 }}
                            >
                              ★
                            </span>
                          ))}
                          <span style={{ color: "#D6D3D1", fontSize: 10 }}>
                            ★
                          </span>
                          <span
                            className="font-body ml-1"
                            style={{ color: "#938C86", fontSize: 9 }}
                          >
                            4.2 / 5
                          </span>
                        </div>
                      )}
                      {el.label === "Pros / Cons" && (
                        <div className="grid grid-cols-2 gap-4 w-full px-3">
                          <div>
                            <span
                              className="font-body block mb-1"
                              style={{ color: "#6B6560", fontSize: 8 }}
                            >
                              Pros
                            </span>
                            {[1, 2, 3].map((n) => (
                              <div
                                key={n}
                                className="flex items-center gap-1.5 mb-1"
                              >
                                <span
                                  style={{ color: "#C4703A", fontSize: 7 }}
                                >
                                  +
                                </span>
                                <div
                                  className="rounded-sm"
                                  style={{
                                    width: `${70 + n * 5}%`,
                                    height: 3,
                                    background: "#D6D3D1",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <span
                              className="font-body block mb-1"
                              style={{ color: "#6B6560", fontSize: 8 }}
                            >
                              Cons
                            </span>
                            {[1, 2].map((n) => (
                              <div
                                key={n}
                                className="flex items-center gap-1.5 mb-1"
                              >
                                <span
                                  style={{ color: "#938C86", fontSize: 7 }}
                                >
                                  −
                                </span>
                                <div
                                  className="rounded-sm"
                                  style={{
                                    width: `${60 + n * 10}%`,
                                    height: 3,
                                    background: "#EEEDEC",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {el.label === "Buy at →" && (
                        <span
                          className="font-body font-semibold"
                          style={{ color: "#C4703A", fontSize: 10 }}
                        >
                          Buy at Amazon →&ensp;&ensp;Buy at REI →
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption */}
            <p
              className="font-body leading-relaxed mt-4"
              style={{ color: "#6B6560", fontSize: 12 }}
            >
              The layout does the orienting work. Users already know how to scan
              this pattern from every product page they&rsquo;ve used.
            </p>
          </div>
        </div>

        {/* ── Key insight ── */}
        <div
          className="mt-5 rounded-xl px-7 py-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(196,112,58,0.06) 0%, rgba(196,112,58,0.01) 100%)",
            border: "1px solid rgba(196,112,58,0.2)",
          }}
        >
          <div
            className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl"
            style={{ background: "rgba(196,112,58,0.05)" }}
          />

          <p
            className="font-heading italic leading-relaxed relative z-10"
            style={{ color: "#C4703A", fontSize: 18 }}
          >
            &ldquo;Long-form editorial is right when the user is learning. An
            e-commerce layout is right when the user is deciding. MSR&rsquo;s
            review pages are for deciding.&rdquo;
          </p>

          <p
            className="font-body leading-relaxed mt-4 relative z-10"
            style={{ color: "#938C86", fontSize: 12 }}
          >
            This isn&rsquo;t a store. There&rsquo;s no checkout, no inventory.
            The UX pattern is borrowed from e-commerce because it matches the
            user&rsquo;s task, not because it serves a transaction.
          </p>
        </div>
      </div>
      <CaseStudyNav current={4} />
    </div>
  );
}
