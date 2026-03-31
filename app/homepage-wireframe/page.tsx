"use client";

/**
 * /homepage-wireframe — Lo-Fi Wireframe
 *
 * Case study artifact for Men's Sole Revival.
 * Shows the layout skeleton — all sections, full structure — before
 * any visual design decisions were applied. Used in the case study
 * to show the information architecture and content hierarchy layer
 * independently from the visual direction.
 *
 * Rules:
 * - Grayscale only
 * - No real images — SVG placeholder boxes
 * - No brand fonts — system-ui only
 * - All interactive elements labeled, not styled
 * - Annotations mark each section and layout decision
 *
 * noindex: set in layout.tsx
 */

import { useState } from "react";

// ── Wireframe palette ──────────────────────────────────────────────────────
const w = {
  bg:        "#FFFFFF",
  canvas:    "#F4F4F4",
  border:    "#CCCCCC",
  borderMed: "#AAAAAA",
  borderDark:"#666666",
  fill:      "#E8E8E8",
  fillMed:   "#D0D0D0",
  fillDark:  "#B0B0B0",
  fillBlack: "#333333",
  text:      "#333333",
  textMid:   "#666666",
  textLight: "#999999",
  red:       "#E63946",   // annotation color only
  annotation:"#0070F3",   // blue annotation labels
};

const font = "system-ui, -apple-system, sans-serif";

// ── Wireframe primitives ───────────────────────────────────────────────────

/** Gray box with diagonal-line SVG — standard wireframe image placeholder */
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
      width, height, background: w.fill,
      border: `1.5px solid ${w.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", flexShrink: 0,
      ...style,
    }}>
      {/* Diagonal cross lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={w.border} strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={w.border} strokeWidth="1.5" />
      </svg>
      <span style={{
        fontFamily: font, fontSize: 11, fontWeight: 700,
        letterSpacing: ".1em", textTransform: "uppercase",
        color: w.textLight, background: w.fill,
        padding: "3px 8px", position: "relative", zIndex: 1,
      }}>
        {label}
      </span>
    </div>
  );
}

/** Wireframe button */
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
      padding: "10px 24px", fontFamily: font,
      fontSize: 13, fontWeight: primary ? 700 : 400,
      color: primary ? "white" : w.text,
      cursor: "default", userSelect: "none",
      ...style,
    }}>
      {label}
    </div>
  );
}

/** Annotation badge — blue label for case study reference */
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
        letterSpacing: ".1em", textTransform: "uppercase",
        color: w.annotation,
      }}>
        {label}
      </span>
    </div>
  );
}

/** Text placeholder lines */
function TextLines({ lines = 3, widths }: { lines?: number; widths?: string[] }) {
  const defaultWidths = ["100%", "90%", "75%", "60%", "80%"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: 10, borderRadius: 2,
          background: w.fillMed,
          width: widths ? widths[i] : defaultWidths[i % defaultWidths.length],
        }} />
      ))}
    </div>
  );
}

/** Section wrapper with dashed outline + annotation */
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
      {/* Section annotation strip */}
      <div style={{
        borderBottom: `1px dashed ${w.border}`,
        padding: "8px 40px",
        background: "#F9F9F9",
      }}>
        <Ann n={annN} label={ann} />
      </div>
      <div style={{ padding: "40px 40px" }}>
        {children}
      </div>
    </section>
  );
}

// ── Data skeletons ─────────────────────────────────────────────────────────

const articleLabels = [
  "Article title — long-form, 40–60 chars",
  "Article title — long-form, 40–60 chars",
  "Article title — long-form, 40–60 chars",
  "Article title — long-form, 40–60 chars",
  "Article title — long-form, 40–60 chars",
];

const topicLabels = [
  "Pain & Recovery",
  "Nail Care",
  "Toe Alignment",
  "Daily Routine",
  "Footwear Fit",
  "Dry Skin & Cracking",
];

const kitLabels = [
  { title: "Kit Name 01", tag: "Tag label" },
  { title: "Kit Name 02", tag: "Tag label" },
  { title: "Kit Name 03", tag: "Tag label" },
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
        Lo-Fi Wireframe — Layout Structure · Pre-Visual Design
      </div>

      {/* ── Nav ── */}
      <nav style={{
        background: w.fill, border: `1px solid ${w.border}`,
        padding: "0 40px", height: 60, position: "sticky", top: 36, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{
          background: w.fillMed, width: 160, height: 20, borderRadius: 2,
        }} />

        {/* Nav links */}
        <div style={{ display: "flex", gap: 32 }}>
          {["Nav Link", "Nav Link", "Nav Link"].map((l, i) => (
            <div key={i} style={{ background: w.fillMed, width: 60, height: 12, borderRadius: 2 }} />
          ))}
        </div>

        {/* CTA */}
        <WBtn label="Primary CTA" primary />
      </nav>

      {/* ── 1. Hero ── */}
      <Section annN={1} ann="Hero — Primary value proposition + dual CTA" bg={w.fill} style={{ padding: 0 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "center",
          maxWidth: 1200, margin: "0 auto",
        }}>
          {/* Left: copy */}
          <div>
            {/* Overline */}
            <div style={{ background: w.fillMed, width: 200, height: 12, borderRadius: 2, marginBottom: 20 }} />

            {/* H1 — 3 display lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <div style={{ background: w.fillDark, height: 44, width: "85%", borderRadius: 2 }} />
              <div style={{ background: w.fillDark, height: 44, width: "75%", borderRadius: 2 }} />
              <div style={{ background: w.fillDark, height: 44, width: "60%", borderRadius: 2 }} />
            </div>

            {/* Body copy */}
            <div style={{ marginBottom: 28 }}>
              <TextLines lines={4} />
            </div>

            {/* CTA group */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <WBtn label="Primary CTA" primary />
              <WBtn label="Secondary CTA" />
            </div>

            {/* Disclaimer line */}
            <div style={{ background: w.fillMed, width: 200, height: 10, borderRadius: 2 }} />

            {/* Marquee / tag row */}
            <div style={{
              marginTop: 28, display: "flex", gap: 8, flexWrap: "wrap",
            }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{
                  background: w.fillMed, height: 24, width: 80 + (i % 3) * 20,
                  borderRadius: 12,
                }} />
              ))}
            </div>

            {/* Annotation note */}
            <div style={{
              marginTop: 28, padding: "12px 16px",
              border: `1px dashed ${w.annotation}`,
              borderRadius: 4, background: "#EEF4FF",
            }}>
              <p style={{ fontFamily: font, fontSize: 12, color: w.annotation, margin: 0, lineHeight: 1.6 }}>
                <strong>Layout note:</strong> H1 is display-scale (3 lines). CTA hierarchy: solid primary + outline secondary. Marquee replaces sub-navigation — signals topic range without requiring a click.
              </p>
            </div>
          </div>

          {/* Right: hero image */}
          <ImgBox height={420} label="Hero Image — Full bleed, 3:2" />
        </div>
      </Section>

      {/* ── 2. Stats ── */}
      <Section annN={2} ann="Stats — Two data points, credibility anchor" bg={w.bg}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Overline */}
          <div style={{ background: w.fillMed, width: 180, height: 10, borderRadius: 2, marginBottom: 32 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{
                padding: "0 40px",
                borderRight: i === 0 ? `1px solid ${w.border}` : "none",
                paddingLeft: i === 0 ? 0 : undefined,
              }}>
                {/* Large stat number */}
                <div style={{ background: w.fillDark, width: 140, height: 64, borderRadius: 4, marginBottom: 14 }} />
                <TextLines lines={2} widths={["80%", "60%"]} />
                <div style={{ marginTop: 10, background: w.fillMed, width: 160, height: 10, borderRadius: 2 }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 3. From the Library ── */}
      <Section annN={3} ann="From the Library — Sticky editorial left + scrolling article list right" style={{ padding: 0 }} bg={w.bg}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "100%" }}>

          {/* Sticky left */}
          <div style={{ borderRight: `1px solid ${w.border}` }}>
            <div style={{
              position: "sticky", top: 96,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: "80vh", padding: "40px",
            }}>
              <div>
                {/* Section heading — display scale */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: w.fillDark, height: 56, width: "70%", borderRadius: 3 }} />
                  <div style={{ background: w.fillDark, height: 56, width: "55%", borderRadius: 3 }} />
                  <div style={{ background: w.fillDark, height: 56, width: "65%", borderRadius: 3 }} />
                </div>
                <WBtn label="View all guides →" style={{ marginTop: 24 }} />
              </div>

              {/* Featured article */}
              <div style={{ marginTop: 40 }}>
                <ImgBox height={220} label="Featured Article Image" />
                <div style={{ marginTop: 14 }}>
                  <div style={{ background: w.fillMed, width: 160, height: 10, borderRadius: 2, marginBottom: 10 }} />
                  <div style={{ background: w.fillDark, width: "90%", height: 22, borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ background: w.fillDark, width: "70%", height: 22, borderRadius: 2, marginBottom: 12 }} />
                  <TextLines lines={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling right: article list */}
          <div>
            {articleLabels.slice(0, 4).map((_, i) => (
              <div key={i} style={{
                display: "flex", gap: 20, padding: "28px 40px",
                borderBottom: `1px solid ${w.border}`,
                background: i % 2 === 0 ? w.bg : w.canvas,
              }}>
                <ImgBox width={130} height={96} label="IMG" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                  <div style={{ background: w.fillMed, width: 140, height: 10, borderRadius: 2 }} />
                  <div style={{ background: w.fillDark, width: "85%", height: 18, borderRadius: 2 }} />
                  <div style={{ background: w.fillDark, width: "70%", height: 18, borderRadius: 2 }} />
                  <TextLines lines={2} widths={["90%", "75%"]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4. Editorial Split ── */}
      <Section annN={4} ann="Editorial Split — Image left / message right. Trust-building, not promotional." style={{ padding: 0 }} bg={w.bg}>
        <div style={{ display: "flex", minHeight: 420 }}>
          <div style={{ width: "50%", position: "relative" }}>
            <ImgBox width="100%" height={420} label="Full-bleed image" style={{ height: "100%" }} />
          </div>
          <div style={{
            width: "50%", background: w.fill,
            padding: "56px 60px", display: "flex", alignItems: "center",
          }}>
            <div>
              {/* Rule */}
              <div style={{ width: 32, height: 3, background: w.fillDark, marginBottom: 20 }} />
              {/* Headline */}
              <div style={{ background: w.fillDark, width: "80%", height: 36, borderRadius: 2, marginBottom: 10 }} />
              <div style={{ background: w.fillDark, width: "55%", height: 36, borderRadius: 2, marginBottom: 24 }} />
              <TextLines lines={4} />
              {/* Text link */}
              <div style={{ background: w.fillMed, width: 140, height: 12, borderRadius: 2, marginTop: 28 }} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── 5. Topics ── */}
      <Section annN={5} ann="Topics — 3-column interactive: image / topic list (hover) / description panel" style={{ padding: 0 }} bg={w.bg}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", minHeight: 560 }}>

          {/* Left: image */}
          <ImgBox height={560} label="Topic Image\n(changes on hover)" />

          {/* Center: topic list */}
          <div style={{
            borderLeft: `1px solid ${w.border}`, borderRight: `1px solid ${w.border}`,
            display: "flex", flexDirection: "column", justifyContent: "center",
            alignItems: "center", padding: "40px 24px", textAlign: "center",
          }}>
            {/* Section label */}
            <div style={{ background: w.fillDark, width: 220, height: 28, borderRadius: 2, marginBottom: 32 }} />
            {topicLabels.map((t, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveTopicIdx(i)}
                onClick={() => setActiveTopicIdx(i)}
                style={{
                  display: "block", width: "100%", background: "none", border: "none",
                  cursor: "pointer", padding: "8px 0", fontFamily: font, fontSize: 22,
                  fontWeight: 700,
                  color: i === activeTopicIdx ? w.fillBlack : w.fillMed,
                  borderBottom: `1px dashed ${w.border}`,
                }}
              >
                {t}
              </button>
            ))}
            <div style={{
              marginTop: 20, background: "#EEF4FF",
              border: `1px dashed ${w.annotation}`,
              padding: "10px 14px", borderRadius: 4, width: "100%",
            }}>
              <p style={{ fontFamily: font, fontSize: 11, color: w.annotation, margin: 0 }}>
                Hover interaction: active topic illuminates, image swaps, description panel updates
              </p>
            </div>
          </div>

          {/* Right: description panel */}
          <div style={{
            background: w.canvas, padding: "32px 28px", borderTop: `3px solid ${w.fillDark}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            {/* Index */}
            <div style={{ background: w.fillMed, width: 60, height: 10, borderRadius: 2 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Tagline */}
              <div style={{ background: w.fillMed, width: "80%", height: 12, borderRadius: 2 }} />
              {/* Topic name */}
              <div style={{ background: w.fillDark, width: "90%", height: 24, borderRadius: 2 }} />
              {/* Description */}
              <TextLines lines={5} />
            </div>
            {/* CTA */}
            <div style={{ background: w.fillMed, width: 140, height: 12, borderRadius: 2 }} />
          </div>
        </div>
      </Section>

      {/* ── 6. Kits ── */}
      <Section annN={6} ann="Kits — 3-column card grid. Product preview + waitlist signal." bg={w.canvas}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <div style={{ background: w.fillDark, width: 180, height: 36, borderRadius: 2, marginBottom: 14 }} />
              <TextLines lines={2} widths={["70%", "55%"]} />
            </div>
            <div style={{ background: w.fillMed, width: 100, height: 12, borderRadius: 2 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {kitLabels.map((kit, i) => (
              <div key={i} style={{
                background: w.bg, border: `1.5px solid ${w.border}`,
                borderRadius: 8, padding: 24,
              }}>
                {/* Tag */}
                <div style={{ background: w.fillMed, width: 80, height: 20, borderRadius: 2, marginBottom: 16 }} />
                {/* Title */}
                <div style={{ background: w.fillDark, width: "75%", height: 22, borderRadius: 2, marginBottom: 14 }} />
                {/* Description */}
                <TextLines lines={3} />
                {/* Link */}
                <div style={{ background: w.fillMed, width: 110, height: 12, borderRadius: 2, marginTop: 20 }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 7. Parallax CTA ── */}
      <Section annN={7} ann="Parallax CTA — Full-width, image background. Final conversion moment." style={{ padding: 0 }} bg={w.fill}>
        <div style={{ position: "relative", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Background image indicator */}
          <div style={{
            position: "absolute", inset: 0, background: w.fillMed,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke={w.border} strokeWidth="1.5" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke={w.border} strokeWidth="1.5" />
            </svg>
          </div>
          {/* Overlay label */}
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "60px 40px" }}>
            <div style={{
              background: "rgba(255,255,255,.85)", padding: "32px 48px",
              border: `1.5px dashed ${w.borderDark}`, display: "inline-block",
            }}>
              <div style={{ background: w.fillDark, width: 280, height: 52, borderRadius: 3, margin: "0 auto 20px" }} />
              <TextLines lines={2} widths={["70%", "55%"]} />
              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 28 }}>
                <WBtn label="Primary CTA" primary />
                <WBtn label="Secondary CTA" />
              </div>
              <div style={{
                marginTop: 20, background: "#EEF4FF",
                border: `1px dashed ${w.annotation}`,
                padding: "8px 14px", borderRadius: 4,
              }}>
                <p style={{ fontFamily: font, fontSize: 11, color: w.annotation, margin: 0 }}>
                  Background attachment: fixed (parallax scroll). Dark overlay for legibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 8. Footer ── */}
      <Section annN={8} ann="Footer — Brand statement + navigation columns" style={{ padding: 0 }} bg={w.fillBlack}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ background: w.fillDark, width: 180, height: 22, borderRadius: 2, marginBottom: 14 }} />
              <TextLines lines={3} widths={["85%", "75%", "60%"]} />
            </div>
            <div style={{ display: "flex", gap: 60 }}>
              {["Explore", "Company"].map((col) => (
                <div key={col}>
                  <div style={{ background: w.fillDark, width: 70, height: 10, borderRadius: 2, marginBottom: 16 }} />
                  {[0, 1, 2].map((j) => (
                    <div key={j} style={{ background: w.fillMed, width: 60, height: 10, borderRadius: 2, marginBottom: 10 }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            marginTop: 40, paddingTop: 20, borderTop: `1px solid ${w.fillDark}`,
            background: w.fillBlack,
          }}>
            <div style={{ background: w.fillDark, width: 220, height: 10, borderRadius: 2 }} />
          </div>
        </div>
      </Section>

      {/* ── Layout legend ── */}
      <div style={{
        background: "#F0F4FF", borderTop: `2px solid ${w.annotation}`,
        padding: "32px 40px",
      }}>
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
              { n: 1, note: "Hero: 2-col split. Copy left, image right. Marquee replaces sub-nav." },
              { n: 2, note: "Stats: 2-col divided. Large display numbers anchor credibility before content." },
              { n: 3, note: "Library: Sticky left editorial + scrolling article list. Depth without pagination." },
              { n: 4, note: "Split: 50/50 image + message. No CTA — trust moment, not conversion moment." },
              { n: 5, note: "Topics: 3-col interactive. Image / list / description. Hover = progressive disclosure." },
              { n: 6, note: "Kits: 3-col card grid. Waitlist CTA per card — commerce intent deferred." },
              { n: 7, note: "CTA: Full-width parallax. Single conversion moment at end of scroll journey." },
              { n: 8, note: "Footer: Dark background break. Brand tagline + navigation columns." },
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
        </div>
      </div>

    </div>
  );
}
