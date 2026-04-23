import type { Metadata } from "next";
import CaseStudyNav from "@/components/CaseStudyNav";

export const metadata: Metadata = {
  title: "Case Study — Frame 7: Site Architecture",
  robots: { index: false, follow: false },
};

// ── Route data ─────────────────────────────────────────────────────────────

const routes = [
  {
    route: "/",
    type: "Homepage",
    task: "Orient",
    desc: "Understand what this site is and whether it\u2019s for me.",
    group: "core",
  },
  {
    route: "/blog/[slug]",
    type: "Article",
    task: "Learn",
    desc: "Go deeper on a foot health topic.",
    group: "content",
    count: 6,
  },
  {
    route: "/reviews/[slug]",
    type: "Product Review",
    task: "Evaluate",
    desc: "Compare and decide on a product.",
    group: "content",
    count: 6,
  },
  {
    route: "/kits",
    type: "Curated Kits",
    task: "Browse",
    desc: "See grouped product recommendations.",
    group: "content",
  },
  {
    route: "/learn",
    type: "Educational Hub",
    task: "Explore",
    desc: "Find the right starting point.",
    group: "utility",
  },
  {
    route: "/about",
    type: "Brand Story",
    task: "Trust",
    desc: "Understand who built this and why.",
    group: "utility",
  },
  {
    route: "/assessment",
    type: "Self-Check Tool",
    task: "Act",
    desc: "Get a personalized starting point.",
    group: "utility",
  },
];

// ── Screenshot data ────────────────────────────────────────────────────────

const screens = [
  {
    image: "/images/cs-arch-home.png",
    label: "Orient + Browse",
    caption: "The homepage answers one question: is this site for me?",
  },
  {
    image: "/images/cs-arch-article.png",
    label: "Learn",
    caption:
      "Long-form articles build authority. The layout is for reading, not scanning.",
  },
  {
    image: "/images/cs-arch-review.png",
    label: "Evaluate + Decide",
    caption:
      "Product reviews use e-commerce UX patterns. The layout matches the task.",
  },
];

// ── Frame 7: Site Architecture ────────────────────────────────────────────

export default function Frame7() {
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
            07
          </span>
          <div className="w-8 h-px" style={{ background: "#C4703A" }} />
          <span
            className="font-display text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4703A" }}
          >
            Site Architecture
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
          Seven page types, each designed for{" "}
          <span style={{ color: "#C4703A" }}>a different user task.</span>
        </h1>

        {/* ══════════════════════════════════════════════════════════
            TOP — Route Table
            ══════════════════════════════════════════════════════════ */}
        <div
          className="rounded-lg overflow-hidden mb-5"
          style={{
            background: "#FFFFFF",
            border: "1px solid #EEEDEC",
          }}
        >
          {/* Table header */}
          <div
            className="grid px-5 py-2"
            style={{
              gridTemplateColumns: "160px 130px 80px 1fr",
              background: "#F8F7F7",
              borderBottom: "1px solid #EEEDEC",
            }}
          >
            {["Route", "Type", "User Task", "Purpose"].map((h) => (
              <span
                key={h}
                className="font-display uppercase tracking-[0.15em]"
                style={{
                  color: h === "User Task" ? "#C4703A" : "#938C86",
                  fontSize: 8,
                  fontWeight: h === "User Task" ? 700 : 500,
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Table rows */}
          {routes.map((r, i) => (
            <div
              key={r.route}
              className="grid px-5 py-[7px] items-center"
              style={{
                gridTemplateColumns: "160px 130px 80px 1fr",
                background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF9",
                borderBottom:
                  i < routes.length - 1 ? "1px solid #EEEDEC" : "none",
              }}
            >
              {/* Route */}
              <code
                className="font-body"
                style={{ fontSize: 10, color: "#6B6560" }}
              >
                {r.route}
                {r.count && (
                  <span style={{ color: "#B7B2AE" }}>
                    {" "}
                    ({r.count} published)
                  </span>
                )}
              </code>

              {/* Type */}
              <span
                className="font-body font-medium"
                style={{ fontSize: 11, color: "#091016" }}
              >
                {r.type}
              </span>

              {/* User Task */}
              <span
                className="font-body font-semibold"
                style={{ fontSize: 11, color: "#C4703A" }}
              >
                {r.task}
              </span>

              {/* Purpose */}
              <span
                className="font-body"
                style={{ fontSize: 10, color: "#6B6560" }}
              >
                {r.desc}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM — Annotated Screen Grid
            ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-4">
          {screens.map((s) => (
            <div key={s.label} className="flex flex-col">
              {/* Label */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: "#C4703A",
                  }}
                />
                <span
                  className="font-body font-semibold"
                  style={{ fontSize: 11, color: "#091016" }}
                >
                  {s.label}
                </span>
              </div>

              {/* Screenshot card */}
              <div
                className="rounded-lg overflow-hidden relative"
                style={{
                  height: 200,
                  border: "1px solid #EEEDEC",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.label}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>

              {/* Caption */}
              <p
                className="font-body leading-snug mt-2"
                style={{ color: "#6B6560", fontSize: 10 }}
              >
                {s.caption}
              </p>
            </div>
          ))}
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
            &ldquo;Every page type maps to a user intent. The IA is the product
            strategy made navigable.&rdquo;
          </p>
        </div>
      </div>
      <CaseStudyNav current={7} />
    </div>
  );
}
