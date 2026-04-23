"use client";

/**
 * /assessment-wireframe — Lo-Fi Wireframe
 *
 * Case study artifact for Men's Sole Revival.
 * Shows the full multi-step assessment flow as a scrollable layout
 * skeleton — all three states (Intro · Step · Results) — before any
 * visual design decisions were applied.
 *
 * Rules:
 * - Grayscale only
 * - No real images — SVG placeholder boxes
 * - No brand fonts — system-ui only
 * - All interactive elements labeled, not styled
 * - Blue annotations mark each state and layout decision
 *
 * noindex: set in layout.tsx
 */

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
  warn:       "#E63946",
};

const font = "system-ui, -apple-system, sans-serif";

// ── Primitives ─────────────────────────────────────────────────────────────

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
      fontFamily: font,
      fontSize: 13,
      fontWeight: primary ? 700 : 400,
      color: primary ? "white" : w.text,
      cursor: "default",
      userSelect: "none",
      ...style,
    }}>
      {label}
    </div>
  );
}

function Ann({ n, label }: { n: number | string; label: string }) {
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

function AnnNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 16,
      background: "#EEF4FF",
      border: `1px dashed ${w.annotation}`,
      borderRadius: 4,
      padding: "10px 14px",
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
          height: 10, borderRadius: 2,
          background: w.fillMed,
          width: widths ? widths[i] : defaults[i % defaults.length],
        }} />
      ))}
    </div>
  );
}

function SectionBlock({
  ann,
  annN,
  label,
  children,
  bg = w.bg,
}: {
  ann: string;
  annN: number | string;
  label?: string;
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <section style={{ background: bg, borderBottom: `1px solid ${w.border}` }}>
      <div style={{
        borderBottom: `1px dashed ${w.border}`,
        padding: "8px 40px",
        background: "#F9F9F9",
      }}>
        <Ann n={annN} label={ann} />
        {label && (
          <p style={{ fontFamily: font, fontSize: 11, color: w.textLight, margin: "2px 0 0 30px" }}>
            {label}
          </p>
        )}
      </div>
      <div style={{ padding: "40px 40px" }}>
        {children}
      </div>
    </section>
  );
}

// ── Checkbox row primitive ─────────────────────────────────────────────────

function CheckRow({
  text,
  checked = false,
  style = {},
}: {
  text: string;
  checked?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 14,
      border: `1.5px solid ${checked ? w.borderDark : w.border}`,
      background: checked ? w.fill : w.bg,
      padding: "12px 16px",
      ...style,
    }}>
      <div style={{
        width: 18, height: 18, flexShrink: 0, marginTop: 1,
        border: `1.5px solid ${checked ? w.fillDark : w.borderMed}`,
        background: checked ? w.fillDark : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div style={{
        background: w.fillMed, height: 10, borderRadius: 2,
        width: typeof text === "string" ? `${Math.min(90, 55 + text.length)}%` : "80%",
        marginTop: 4,
        flex: 1,
      }} />
    </div>
  );
}

// ── Shared nav ─────────────────────────────────────────────────────────────

function Nav() {
  // Mirrors SiteLayout.tsx interior layout:
  // 3-column grid — nav links LEFT · logo CENTER · CTA RIGHT
  // 5 links: Learn, Reviews, Routines, About, Assessment
  // "Assessment" is active on this page (darker + underline indicator)
  const links = ["Learn", "Reviews", "Routines", "About", "Assessment"];
  return (
    <nav style={{
      background: w.fill, border: `1px solid ${w.border}`,
      padding: "0 40px", height: 60,
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
    }}>
      {/* Left: nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {links.map((label, i) => {
          const isActive = label === "Assessment";
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{
                background: isActive ? w.fillBlack : w.fillMed,
                width: 44 + label.length * 2,
                height: 11,
                borderRadius: 2,
              }} />
              {isActive && (
                <div style={{ width: "100%", height: 2, background: w.fillDark, borderRadius: 1 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Center: logo */}
      <div style={{
        background: w.fillDark, width: 120, height: 24, borderRadius: 2,
      }} />

      {/* Right: CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <WBtn label="Take the Assessment" primary />
      </div>
    </nav>
  );
}

// ── Hero banner ────────────────────────────────────────────────────────────

function HeroBanner({ showProgress = false, step = 0, total = 5 }: { showProgress?: boolean; step?: number; total?: number }) {
  const pct = step === 0 ? 0 : Math.round((step / total) * 100);
  return (
    <div style={{ background: w.fillBlack, padding: "48px 40px" }}>
      <div style={{ background: w.fillDark, width: 160, height: 11, borderRadius: 2, marginBottom: 16 }} />
      <div style={{ background: "white", opacity: 0.9, width: "50%", height: 40, borderRadius: 2, marginBottom: 14 }} />
      <TextLines lines={2} widths={["45%", "38%"]} />
      {showProgress && (
        <div style={{ marginTop: 28, maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ background: w.fillDark, width: 100, height: 9, borderRadius: 2 }} />
            <div style={{ background: w.fillDark, width: 40, height: 9, borderRadius: 2 }} />
          </div>
          <div style={{ height: 3, background: w.fillMed, width: "100%" }}>
            <div style={{ height: 3, background: w.fill, width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AssessmentWireframe() {
  return (
    <div style={{ fontFamily: font, background: w.canvas, color: w.text, minHeight: "100vh" }}>

      {/* ── Label banner ── */}
      <div style={{
        background: w.fillBlack, color: "white", fontFamily: font,
        fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
        textTransform: "uppercase", textAlign: "center", padding: "10px 16px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        Lo-Fi Wireframe — Assessment Flow · 3 States · Pre-Visual Design
      </div>

      {/* ── Flow state divider ── */}
      <div style={{
        background: w.annotation, color: "white",
        fontFamily: font, fontSize: 12, fontWeight: 700,
        letterSpacing: ".1em", textTransform: "uppercase",
        padding: "8px 40px",
      }}>
        State 01 — Intro Screen
      </div>

      {/* ════════════════════════════════════════════════════════════
          STATE 1: INTRO
          ════════════════════════════════════════════════════════════ */}

      <Nav />
      <HeroBanner />

      {/* 1A. Intro content */}
      <SectionBlock annN="1A" ann="Intro Content — Warning · Stats · Entry CTA" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Warning box */}
          <div style={{
            border: `1.5px dashed ${w.borderDark}`,
            background: w.fill,
            padding: "16px 20px",
            marginBottom: 24,
          }}>
            <div style={{ background: w.fillDark, width: 120, height: 10, borderRadius: 2, marginBottom: 10 }} />
            <TextLines lines={3} widths={["95%", "85%", "70%"]} />
            <div style={{ marginTop: 12, background: w.fillMed, width: 180, height: 9, borderRadius: 2 }} />
            <div style={{ marginTop: 10 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontFamily: font, fontSize: 11, color: w.annotation,
                textDecoration: "underline",
              }}>
                → Find a podiatrist near you (exit path link)
              </div>
            </div>
            <AnnNote>
              <strong>UX decision:</strong> "See a doctor if" box gates the assessment. Gives high-risk users an exit path before they start. Reduces liability and builds trust simultaneously.
            </AnnNote>
          </div>

          {/* 3-stat row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            border: `1.5px solid ${w.border}`,
            background: w.bg,
            marginBottom: 24,
          }}>
            {["77%", "1 in 3", "63–72%"].map((val, i) => (
              <div key={i} style={{
                padding: "20px 16px", textAlign: "center",
                borderRight: i < 2 ? `1px solid ${w.border}` : "none",
              }}>
                <div style={{ background: w.fillDark, width: 60, height: 32, borderRadius: 2, margin: "0 auto 10px" }} />
                <TextLines lines={2} widths={["90%", "70%"]} />
                <div style={{ background: w.fillMed, width: 50, height: 8, borderRadius: 2, margin: "8px auto 0" }} />
              </div>
            ))}
          </div>

          {/* Body copy lines */}
          <div style={{ marginBottom: 28 }}>
            <TextLines lines={3} widths={["100%", "92%", "75%"]} />
          </div>

          {/* Start CTA */}
          <WBtn label="Start the assessment →" primary />

          <AnnNote>
            <strong>State 1 layout notes:</strong> Stats precede the CTA — credibility before commitment. 3-column grid anchors the claim visually. Warning box is scannable (no wall of text). No nav items compete with the CTA at this stage.
          </AnnNote>
        </div>
      </SectionBlock>

      {/* ════════════════════════════════════════════════════════════
          STATE 2: STEP / CHECKLIST
          ════════════════════════════════════════════════════════════ */}

      <div style={{
        background: w.annotation, color: "white",
        fontFamily: font, fontSize: 12, fontWeight: 700,
        letterSpacing: ".1em", textTransform: "uppercase",
        padding: "8px 40px",
      }}>
        State 02 — Step / Checklist Screen (shown: Section 01 of 05)
      </div>

      <Nav />
      <HeroBanner showProgress step={1} total={5} />

      {/* 2A. Section header */}
      <SectionBlock annN="2A" ann="Section Header — Label · Title · Subtitle" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ background: w.fillMed, width: 100, height: 10, borderRadius: 2, marginBottom: 10 }} />
            <div style={{ background: w.fillDark, width: "65%", height: 36, borderRadius: 2, marginBottom: 12 }} />
            <TextLines lines={2} widths={["88%", "72%"]} />
          </div>

          {/* Stat callout */}
          <div style={{
            display: "flex", gap: 14,
            borderLeft: `3px solid ${w.fillDark}`,
            background: w.bg, padding: "14px 16px",
            marginBottom: 24,
            boxShadow: `0 1px 3px ${w.border}`,
          }}>
            <div style={{ background: w.fillDark, width: 60, height: 36, borderRadius: 2, flexShrink: 0 }} />
            <div>
              <TextLines lines={2} widths={["90%", "70%"]} />
              <div style={{ marginTop: 8, background: w.fillMed, width: 140, height: 9, borderRadius: 2 }} />
            </div>
          </div>

          <AnnNote>
            <strong>UX decision:</strong> Stat callout appears above the checklist, not below it. Purpose: prime the user with context before they evaluate symptoms. Left-border treatment creates visual hierarchy without competing with checklist rows.
          </AnnNote>
        </div>
      </SectionBlock>

      {/* 2B. Checklist */}
      <SectionBlock annN="2B" ann="Checklist — Checkbox Rows (5–7 items per section)" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Call label */}
          <div style={{ background: w.fillMed, width: 110, height: 9, borderRadius: 2, marginBottom: 14 }} />

          {/* Checkbox rows — mix of checked/unchecked to show both states */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
            <CheckRow text="Symptom description — 40–70 characters. Specific, observable, non-clinical." checked />
            <CheckRow text="Symptom description — 40–70 characters. Observable condition the user can verify." />
            <CheckRow text="Symptom description — 40–70 characters. Behavioral pattern or physical sign." checked />
            <CheckRow text="Symptom description — 40–70 characters. Another observable condition." />
            <CheckRow text="Symptom description — 40–70 characters. Final item in section." />
          </div>

          {/* State callouts */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20,
          }}>
            <div style={{ border: `1px solid ${w.border}`, padding: "10px 14px", background: w.bg }}>
              <div style={{ background: w.fillMed, width: 80, height: 9, borderRadius: 2, marginBottom: 6 }} />
              <p style={{ fontFamily: font, fontSize: 11, color: w.annotation, margin: 0 }}>
                Unchecked state: white bg, neutral border
              </p>
            </div>
            <div style={{ border: `1.5px solid ${w.fillDark}`, padding: "10px 14px", background: w.fill }}>
              <div style={{ background: w.fillDark, width: 80, height: 9, borderRadius: 2, marginBottom: 6 }} />
              <p style={{ fontFamily: font, fontSize: 11, color: w.annotation, margin: 0 }}>
                Checked state: tinted bg, dark border, checkmark filled
              </p>
            </div>
          </div>

          {/* Note / callout */}
          <div style={{
            background: w.bg, border: `1px solid ${w.border}`,
            borderLeft: `3px solid ${w.fillMed}`,
            padding: "10px 16px", marginBottom: 28,
          }}>
            <p style={{ fontFamily: font, fontSize: 11, fontStyle: "italic", color: w.textMid, margin: 0 }}>
              Section note — appears below checklist when relevant. Gives context for 3+ flags. Not diagnostic. Reduces anxiety.
            </p>
          </div>

          {/* Navigation */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 20, borderTop: `1px solid ${w.border}`,
          }}>
            <div style={{
              fontFamily: font, fontSize: 12, color: w.textMid,
              textDecoration: "underline",
            }}>
              ← Back
            </div>
            <WBtn label="Next section →" primary />
          </div>

          <AnnNote>
            <strong>UX decisions:</strong> Checkbox tap target is the full row, not just the box (reduces mis-taps). Checked state changes full row background — spatial feedback. "Back" is text-only — doesn't compete visually with primary CTA. Last section CTA changes to "See my results →".
          </AnnNote>
        </div>
      </SectionBlock>

      {/* ════════════════════════════════════════════════════════════
          STATE 3: RESULTS
          ════════════════════════════════════════════════════════════ */}

      <div style={{
        background: w.annotation, color: "white",
        fontFamily: font, fontSize: 12, fontWeight: 700,
        letterSpacing: ".1em", textTransform: "uppercase",
        padding: "8px 40px",
      }}>
        State 03 — Results Screen
      </div>

      <Nav />
      <HeroBanner showProgress step={6} total={5} />

      {/* 3A. Score block */}
      <SectionBlock annN="3A" ann="Score Block — Micro-moment · Flag Count · Tier · Headline" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Micro-moment overline */}
          <div style={{ background: w.fillMed, width: 160, height: 9, borderRadius: 2, marginBottom: 20 }} />

          {/* Score card — dark */}
          <div style={{
            background: w.fillBlack, padding: "40px 32px",
            textAlign: "center", marginBottom: 28,
          }}>
            {/* "Your results" label */}
            <div style={{ background: w.fillDark, width: 100, height: 9, borderRadius: 2, margin: "0 auto 16px" }} />
            {/* Large number */}
            <div style={{ background: "white", opacity: 0.9, width: 80, height: 72, borderRadius: 4, margin: "0 auto 8px" }} />
            {/* "flags" label */}
            <div style={{ background: w.fillDark, width: 70, height: 9, borderRadius: 2, margin: "0 auto 16px" }} />
            {/* Divider rule */}
            <div style={{ width: 48, height: 2, background: w.fillMed, margin: "0 auto 16px" }} />
            {/* Tier label */}
            <div style={{ background: w.fillMed, width: 80, height: 9, borderRadius: 2, margin: "0 auto 12px" }} />
            {/* Headline */}
            <div style={{ background: "white", opacity: 0.8, width: "55%", height: 28, borderRadius: 2, margin: "0 auto" }} />
          </div>

          <AnnNote>
            <strong>UX decision:</strong> Micro-moment copy ("Here's where you stand") appears before the score renders — creates a cognitive pause. Score number is display-scale (the single most important piece of information). Tier label and headline follow. Dark panel creates contrast against the light canvas — signals a state change.
          </AnnNote>
        </div>
      </SectionBlock>

      {/* 3B. Per-section breakdown */}
      <SectionBlock annN="3B" ann="Per-Section Breakdown — Flags by Area, Each Linking to Guide" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ background: w.fillMed, width: 120, height: 9, borderRadius: 2, marginBottom: 14 }} />

          {/* Breakdown rows */}
          {[
            { count: "3", title: "Nail Health" },
            { count: "2", title: "Pain & Inflammation" },
            { count: "1", title: "Footwear Fit" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              border: `1.5px solid ${w.border}`, background: w.bg,
              padding: "12px 20px", marginBottom: 6,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 24, height: 24, background: w.fillDark,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "white" }}>
                    {item.count}
                  </span>
                </div>
                <div style={{ background: w.fillMed, width: 120, height: 10, borderRadius: 2 }} />
              </div>
              <div style={{
                fontFamily: font, fontSize: 11, color: w.annotation,
                textDecoration: "underline",
              }}>
                Read the guide →
              </div>
            </div>
          ))}

          <div style={{ background: w.fillMed, width: 200, height: 9, borderRadius: 2, marginTop: 10 }} />

          <AnnNote>
            <strong>UX decision:</strong> Per-section breakdown closes the feedback loop — users know not just how many flags, but which areas. Each row is a link to the relevant guide. Badge count is prominent. "Read the guide" label is hover-reveal in production (always visible in wireframe for clarity).
          </AnnNote>
        </div>
      </SectionBlock>

      {/* 3C. Recommendation card */}
      <SectionBlock annN="3C" ann="Recommendation Card — Contextual Body + CTA (tier-based)" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            borderLeft: `3px solid ${w.fillDark}`,
            background: w.bg, padding: "20px 24px",
            boxShadow: `0 1px 3px ${w.border}`,
            marginBottom: 24,
          }}>
            <TextLines lines={4} widths={["100%", "92%", "85%", "70%"]} />
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: font, fontSize: 12, color: w.annotation,
                textDecoration: "underline",
              }}>
                Tier-based CTA link → (e.g., "Browse the guides →" or "Start with the 5-min routine →")
              </div>
            </div>
          </div>

          <AnnNote>
            <strong>UX decision:</strong> Recommendation body is tier-conditional — 3 tiers (0–2 flags, 3–5, 6+). Body copy changes; CTA destination changes. Left-border callout treatment matches stat callout from step screens — visual consistency signals the same "authoritative aside" pattern.
          </AnnNote>
        </div>
      </SectionBlock>

      {/* 3D. PDF download + sources */}
      <SectionBlock annN="3D" ann="Download Block · Sources · Retake Link" bg={w.canvas}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* PDF download block */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 16,
            border: `1.5px solid ${w.border}`, background: w.bg,
            padding: "20px 24px", marginBottom: 24,
          }}>
            <div style={{
              width: 40, height: 40, background: w.fillBlack,
              flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 20, height: 16, background: w.fillDark, borderRadius: 2 }} />
            </div>
            <div>
              <div style={{ background: w.fillDark, width: 200, height: 14, borderRadius: 2, marginBottom: 8 }} />
              <TextLines lines={2} widths={["85%", "70%"]} />
              <div style={{ marginTop: 12 }}>
                <WBtn label="Download PDF →" style={{ fontSize: 11, padding: "8px 16px" }} />
              </div>
            </div>
          </div>

          {/* Sources block */}
          <div style={{ background: w.fill, padding: "16px 20px", marginBottom: 28 }}>
            <div style={{ background: w.fillDark, width: 70, height: 9, borderRadius: 2, marginBottom: 14 }} />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                background: w.fillMed, height: 9, borderRadius: 2, marginBottom: 10,
                width: `${75 + (i * 5) % 20}%`,
              }} />
            ))}
          </div>

          {/* Retake */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: font, fontSize: 12, color: w.textMid,
              textDecoration: "underline", display: "inline-block",
            }}>
              Start over
            </div>
          </div>

          <AnnNote>
            <strong>UX decision:</strong> PDF download sits below the recommendation — reinforces it, doesn't compete with it. Sources block builds credibility without cluttering the results view; it's below the primary content hierarchy. "Start over" is text-only and centered — deemphasized so it doesn't undermine confidence in the results.
          </AnnNote>
        </div>
      </SectionBlock>

      {/* ── Full flow legend ── */}
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
            Flow Decisions Documented
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                n: "1",
                state: "Intro",
                note: "Warning box gates the flow — high-risk users exit before starting. 3 stats prime credibility. Entry CTA is the only action. No competing paths.",
              },
              {
                n: "2",
                state: "Step / Checklist",
                note: "Progress bar anchors position. Stat callout primes each section. Full-row tap target. Checked state changes entire row background — clear feedback. Back is deemphasized. Final section CTA relabels.",
              },
              {
                n: "3",
                state: "Results",
                note: "Micro-moment precedes score — cognitive pause. Score is display-scale. Per-section breakdown closes the feedback loop. Tier-conditional recommendation. PDF reinforces, doesn't compete. Sources anchor credibility.",
              },
            ].map((item) => (
              <div key={item.n} style={{
                background: "white",
                border: `1px solid ${w.annotation}33`,
                borderRadius: 6,
                padding: "16px 18px",
              }}>
                <Ann n={item.n} label={`State ${item.n} — ${item.state}`} />
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
              Does a multi-step checklist format — rather than a single scrollable form — reduce the perceived burden of 30 questions and create a sense of progress that keeps men moving through the assessment?
            </p>
            <p style={{ fontFamily: font, fontSize: 12, color: w.textMid, marginTop: 10, lineHeight: 1.6 }}>
              The wireframe confirmed that sectioning by body area (Nails / Skin / Pain / Alignment / Footwear) maps to how men already mentally categorize their problems — which is the right framing, not an arbitrary grouping. One section at a time reduces cognitive load. The progress bar (not shown in traditional forms) signals completion is achievable.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
