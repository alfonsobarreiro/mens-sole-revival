"use client";

/**
 * /homepage-wireframe — Lo-Fi Wireframe (v3 — Current Production Homepage)
 *
 * Case study artifact for Men's Sole Revival.
 * Shows the layout skeleton for the current production homepage —
 * all 7 sections — before any visual design decisions were applied.
 * Used in the case study to show information architecture and content
 * hierarchy independently from the visual direction.
 *
 * Rules:
 * - Grayscale only
 * - No real images — SVG placeholder boxes
 * - No brand fonts — system-ui only
 * - All interactive elements labeled, not styled
 * - Blue annotations mark each section and layout decision
 *
 * noindex: set in layout.tsx
 */

import { useState } from "react";

// ── Wireframe palette ──────────────────────────────────────────────────────
const w = {
  bg:         "#FFFFFF",
  canvas:     "#F4F4F4",
  border:     "#CCCCCC",
  borderMed:  "#AAAAAA",
  borderDark: "#666666",
  fill:       "#E8E8E8",
  fillMed:    "#D0D0D0",
  fillDark:   "#B0B0B0",
  fillBlack:  "#333333",
  text:       "#333333",
  textMid:    "#666666",
  textLight:  "#999999",
  annotation: "#0070F3",
};

const font = "system-ui, -apple-system, sans-serif";

// ── Primitives ─────────────────────────────────────────────────────────────

function ImgBox({
  width = "100%",
  height = 200,
  label = "IMAGE",
  style = {},
}: {
  width?: string | number;
  height?: number;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width, height,
      background: w.fill,
      border: `1.5px solid ${w.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", flexShrink: 0,
      ...style,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={w.border} strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={w.border} strokeWidth="1.5" />
      </svg>
      <span style={{
        fontFamily: font, fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", color: w.textLight, background: w.fill,
        padding: "3px 8px", position: "relative", zIndex: 1,
      }}>
        {label}
      </span>
    </div>
  );
}

function WBtn({
  label,
  primary = false,
  style = {},
}: {
  label: string;
  primary?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: "inline-block",
      background: primary ? w.fillDark : w.bg,
      border: `1.5px solid ${w.borderDark}`,
      padding: "10px 24px",
      fontFamily: font, fontSize: 13,
      fontWeight: primary ? 700 : 400,
      color: primary ? "white" : w.text,
      cursor: "default", userSelect: "none",
      ...style,
    }}>
      {label}
    </div>
  );
}

function Ann({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 22, height: 22, borderRadius: "50%",
        background: w.annotation, color: "white",
        fontFamily: font, fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>
        {n}
      </span>
      <span style={{
        fontFamily: font, fontSize: 11, fontWeight: 700,
        letterSpacing: ".1em", textTransform: "uppercase", color: w.annotation,
      }}>
        {label}
      </span>
    </div>
  );
}

function AnnNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 16, background: "#EEF4FF",
      border: `1px dashed ${w.annotation}`,
      borderRadius: 4, padding: "10px 14px",
    }}>
      <p style={{ fontFamily: font, fontSize: 12, color: w.annotation, margin: 0, lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

function TextLines({ lines = 3, widths }: { lines?: number; widths?: string[] }) {
  const defaults = ["100%", "90%", "75%", "60%", "80%"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: 10, borderRadius: 2, background: w.fillMed,
          width: widths ? widths[i] : defaults[i % defaults.length],
        }} />
      ))}
    </div>
  );
}

function Section({
  ann,
  annN,
  children,
  style = {},
  bg = w.bg,
}: {
  ann: string;
  annN: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  bg?: string;
}) {
  return (
    <section style={{ background: bg, borderBottom: `1px solid ${w.border}`, ...style }}>
      <div style={{
        borderBottom: `1px dashed ${w.border}`,
        padding: "8px 40px", background: "#F9F9F9",
      }}>
        <Ann n={annN} label={ann} />
      </div>
      <div style={{ padding: "40px 40px" }}>
        {children}
      </div>
    </section>
  );
}

const topicLabels = [
  "Pain",
  "Nails",
  "Alignment",
  "Routine",
  "Fit",
  "Skin",
];

const routineLabels = [
  { label: "Daily", title: "The nightly 5 minutes." },
  { label: "Stretch", title: "Plantar stretch sequence." },
  { label: "Recovery", title: "Lacrosse ball work." },
];

const articleLabels = [
  "Your Big Toe Controls More of Your Body Than You Think",
  "Cracked Heels: The Fix That Isn't a Pumice Stone",
  "Toenail Fungus: What Actually Works (and What's a Scam)",
  "Why Toe Alignment Affects Your Knees and Hips",
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function HomepageWireframe() {
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);

  return (
    <div style={{ fontFamily: font, background: w.canvas, color: w.text, minHeight: "100vh" }}>

      {/* ── Label banner ── */}
      <div style={{
        background: w.fillBlack, color: "white", fontFamily: font,
        fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
        textTransform: "uppercase", textAlign: "center", padding: "10px 16px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        Lo-Fi Wireframe — Current Production Homepage · 7 Sections · Pre-Visual Design
      </div>

      {/* ── Nav ── */}
      <nav style={{
        background: w.fill, border: `1px solid ${w.border}`,
        padding: "0 40px", height: 60, position: "sticky", top: 36, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ background: w.fillMed, width: 160, height: 20, borderRadius: 2 }} />
        <div style={{ display: "flex", gap: 32 }}>
          {["Learn", "Reviews", "Routines", "About", "Assessment"].map((l, i) => (
            <div key={i} style={{ background: w.fillMed, width: 60, height: 12, borderRadius: 2 }} />
          ))}
        </div>
        <WBtn label="Take the Assessment" primary />
      </nav>

      {/* ── 1. Hero — Full-bleed with L→R gradient, marquee at base ── */}
      <Section annN={1} ann="Hero — Full-bleed dark bg · L→R gradient overlay · Marquee ticker at base" bg={w.fill} style={{ padding: 0 }}>
        {/* Full-bleed image zone with gradient overlay */}
        <div style={{ position: "relative", minHeight: 560, background: w.fillDark }}>
          <ImgBox
            width="100%" height={560}
            label="Full-Bleed Hero Image — opacity 55%"
            style={{ position: "absolute", inset: 0, border: "none", borderRadius: 0 }}
          />

          {/* Gradient overlay: L→R from near-opaque to transparent */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(to right, rgba(80,80,80,.95) 0%, rgba(80,80,80,.65) 50%, rgba(80,80,80,.2) 100%)",
          }} />

          {/* Content layer */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", padding: "0 60px" }}>
            <div style={{ maxWidth: 640 }}>
              {/* Overline: "For men over 40..." */}
              <div style={{ background: w.fillMed, width: 280, height: 11, borderRadius: 2, marginBottom: 24 }} />

              {/* H1 — 3 lines, display scale */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                <div style={{ background: "white", opacity: 0.85, height: 52, width: "50%", borderRadius: 2 }} />
                <div style={{ background: "white", opacity: 0.85, height: 52, width: "60%", borderRadius: 2 }} />
                <div style={{ background: "white", opacity: 0.85, height: 52, width: "55%", borderRadius: 2 }} />
              </div>

              {/* Body copy — max-w-xl */}
              <div style={{ marginBottom: 32, maxWidth: 480 }}>
                <TextLines lines={4} widths={["90%", "95%", "88%", "70%"]} />
              </div>

              {/* CTA pair */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <WBtn label="Take the Assessment" primary />
                <WBtn label="Browse Guides" style={{ border: "1.5px solid rgba(255,255,255,.5)", color: "white", background: "transparent" }} />
              </div>

              {/* Sub-text: "5-minute self-check..." */}
              <div style={{ background: w.fillMed, width: 200, height: 9, borderRadius: 2, opacity: 0.6 }} />
            </div>
          </div>

          {/* Annotation overlay */}
          <div style={{
            position: "absolute", bottom: 56, right: 40, zIndex: 4,
            maxWidth: 300, background: "#EEF4FF", border: `1px dashed ${w.annotation}`,
            borderRadius: 4, padding: "10px 14px",
          }}>
            <p style={{ fontFamily: font, fontSize: 12, color: w.annotation, margin: 0, lineHeight: 1.6 }}>
              <strong>Layout note:</strong> Full-bleed image behind L→R gradient (brand-900/95 → brand-900/20). Copy lives on the dark left. Image visible on right. min-h-[90vh] for full viewport presence.
            </p>
          </div>
        </div>

        {/* Marquee ticker at base of hero */}
        <div style={{
          borderTop: `1px solid ${w.border}`, background: w.fillBlack,
          padding: "10px 0", display: "flex", alignItems: "center",
        }}>
          {/* Fixed "BROWSE TOPICS" label */}
          <div style={{
            flexShrink: 0, borderRight: `1px solid ${w.borderDark}`,
            padding: "0 16px",
          }}>
            <div style={{ background: w.fillMed, width: 90, height: 9, borderRadius: 2, opacity: 0.5 }} />
          </div>
          {/* Scrolling topic links with · separators */}
          <div style={{ flex: 1, overflow: "hidden", padding: "0 16px", display: "flex", gap: 32 }}>
            {["Nails", "Alignment", "Routine", "Foot Health", "Fit", "Pain", "Evidence-Based", "Men's Wellness", "Long Game"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                <div style={{ background: w.fillMed, width: 60 + (i % 3) * 15, height: 10, borderRadius: 2, opacity: 0.6 }} />
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: w.fillMed, opacity: 0.4 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Marquee annotation */}
        <div style={{ padding: "12px 40px", background: w.canvas, borderTop: `1px solid ${w.border}` }}>
          <AnnNote>
            <strong>Marquee decision:</strong> Sits at the hero base, not in the nav. CSS animate-marquee for continuous scroll. "BROWSE TOPICS" label pins left as fixed signifier. Links route to /learn?cat= params and content pages. Accent dot separators between items.
          </AnnNote>
        </div>
      </Section>

      {/* ── 2. Stats — large display numbers, 2-column, no cards ── */}
      <Section annN={2} ann="Stats — 2-column · Display numbers · Source citations · No cards" bg={w.canvas}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Overline: "The numbers most men ignore" */}
          <div style={{ background: w.fillMed, width: 220, height: 10, borderRadius: 2, marginBottom: 36 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              { value: "1 in 4", label: "men over 40 experience chronic foot pain" },
              { value: "63-72%", label: "of adults wear shoes that don't fit correctly" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "0 40px",
                borderRight: i === 0 ? `1px solid ${w.border}` : "none",
                paddingLeft: i === 0 ? 0 : undefined,
              }}>
                {/* Display number */}
                <div style={{ background: w.fillDark, width: 140, height: 56, borderRadius: 2, marginBottom: 12 }} />
                {/* Label */}
                <TextLines lines={2} widths={["80%", "65%"]} />
                {/* Context line */}
                <div style={{ marginTop: 8, background: w.fillMed, width: 180, height: 10, borderRadius: 2 }} />
                {/* Source citation link */}
                <div style={{ marginTop: 10, background: w.fill, width: 200, height: 9, borderRadius: 2, textDecoration: "underline" }} />
              </div>
            ))}
          </div>
          <AnnNote>
            <strong>Layout note:</strong> No cards. 2-col divided layout. Large display number is the visual anchor. Context line in accent color beneath. Source as underlined link. Credibility layer before the content scroll begins.
          </AnnNote>
        </div>
      </Section>

      {/* ── 3. From the Guides — Sticky left + scrolling articles right ── */}
      <Section annN={3} ann="From the Guides — Sticky left (heading + featured article) · 4 articles scrolling right" style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "100%" }}>

          {/* LEFT: sticky panel — heading top, featured article bottom */}
          <div style={{ borderRight: `1px solid ${w.border}` }}>
            <div style={{
              position: "sticky", top: 96,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: "80vh", padding: "48px 40px",
            }}>
              <div>
                {/* Section heading — display scale, stacked: "FROM THE GUIDES." */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ background: w.fillDark, height: 64, width: "40%", borderRadius: 2 }} />
                  <div style={{ background: w.fillDark, height: 64, width: "30%", borderRadius: 2 }} />
                  <div style={{ background: w.fillDark, height: 64, width: "55%", borderRadius: 2 }} />
                </div>
                {/* "View all guides" button — outlined */}
                <WBtn label="View all guides" style={{ marginTop: 24 }} />
              </div>

              {/* Featured article at bottom of sticky panel */}
              <div style={{ marginTop: 40 }}>
                <ImgBox height={220} label="Featured Article Image — 3:2 aspect" />
                <div style={{ marginTop: 14 }}>
                  {/* Category + read time */}
                  <div style={{ background: w.fillMed, width: 160, height: 10, borderRadius: 2, marginBottom: 10 }} />
                  {/* Article title — display font, uppercase, 2 lines */}
                  <div style={{ background: w.fillDark, width: "90%", height: 24, borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ background: w.fillDark, width: "75%", height: 24, borderRadius: 2, marginBottom: 12 }} />
                  {/* Excerpt */}
                  <TextLines lines={2} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: 4 scrolling articles */}
          <div>
            {articleLabels.map((title, i) => (
              <div key={i} style={{
                display: "flex", gap: 20, padding: "28px 40px",
                borderBottom: `1px solid ${w.border}`,
                background: w.bg,
              }}>
                {/* Thumbnail — fixed size */}
                <ImgBox width={144} height={112} label="IMG" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                  {/* Category + read time */}
                  <div style={{ background: w.fillMed, width: 140, height: 10, borderRadius: 2 }} />
                  {/* Title — display font, uppercase */}
                  <div style={{ background: w.fillDark, width: "85%", height: 20, borderRadius: 2 }} />
                  <div style={{ background: w.fillDark, width: "70%", height: 20, borderRadius: 2 }} />
                  {/* Excerpt */}
                  <TextLines lines={2} widths={["90%", "75%"]} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Annotation */}
        <div style={{ padding: "16px 40px", background: w.canvas }}>
          <AnnNote>
            <strong>Layout decision:</strong> Sticky left + scrolling right. Heading ("FROM THE GUIDES.") stays visible as articles scroll. Featured article anchors the bottom of the sticky panel. Hover states: image scale 1.05, title color shift. No pagination needed.
          </AnnNote>
        </div>
      </Section>

      {/* ── 4. Editorial Split — Image left, dark brand panel right ── */}
      <Section annN={4} ann="Editorial Split — Image left · Dark brand panel right · Text link only, no button CTA" style={{ padding: 0 }}>
        <div style={{ display: "flex", minHeight: 500 }}>
          {/* Left: full-bleed image */}
          <div style={{ width: "50%", position: "relative" }}>
            <ImgBox width="100%" height={500} label="Full-bleed editorial image" style={{ height: "100%" }} />
          </div>
          {/* Right: dark panel */}
          <div style={{
            width: "50%", background: w.fillBlack,
            padding: "56px 60px", display: "flex", alignItems: "center",
          }}>
            <div>
              {/* Accent rule — 2px, 32px wide */}
              <div style={{ width: 32, height: 2, background: w.fillMed, marginBottom: 20 }} />
              {/* Headline — display scale: "IT COMPOUNDS UPWARD." */}
              <div style={{ background: "white", opacity: 0.85, width: "70%", height: 40, borderRadius: 2, marginBottom: 10 }} />
              <div style={{ background: "white", opacity: 0.85, width: "55%", height: 40, borderRadius: 2, marginBottom: 24 }} />
              {/* Body copy — white/65 */}
              <TextLines lines={4} />
              {/* Text link: "Why we built this →" */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 32 }}>
                <div style={{ background: w.fillMed, width: 130, height: 11, borderRadius: 2 }} />
                <span style={{ color: w.fillMed, fontSize: 14 }}>→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div style={{ padding: "16px 40px", background: w.canvas }}>
          <AnnNote>
            <strong>Layout decision:</strong> Trust moment, not conversion moment. 50/50 split. Dark background signals tonal shift. No button CTA, only a text link ("Why we built this →"). The copy IS the message. Any button here would undercut the gravitas.
          </AnnNote>
        </div>
      </Section>

      {/* ── 5. Topics — 2-column: stacked words + description left, crossfading inset image right ── */}
      <Section annN={5} ann="Topics — 2-column: stacked word list + description left · Crossfading inset image right" style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 580 }}>

          {/* LEFT: stacked topic words + active description below */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "48px 40px 48px 64px",
          }}>
            {/* Stacked word list — large display type, interactive */}
            <div style={{ marginBottom: 40 }}>
              {topicLabels.map((label, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveTopicIdx(i)}
                  onClick={() => setActiveTopicIdx(i)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "none", border: "none", cursor: "pointer",
                    padding: "3px 0", fontFamily: font,
                    fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em",
                    textTransform: "uppercase", lineHeight: 1.05,
                    color: i === activeTopicIdx ? w.fillBlack : w.fillMed,
                    transition: "color 0.3s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Active topic description panel */}
            <div style={{ minHeight: 160 }}>
              {/* Index: "01 / 06" */}
              <div style={{ background: w.fillMed, width: 60, height: 10, borderRadius: 2, marginBottom: 12 }} />
              {/* Tagline — italic, accent color */}
              <div style={{ background: w.fillMed, width: 180, height: 12, borderRadius: 2, marginBottom: 8, fontStyle: "italic" }} />
              {/* Description — body text */}
              <TextLines lines={4} widths={["95%", "100%", "90%", "75%"]} />
              {/* "Explore this topic →" link */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 20 }}>
                <div style={{ background: w.fillMed, width: 120, height: 10, borderRadius: 2 }} />
                <span style={{ color: w.fillMed, fontSize: 12 }}>→</span>
              </div>
            </div>
          </div>

          {/* RIGHT: crossfading image with inset padding */}
          <div style={{ position: "relative", minHeight: 580 }}>
            {/* Inset container — padding on all sides creates breathing room */}
            <div style={{
              position: "absolute",
              top: 32, right: 32, bottom: 32, left: 32,
              overflow: "hidden", background: w.fillDark,
            }}>
              <ImgBox
                width="100%" height={516}
                label={`Topic image — crossfades on hover\n(inset from edges)`}
                style={{ height: "100%", border: "none" }}
              />
            </div>

            {/* Annotation overlay */}
            <div style={{
              position: "absolute", bottom: 48, right: 48,
              maxWidth: 220, background: "#EEF4FF",
              border: `1px dashed ${w.annotation}`,
              borderRadius: 4, padding: "8px 12px", zIndex: 2,
            }}>
              <p style={{ fontFamily: font, fontSize: 11, color: w.annotation, margin: 0, lineHeight: 1.5 }}>
                Image crossfades with 500ms transition on topic hover. Inset from all edges for breathing room.
              </p>
            </div>
          </div>
        </div>

        {/* Annotation */}
        <div style={{ padding: "16px 40px", background: w.canvas, borderTop: `1px solid ${w.border}` }}>
          <AnnNote>
            <strong>Layout decision:</strong> 2-column layout. Left: stacked topic words at display scale (hover changes active state + triggers image crossfade). Description panel below the word list shows tagline, body, and "Explore" link. Right: single crossfading image, inset from edges (absolute inset-8). Progressive disclosure without page navigation. Mobile: words become tap targets, image hidden, bottom sheet overlay for description.
          </AnnNote>
        </div>
      </Section>

      {/* ── 6. Routines — 3-column card grid ── */}
      <Section annN={6} ann="Routines — 3-column card grid · Image with label badge · Time stamp" bg={w.canvas}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header row: heading left, link right */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              {/* "The routines." — display scale */}
              <div style={{ background: w.fillDark, width: 220, height: 36, borderRadius: 2, marginBottom: 14 }} />
              {/* Subtext */}
              <TextLines lines={2} widths={["70%", "55%"]} />
            </div>
            {/* "View all routines →" */}
            <div style={{ background: w.fillMed, width: 130, height: 11, borderRadius: 2 }} />
          </div>

          {/* 3-column card grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {routineLabels.map((r, i) => (
              <div key={i} style={{
                background: w.bg, border: `1.5px solid ${w.border}`,
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}>
                {/* Image with label badge overlay */}
                <div style={{ position: "relative" }}>
                  <ImgBox height={200} label={`${r.label} routine — 4:3 aspect`} />
                  {/* Label badge */}
                  <div style={{
                    position: "absolute", bottom: 10, left: 12,
                    background: "rgba(255,255,255,.9)", padding: "3px 10px",
                  }}>
                    <span style={{ fontFamily: font, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: w.fillBlack }}>
                      {r.label}
                    </span>
                  </div>
                </div>
                {/* Card body */}
                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Title — display font, uppercase */}
                  <div style={{ background: w.fillDark, width: "80%", height: 18, borderRadius: 2 }} />
                  {/* Description */}
                  <TextLines lines={3} />
                  {/* Time stamp */}
                  <div style={{ background: w.fillMed, width: 120, height: 9, borderRadius: 2, marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>

          <AnnNote>
            <strong>Layout note:</strong> Routines replaced kits post-pivot. Same 3-col grid pattern, purpose-shifted: behavioral adoption over product purchase. Label badge in image layer borrows e-commerce conventions. Time stamp grounds behavioral commitment ("5 min / every night"). Hover: border-brand-300, shadow-md, image scale 1.05.
          </AnnNote>
        </div>
      </Section>

      {/* ── 7. Parallax CTA — "START HERE." ── */}
      <Section annN={7} ann="Parallax CTA — Fixed background · Centered conversion moment · Assessment-first" style={{ padding: 0 }} bg={w.fill}>
        <div style={{ position: "relative", minHeight: 440, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: w.fillDark }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke={w.borderDark} strokeWidth="1.5" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke={w.borderDark} strokeWidth="1.5" />
            </svg>
          </div>
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "60px 40px", maxWidth: 640 }}>
            {/* "START HERE." — display hero scale, centered */}
            <div style={{ background: "white", opacity: 0.85, width: 280, height: 64, borderRadius: 2, margin: "0 auto 24px" }} />
            {/* Sub-copy: "Five sections. 30 questions..." */}
            <TextLines lines={2} widths={["75%", "60%"]} />

            {/* CTA pair — centered */}
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 28 }}>
              <WBtn label="Take the Assessment" primary />
              <WBtn label="Our story" style={{ border: "1.5px solid rgba(255,255,255,.5)", color: "white", background: "transparent" }} />
            </div>

            <div style={{
              marginTop: 20, background: "#EEF4FF",
              border: `1px dashed ${w.annotation}`,
              borderRadius: 4, padding: "8px 14px",
            }}>
              <p style={{ fontFamily: font, fontSize: 11, color: w.annotation, margin: 0 }}>
                Background: fixed attachment (parallax). Dark overlay (brand-900/80). Primary CTA = "Take the Assessment" (not waitlist). Secondary = "Our story."
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Layout legend ── */}
      <div style={{ background: "#F0F4FF", borderTop: `2px solid ${w.annotation}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{
            fontFamily: font, fontSize: 11, fontWeight: 700,
            letterSpacing: ".1em", textTransform: "uppercase",
            color: w.annotation, marginBottom: 20,
          }}>
            Layout Decisions Documented
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { n: 1, note: "Hero: full-bleed image + L→R gradient overlay (brand-900/95 to brand-900/20). Copy on dark left. min-h-[90vh]. Assessment is primary CTA. Marquee ticker at base with continuous scroll." },
              { n: 2, note: "Stats: no cards. Large display numbers, 2-col divided. Context line in accent color. Source citations as underlined links. Credibility before content." },
              { n: 3, note: "From the Guides: sticky left (heading + featured article at bottom). 4 articles scroll right. Featured article at bottom of sticky panel. Hover: scale + color shift." },
              { n: 4, note: "Editorial split: 50/50. Image + dark panel. Accent rule above headline. Text link only. Trust moment, not conversion. Copy is the message." },
              { n: 5, note: "Topics: 2-col. Left: stacked display words (hover-active) + description panel below. Right: crossfading inset image. Mobile: tap → bottom sheet overlay." },
              { n: 6, note: "Routines: 3-col card grid. Label badge in image layer. Time stamp grounds commitment. Replaced kits post-pivot. Behavioral adoption over product purchase." },
              { n: 7, note: "Parallax CTA: fixed background. Centered. \"START HERE.\" at display scale. Assessment-first CTA. Secondary: \"Our story.\" Single conversion moment at scroll end." },
            ].map((item) => (
              <div key={item.n} style={{
                background: "white", border: `1px solid ${w.annotation}33`,
                borderRadius: 6, padding: "14px 16px",
              }}>
                <Ann n={item.n} label={`Section ${item.n}`} />
                <p style={{ fontFamily: font, fontSize: 12, lineHeight: 1.6, color: w.textMid, margin: 0 }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* Prototype question */}
          <div style={{
            marginTop: 24, padding: "16px 20px",
            background: "white", border: `1.5px solid ${w.annotation}`,
            borderRadius: 6,
          }}>
            <p style={{
              fontFamily: font, fontSize: 11, fontWeight: 700,
              letterSpacing: ".1em", textTransform: "uppercase",
              color: w.annotation, marginBottom: 8,
            }}>
              Prototype question this wireframe answered:
            </p>
            <p style={{ fontFamily: font, fontSize: 13, color: w.text, lineHeight: 1.7, margin: 0 }}>
              Does the content hierarchy communicate the site's purpose without visual design? Can a first-time visitor understand what this site is, what it offers, and where to start, from structure alone?
            </p>
            <p style={{ fontFamily: font, fontSize: 12, color: w.textMid, marginTop: 10, lineHeight: 1.6 }}>
              The wireframe confirmed: topics section needed a 2-column layout with stacked display words as the primary interaction (not a 3-column center list). Assessment CTA is the primary hero action. Structure revealed both before any visual direction was applied.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
