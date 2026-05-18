/**
 * Generates a doctor-visit PDF for the Men's Sole Revival assessment.
 *
 * Layout mirrors the on-screen results page (components/AssessmentResults.tsx):
 *   1. Brand-900 hero band with vector lockup, eyebrow, title, date
 *   2. "Your results" headline + flag summary line + per-section card grid
 *   3. Optional clinic callout (when recommendsClinic is true)
 *   4. Block 1 — Read & do: 2-col article cards with thumbnail + category
 *      eyebrow + title + "First move:" footer; whole card is hyperlinked
 *   5. Block 2 — Routine to follow: single routine card
 *   6. Block 3 — Talk to a professional: prep bullets
 *   7. Footer: disclaimer + clickable URL
 *
 * Visual fidelity decisions:
 *  - Page background filled with neutral-50 (#F8F7F7) so the white cards
 *    pop the way they do on the live results screen.
 *  - Logo is rendered as vector text (jsPDF's Times Bold for the M,
 *    Times Roman for the wordmark) rather than a raster PNG. Lora isn't
 *    available without font embedding; Times is the closest built-in
 *    serif and renders crisply at any zoom / print DPI.
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

// MSR palette (mirrors app/globals.css)
const C = {
  brand900: "#091016",
  brand500: "#1C3F5E",
  accent500: "#C4703A",
  accent600: "#A35E32",
  accent700: "#8C4520",
  accent50:  "#F4F2F0",
  neutral50: "#F8F7F7",
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

function loadImage(src: string, type: "png" | "jpeg" = "jpeg", maxDim?: number): Promise<string> {
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
  function rectFillAndStroke(x: number, yPos: number, w: number, h: number, fillColor: string, strokeColor: string) {
    doc.setFillColor(fillColor);
    doc.setDrawColor(strokeColor);
    doc.setLineWidth(0.5);
    doc.rect(x, yPos, w, h, "FD");
  }
  function hline(x1: number, y1: number, x2: number, color: string) {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y1);
  }
  function setText(size: number, color: string, weight: "normal" | "bold" = "normal", family: "helvetica" | "times" = "helvetica") {
    doc.setFont(family, weight);
    doc.setFontSize(size);
    doc.setTextColor(color);
  }
  function paintPageBackground() {
    fill(0, 0, W, H, C.neutral50);
  }
  function pageBreakIf(needed: number) {
    if (y + needed > H - 96) {
      doc.addPage();
      paintPageBackground();
      y = M;
    }
  }

  // Paint the neutral-50 page background first so white cards pop.
  paintPageBackground();

  // Preload article thumbnails in parallel
  const articleThumbs = await Promise.all(
    data.articles.map((a) =>
      loadImage(a.imageUrl, "jpeg", 240).catch(() => null)
    )
  );

  // ── Hero band ─────────────────────────────────────────────────────────
  const HEADER_H = 144;
  fill(0, 0, W, HEADER_H, C.brand900);
  fill(0, HEADER_H, W, 3, C.accent500);

  // Vector lockup: serif M + wordmark in Times (closest built-in serif to Lora)
  setText(46, C.white, "bold", "times");
  doc.text("M", M, 78);
  const mW = doc.getTextWidth("M");
  // Vertical rule between M and wordmark
  fill(M + mW + 14, 42, 0.6, 36, C.white);
  // Wordmark
  setText(20, C.white, "normal", "times");
  doc.text("Men's Sole Revival", M + mW + 28, 70);

  // Eyebrow + title (below logo lockup)
  setText(8, C.accent500, "bold");
  doc.text("5-MINUTE SELF-CHECK", M, 108);

  setText(20, C.white, "bold");
  doc.text("The Men's Foot Health Assessment", M, 130);

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
  doc.text(siteText, W - M - siteW, 72);
  doc.link(W - M - siteW - 4, 60, siteW + 8, 16, { url: BASE_URL });

  y = HEADER_H + 40;

  // ── YOUR RESULTS headline ─────────────────────────────────────────────
  setText(9, C.accent600, "bold");
  doc.text("YOUR RESULTS", M, y);
  y += 26;

  setText(22, C.brand900, "bold");
  doc.text("Here's where you stand.", M, y);
  y += 26;

  setText(11, C.neutral700);
  const summary =
    `You flagged ${data.totalFlags} item${data.totalFlags === 1 ? "" : "s"} ` +
    `across the sections you took` +
    (data.notSureCount > 0
      ? `, with ${data.notSureCount} marked "Not sure".`
      : ".");
  const sumLines = doc.splitTextToSize(summary, CW) as string[];
  doc.text(sumLines, M, y);
  y += sumLines.length * 15 + 20;

  // ── Per-section card grid (2-col) ─────────────────────────────────────
  if (data.sections.length > 0) {
    const colW = (CW - 14) / 2;
    const rowH = 56;
    for (let i = 0; i < data.sections.length; i++) {
      const s = data.sections[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = M + col * (colW + 14);
      const cy = y + row * (rowH + 14);
      if (col === 0) pageBreakIf(rowH + 14);
      rectFillAndStroke(cx, cy, colW, rowH, C.white, C.neutral200);

      setText(11, C.neutral700, "bold");
      doc.text(s.title, cx + 16, cy + 24);

      if (s.duration) {
        setText(9, C.neutral500);
        doc.text(`for ${DURATION_LABEL[s.duration]}`, cx + 16, cy + 40);
      }

      setText(9, C.accent600, "bold");
      const countStr = `${s.count} FLAG${s.count === 1 ? "" : "S"}`;
      const cw = doc.getTextWidth(countStr);
      doc.text(countStr, cx + colW - 16 - cw, cy + 24);
    }
    const rows = Math.ceil(data.sections.length / 2);
    y += rows * (rowH + 14) + 28;
  }

  // ── Optional clinic callout ───────────────────────────────────────────
  if (data.recommendsClinic) {
    pageBreakIf(120);
    const calloutBody = data.notSureCount >= 3
      ? "You marked several pain items as Not sure. That interpretive uncertainty is exactly what a 20-minute podiatrist consult is for."
      : "One or more sections came back severe enough that a podiatrist visit is the right next step.";
    const bodyLines = doc.splitTextToSize(calloutBody, CW - 44) as string[];
    const blockH = 30 + bodyLines.length * 16 + 22;

    fill(M, y, 4, blockH, C.accent500);
    fill(M + 4, y, CW - 4, blockH, C.accent50);

    setText(8, C.accent700, "bold");
    doc.text("WORTH A PROFESSIONAL VISIT", M + 20, y + 24);

    setText(11, C.neutral700);
    doc.text(bodyLines, M + 20, y + 44);

    y += blockH + 32;
  }

  // ── Block 1 — Read & do (2-col article cards) ─────────────────────────
  if (data.articles.length > 0) {
    pageBreakIf(90);
    setText(9, C.accent600, "bold");
    doc.text("BLOCK 1", M, y);
    y += 22;
    setText(18, C.brand900, "bold");
    doc.text("Read & do.", M, y);
    y += 22;
    setText(10, C.neutral500);
    doc.text("Each card is a guide plus the first concrete move from it.", M, y);
    y += 24;

    const colW = (CW - 14) / 2;
    const cardH = 144;
    const thumbW = 64;
    const thumbH = 48;

    for (let i = 0; i < data.articles.length; i++) {
      const a = data.articles[i];
      const thumb = articleThumbs[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = M + col * (colW + 14);
      const cy = y + row * (cardH + 14);

      if (col === 0) pageBreakIf(cardH + 14);

      rectFillAndStroke(cx, cy, colW, cardH, C.white, C.neutral200);

      if (thumb) {
        try {
          doc.addImage(thumb, "JPEG", cx + 14, cy + 14, thumbW, thumbH);
        } catch {/* tolerate broken thumbs */}
      } else {
        fill(cx + 14, cy + 14, thumbW, thumbH, C.neutral200);
      }

      const textX = cx + 14 + thumbW + 14;
      const textW = colW - (14 + thumbW + 14) - 14;

      setText(8, C.accent600, "bold");
      const cat = `${a.category.toUpperCase()} · ${a.readTime.toUpperCase()} READ`;
      doc.text(cat, textX, cy + 24);

      setText(11, C.brand900, "bold");
      const titleLines = doc.splitTextToSize(a.title, textW) as string[];
      doc.text(titleLines.slice(0, 3), textX, cy + 40);

      // Footer separator + first-move copy
      const footerY = cy + 84;
      hline(cx, footerY, cx + colW, C.neutral200);

      setText(8, C.brand500, "bold");
      doc.text("FIRST MOVE:", cx + 14, footerY + 18);

      setText(10, C.neutral700);
      const actionLines = doc.splitTextToSize(a.action, colW - 28) as string[];
      doc.text(actionLines.slice(0, 3), cx + 14, footerY + 34);

      doc.link(cx, cy, colW, cardH, { url: `${BASE_URL}/guides/${a.slug}` });
    }
    const rows = Math.ceil(data.articles.length / 2);
    y += rows * (cardH + 14) + 32;
  }

  // ── Block 2 — Routine to follow ───────────────────────────────────────
  if (data.routine) {
    pageBreakIf(180);
    setText(9, C.accent600, "bold");
    doc.text("BLOCK 2", M, y);
    y += 22;
    setText(18, C.brand900, "bold");
    doc.text("Routine to follow.", M, y);
    y += 22;
    setText(10, C.neutral500);
    doc.text("One specific starting point, not a list.", M, y);
    y += 24;

    const r = data.routine;
    const cardH = 110;
    rectFillAndStroke(M, y, CW, cardH, C.white, C.neutral200);

    setText(8, C.brand500, "bold");
    doc.text(`ROUTINE · ${r.label.toUpperCase()}`, M + 20, y + 24);

    setText(14, C.brand900, "bold");
    doc.text(r.heading, M + 20, y + 46);

    setText(9, C.neutral500);
    doc.text(r.time, M + 20, y + 62);

    const footerY = y + 76;
    hline(M, footerY, M + CW, C.neutral200);
    setText(8, C.brand500, "bold");
    doc.text("FIRST MOVE:", M + 20, footerY + 20);
    setText(10, C.neutral700);
    const actionLines = doc.splitTextToSize(r.action, CW - 40) as string[];
    doc.text(actionLines.slice(0, 2), M + 20, footerY + 34);

    y += cardH + 32;
  }

  // ── Block 3 — Talk to a professional ──────────────────────────────────
  pageBreakIf(90);
  setText(9, C.accent600, "bold");
  doc.text("BLOCK 3", M, y);
  y += 22;
  setText(18, C.brand900, "bold");
  doc.text("Talk to a professional.", M, y);
  y += 22;
  setText(10, C.neutral500);
  doc.text("Read these to your podiatrist. They cover what you came to say.", M, y);
  y += 24;

  if (data.prepBullets.length > 0) {
    const lineH = 16;
    let totalLines = 0;
    const wrapped: string[][] = data.prepBullets.map((b) => {
      const lines = doc.splitTextToSize(b, CW - 40) as string[];
      totalLines += lines.length;
      return lines;
    });
    const blockH = totalLines * lineH + (data.prepBullets.length - 1) * 14 + 32;
    pageBreakIf(blockH + 12);

    fill(M, y, 3, blockH, C.brand500);
    rectFillAndStroke(M + 3, y, CW - 3, blockH, C.white, C.neutral200);

    let by = y + 22;
    setText(11, C.neutral700);
    for (let i = 0; i < wrapped.length; i++) {
      const lines = wrapped[i];
      doc.setFillColor(C.brand500);
      doc.circle(M + 18, by - 3, 1.8, "F");
      doc.text(lines, M + 28, by);
      by += lines.length * lineH;
      if (i < wrapped.length - 1) by += 14;
    }
    y += blockH + 24;
  } else {
    rectFillAndStroke(M, y, CW, 56, C.white, C.neutral200);
    setText(11, C.neutral500);
    const fb = doc.splitTextToSize(
      "Nothing in this self-check rises to the level of a podiatrist visit. Re-take in a few months if anything changes.",
      CW - 28
    );
    doc.text(fb, M + 14, y + 22);
    y += 56 + 24;
  }

  // Find a podiatrist link
  setText(9, C.accent600, "bold");
  doc.text("FIND A PODIATRIST NEAR YOU →", M, y);
  const apmaW = doc.getTextWidth("FIND A PODIATRIST NEAR YOU →");
  doc.link(M, y - 10, apmaW + 6, 14, { url: "https://www.apma.org/find-a-podiatrist" });
  y += 32;

  // ── Footer ────────────────────────────────────────────────────────────
  pageBreakIf(72);
  hline(M, y, M + CW, C.neutral200);
  y += 22;
  setText(9, C.neutral400);
  doc.text("This self-check is educational. It is not medical advice or a diagnosis.", M, y);
  y += 14;
  doc.text("Bring this with you, but trust the podiatrist's read of what's in front of them.", M, y);
  y += 24;

  setText(10, C.accent600, "bold");
  doc.text("menssolerevival.com", M, y);
  const footerLinkW = doc.getTextWidth("menssolerevival.com");
  doc.link(M, y - 12, footerLinkW + 4, 16, { url: BASE_URL });

  doc.save("MSR-Foot-Health-Self-Check.pdf");
}
