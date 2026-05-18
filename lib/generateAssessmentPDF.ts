/**
 * Generates a doctor-visit PDF for the Men's Sole Revival assessment.
 *
 * Layout mirrors the on-screen results page (components/AssessmentResults.tsx):
 *   1. Brand-900 hero band with the MSR lockup, eyebrow, title, date
 *   2. "Your results" headline + flag summary line + per-section grid
 *   3. Optional clinic callout (when recommendsClinic is true)
 *   4. Block 1 — Read & do: 2-col article cards with thumbnail + category
 *      eyebrow + title + "First move:" footer; each title is hyperlinked
 *   5. Block 2 — Routine to follow: single routine card with label, heading,
 *      time, "First move:" footer
 *   6. Block 3 — Talk to a professional: prep bullets (or empty-state)
 *   7. Footer: disclaimer + clickable URL
 */

import type { RoutineRef, ArticleMeta } from "@/lib/ecosystem";
import type { Duration } from "@/lib/assessment-routing";

export interface PDFSection {
  title: string;
  count: number;
  items: string[];
  duration?: Duration;
  guideHref: string;
}

export interface AssessmentData {
  totalFlags: number;
  notSureCount: number;
  recommendsClinic: boolean;
  sections: PDFSection[];
  prepBullets: string[];
  routine?: RoutineRef;
  articles: ArticleMeta[];
}

// MSR palette (from app/globals.css)
const C = {
  brand900: "#091016",
  brand500: "#1C3F5E",
  accent500: "#C4703A",
  accent600: "#A35E32",
  accent700: "#8C4520",
  accent50:  "#F4F2F0",
  neutral100:"#EEEDEC",
  neutral200:"#D6D3D1",
  neutral300:"#B7B2AE",
  neutral400:"#938C86",
  neutral500:"#6B6560",
  neutral700:"#403D3A",
  neutral900:"#1D1C1B",
  white:     "#FFFFFF",
} as const;

const BASE_URL = "https://www.menssolerevival.com";

const DURATION_LABEL: Record<Duration, string> = {
  recent:  "less than a month",
  ongoing: "1 to 6 months",
  chronic: "more than 6 months",
};

function loadImage(src: string, type: "png" | "jpeg" = "png", maxDim?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (maxDim && Math.max(w, h) > maxDim) {
        const ratio = maxDim / Math.max(w, h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL(`image/${type}`, type === "jpeg" ? 0.82 : undefined));
    };
    img.onerror = reject;
    img.src = src;
  });
}

// ─────────────────────────────────────────────────────────────────────────

export async function generateAssessmentPDF(data: AssessmentData) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();   // 612
  const H = doc.internal.pageSize.getHeight();  // 792
  const M = 56;
  const CW = W - M * 2;                          // 500
  let y = 0;

  function fill(x: number, yPos: number, w: number, h: number, color: string) {
    doc.setFillColor(color);
    doc.rect(x, yPos, w, h, "F");
  }
  function rectStroke(x: number, yPos: number, w: number, h: number, color: string) {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.rect(x, yPos, w, h, "S");
  }
  function hline(x1: number, y1: number, x2: number, color: string) {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y1);
  }
  function setText(size: number, color: string, weight: "normal" | "bold" = "normal") {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    doc.setTextColor(color);
  }
  function pageBreakIf(needed: number) {
    if (y + needed > H - 96) {
      doc.addPage();
      y = M;
    }
  }

  // Preload all images in parallel before drawing the document.
  const logoData = await loadImage("/logo-msr-lockup-light.png", "png").catch(() => null);
  const articleThumbs = await Promise.all(
    data.articles.map((a) =>
      loadImage(a.imageUrl, "jpeg", 240).catch(() => null)
    )
  );

  // ── Header band ───────────────────────────────────────────────────────
  const HEADER_H = 136;
  fill(0, 0, W, HEADER_H, C.brand900);
  fill(0, HEADER_H, W, 3, C.accent500);

  if (logoData) {
    doc.addImage(logoData, "PNG", M, 30, 170, 32);
  }

  setText(8, C.accent500, "bold");
  doc.text("5-MINUTE SELF-CHECK", M, 90);

  setText(20, C.white, "bold");
  doc.text("The Men's Foot Health Assessment", M, 116);

  // Date + clickable URL right-aligned
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  setText(9, C.neutral300);
  const dateW = doc.getTextWidth(dateStr);
  doc.text(dateStr, W - M - dateW, 50);

  setText(9, C.accent500, "bold");
  const siteText = "menssolerevival.com";
  const siteW = doc.getTextWidth(siteText);
  doc.text(siteText, W - M - siteW, 70);
  doc.link(W - M - siteW - 4, 58, siteW + 8, 16, { url: BASE_URL });

  y = HEADER_H + 36;

  // ── YOUR RESULTS headline ─────────────────────────────────────────────
  setText(9, C.accent600, "bold");
  doc.text("YOUR RESULTS", M, y);
  y += 22;

  setText(20, C.brand900, "bold");
  doc.text("Here's where you stand.", M, y);
  y += 22;

  setText(11, C.neutral700);
  const summary =
    `You flagged ${data.totalFlags} item${data.totalFlags === 1 ? "" : "s"} ` +
    `across the sections you took` +
    (data.notSureCount > 0
      ? `, with ${data.notSureCount} marked "Not sure".`
      : ".");
  const sumLines = doc.splitTextToSize(summary, CW) as string[];
  doc.text(sumLines, M, y);
  y += sumLines.length * 15 + 14;

  // ── Per-section grid (2-col) ──────────────────────────────────────────
  if (data.sections.length > 0) {
    const colW = (CW - 12) / 2;
    const rowH = 48;
    for (let i = 0; i < data.sections.length; i++) {
      const s = data.sections[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = M + col * (colW + 12);
      const cy = y + row * (rowH + 12);
      pageBreakIf(rowH + 12);
      fill(cx, cy, colW, rowH, C.white);
      rectStroke(cx, cy, colW, rowH, C.neutral200);

      setText(11, C.neutral700, "bold");
      doc.text(s.title, cx + 14, cy + 22);

      if (s.duration) {
        setText(9, C.neutral500);
        doc.text(`for ${DURATION_LABEL[s.duration]}`, cx + 14, cy + 36);
      }

      setText(9, C.accent600, "bold");
      const countStr = `${s.count} FLAG${s.count === 1 ? "" : "S"}`;
      const cw = doc.getTextWidth(countStr);
      doc.text(countStr, cx + colW - 14 - cw, cy + 22);
    }
    const rows = Math.ceil(data.sections.length / 2);
    y += rows * (rowH + 12) + 16;
  }

  // ── Optional clinic callout ───────────────────────────────────────────
  if (data.recommendsClinic) {
    pageBreakIf(100);
    const calloutBody = data.notSureCount >= 3
      ? "You marked several pain items as Not sure. That interpretive uncertainty is exactly what a 20-minute podiatrist consult is for."
      : "One or more sections came back severe enough that a podiatrist visit is the right next step.";
    const bodyLines = doc.splitTextToSize(calloutBody, CW - 40) as string[];
    const blockH = 26 + bodyLines.length * 15 + 18;

    fill(M, y, 4, blockH, C.accent500);
    fill(M + 4, y, CW - 4, blockH, C.accent50);

    setText(8, C.accent700, "bold");
    doc.text("WORTH A PROFESSIONAL VISIT", M + 18, y + 22);

    setText(11, C.neutral700);
    doc.text(bodyLines, M + 18, y + 40);

    y += blockH + 20;
  }

  // ── Block 1 — Read & do (2-col article cards) ─────────────────────────
  if (data.articles.length > 0) {
    pageBreakIf(80);
    setText(9, C.accent600, "bold");
    doc.text("BLOCK 1", M, y);
    y += 18;
    setText(18, C.brand900, "bold");
    doc.text("Read & do.", M, y);
    y += 20;
    setText(10, C.neutral500);
    doc.text("Each card is a guide plus the first concrete move from it.", M, y);
    y += 18;

    const colW = (CW - 12) / 2;
    const cardH = 138;
    const thumbW = 60;
    const thumbH = 44;

    for (let i = 0; i < data.articles.length; i++) {
      const a = data.articles[i];
      const thumb = articleThumbs[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = M + col * (colW + 12);
      const cy = y + row * (cardH + 12);

      // Page break if next row of cards would overflow
      if (col === 0) pageBreakIf(cardH + 12);

      // Card background + border
      fill(cx, cy, colW, cardH, C.white);
      rectStroke(cx, cy, colW, cardH, C.neutral200);

      // Header section (thumb + text)
      if (thumb) {
        try {
          doc.addImage(thumb, "JPEG", cx + 14, cy + 14, thumbW, thumbH);
        } catch {/* tolerate broken thumbs */}
      } else {
        fill(cx + 14, cy + 14, thumbW, thumbH, C.neutral200);
      }

      const textX = cx + 14 + thumbW + 12;
      const textW = colW - (14 + thumbW + 12) - 14;

      // Category eyebrow
      setText(8, C.accent600, "bold");
      const cat = `${a.category.toUpperCase()} · ${a.readTime.toUpperCase()} READ`;
      doc.text(cat, textX, cy + 24);

      // Title (clickable)
      setText(11, C.brand900, "bold");
      const titleLines = doc.splitTextToSize(a.title, textW) as string[];
      doc.text(titleLines.slice(0, 3), textX, cy + 38);

      // Footer separator
      const footerY = cy + 80;
      hline(cx, footerY, cx + colW, C.neutral200);

      // First move footer
      setText(8, C.brand500, "bold");
      doc.text("FIRST MOVE:", cx + 14, footerY + 16);

      setText(10, C.neutral700);
      const actionLines = doc.splitTextToSize(a.action, colW - 28) as string[];
      doc.text(actionLines.slice(0, 3), cx + 14, footerY + 30);

      // Whole card is a clickable link to the article
      doc.link(cx, cy, colW, cardH, { url: `${BASE_URL}/guides/${a.slug}` });
    }
    const rows = Math.ceil(data.articles.length / 2);
    y += rows * (cardH + 12) + 16;
  }

  // ── Block 2 — Routine to follow ───────────────────────────────────────
  if (data.routine) {
    pageBreakIf(160);
    setText(9, C.accent600, "bold");
    doc.text("BLOCK 2", M, y);
    y += 18;
    setText(18, C.brand900, "bold");
    doc.text("Routine to follow.", M, y);
    y += 20;
    setText(10, C.neutral500);
    doc.text("One specific starting point, not a list.", M, y);
    y += 18;

    const r = data.routine;
    const cardH = 102;
    fill(M, y, CW, cardH, C.white);
    rectStroke(M, y, CW, cardH, C.neutral200);

    setText(8, C.brand500, "bold");
    doc.text(`ROUTINE · ${r.label.toUpperCase()}`, M + 18, y + 22);

    setText(14, C.brand900, "bold");
    doc.text(r.heading, M + 18, y + 42);

    setText(9, C.neutral500);
    doc.text(r.time, M + 18, y + 58);

    const footerY = y + 70;
    hline(M, footerY, M + CW, C.neutral200);
    setText(8, C.brand500, "bold");
    doc.text("FIRST MOVE:", M + 18, footerY + 18);
    setText(10, C.neutral700);
    const actionLines = doc.splitTextToSize(r.action, CW - 36) as string[];
    doc.text(actionLines.slice(0, 2), M + 18, footerY + 30);

    y += cardH + 24;
  }

  // ── Block 3 — Talk to a professional ──────────────────────────────────
  pageBreakIf(80);
  setText(9, C.accent600, "bold");
  doc.text("BLOCK 3", M, y);
  y += 18;
  setText(18, C.brand900, "bold");
  doc.text("Talk to a professional.", M, y);
  y += 20;
  setText(10, C.neutral500);
  doc.text("Read these to your podiatrist. They cover what you came to say.", M, y);
  y += 18;

  if (data.prepBullets.length > 0) {
    const lineH = 16;
    let totalLines = 0;
    const wrapped: string[][] = data.prepBullets.map((b) => {
      const lines = doc.splitTextToSize(b, CW - 36) as string[];
      totalLines += lines.length;
      return lines;
    });
    const blockH = totalLines * lineH + (data.prepBullets.length - 1) * 12 + 24;
    pageBreakIf(blockH);

    fill(M, y, 3, blockH, C.brand500);
    fill(M + 3, y, CW - 3, blockH, C.white);

    let by = y + 18;
    setText(11, C.neutral700);
    for (let i = 0; i < wrapped.length; i++) {
      const lines = wrapped[i];
      doc.setFillColor(C.brand500);
      doc.circle(M + 16, by - 3, 1.6, "F");
      doc.text(lines, M + 24, by);
      by += lines.length * lineH;
      if (i < wrapped.length - 1) by += 12;
    }
    y += blockH + 16;
  } else {
    setText(11, C.neutral500);
    const fb = doc.splitTextToSize(
      "Nothing in this self-check rises to the level of a podiatrist visit. Re-take in a few months if anything changes.",
      CW
    );
    doc.text(fb, M, y);
    y += (fb as string[]).length * 15 + 14;
  }

  // Find-a-podiatrist link
  setText(9, C.accent600, "bold");
  doc.text("FIND A PODIATRIST NEAR YOU →", M, y);
  const apmaW = doc.getTextWidth("FIND A PODIATRIST NEAR YOU →");
  doc.link(M, y - 10, apmaW + 6, 14, { url: "https://www.apma.org/find-a-podiatrist" });
  y += 24;

  // ── Footer ────────────────────────────────────────────────────────────
  pageBreakIf(64);
  hline(M, y, M + CW, C.neutral200);
  y += 20;
  setText(9, C.neutral400);
  doc.text("This self-check is educational. It is not medical advice or a diagnosis.", M, y);
  y += 14;
  doc.text("Bring this with you, but trust the podiatrist's read of what's in front of them.", M, y);
  y += 22;

  setText(10, C.accent600, "bold");
  doc.text("menssolerevival.com", M, y);
  const footerLinkW = doc.getTextWidth("menssolerevival.com");
  doc.link(M, y - 12, footerLinkW + 4, 16, { url: BASE_URL });

  doc.save("MSR-Foot-Health-Self-Check.pdf");
}
