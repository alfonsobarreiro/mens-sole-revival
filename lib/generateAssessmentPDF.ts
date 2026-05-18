/**
 * Generates a doctor-visit PDF for the Men's Sole Revival assessment.
 *
 * Per MSR-Assessment-Redesign.md §3.5, the PDF is reframed as a
 * podiatrist-visit artifact — a single-page handout the user can read
 * to their doctor. Layout:
 *
 *   1. Header band:  "Bring this to your podiatrist" + date
 *   2. Context line: "Self-check completed [date]. X flags across N sections."
 *   3. Block 1:      "Talk to your doctor about" — prep bullets (top of doc)
 *   4. Block 2:      "What I flagged" — per-section checked items + duration
 *   5. Block 3:      "What I'm doing in the meantime" — routine + articles
 *   6. Footer:       Disclaimer + url
 *
 * The previous layout (centered "YOUR RESULTS" tile with giant flag
 * count and a tier label) was the pre-redesign output. It's gone now.
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

// ── Brand tokens (mirrors globals.css MSR palette) ──────────────────────
const C = {
  brand900: "#091016",
  brand500: "#1C3F5E",
  accent500: "#C4703A",
  accent600: "#A35E32",
  accent50:  "#F4F2F0",
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

// ─────────────────────────────────────────────────────────────────────────

export async function generateAssessmentPDF(data: AssessmentData) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();   // 612
  const H = doc.internal.pageSize.getHeight();  // 792
  const M = 48;
  const CW = W - M * 2;
  let y = 0;

  function fill(x: number, yPos: number, w: number, h: number, color: string) {
    doc.setFillColor(color);
    doc.rect(x, yPos, w, h, "F");
  }
  function hline(x1: number, y1: number, x2: number, color: string) {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y1);
  }
  function pageBreakIf(needed: number) {
    if (y + needed > H - 60) {
      doc.addPage();
      y = M;
    }
  }
  function setText(size: number, color: string, weight: "normal" | "bold" = "normal") {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    doc.setTextColor(color);
  }

  // ── Header band ───────────────────────────────────────────────────────
  const HEADER_H = 96;
  fill(0, 0, W, HEADER_H, C.brand900);
  // Accent rule below header
  fill(0, HEADER_H, W, 3, C.accent500);

  setText(8, C.accent500, "bold");
  doc.text("BRING THIS TO YOUR PODIATRIST", M, 36);

  setText(20, C.white, "bold");
  doc.text("Men's Foot Health Self-Check", M, 62);

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  setText(9, C.neutral300);
  doc.text(dateStr, M, 80);

  // Site attribution on right of header
  setText(8, C.neutral300);
  const siteText = "menssolerevival.com";
  const siteW = doc.getTextWidth(siteText);
  doc.text(siteText, W - M - siteW, 36);

  y = HEADER_H + 28;

  // ── Quick context line ────────────────────────────────────────────────
  setText(10, C.neutral700);
  const attempted = data.sections.length;
  const ctx = `${data.totalFlags} flagged item${data.totalFlags === 1 ? "" : "s"} across ${attempted} section${attempted === 1 ? "" : "s"}${
    data.notSureCount > 0 ? `, with ${data.notSureCount} marked "Not sure"` : ""
  }.`;
  doc.text(ctx, M, y);
  y += 14;

  if (data.recommendsClinic) {
    setText(9, C.accent600, "bold");
    doc.text("This self-check suggests a podiatrist visit is the right next step.", M, y);
    y += 16;
  }
  y += 8;

  // ── Block 1: Talk to your doctor about ────────────────────────────────
  setText(8, C.accent600, "bold");
  doc.text("TALK TO YOUR DOCTOR ABOUT", M, y);
  y += 14;

  if (data.prepBullets.length > 0) {
    const bullets = data.prepBullets;
    // Compute block height: each bullet wraps to ~2 lines of 11pt text
    const lineH = 14;
    let totalLines = 0;
    const wrapped: string[][] = bullets.map((b) => {
      const lines = doc.splitTextToSize(b, CW - 32) as string[];
      totalLines += lines.length;
      return lines;
    });
    const blockH = totalLines * lineH + bullets.length * 8 + 16;
    pageBreakIf(blockH);

    // Left accent rule
    fill(M, y, 3, blockH, C.accent500);
    fill(M + 3, y, CW - 3, blockH, C.white);
    doc.setDrawColor(C.neutral200);
    doc.setLineWidth(0.5);
    doc.rect(M + 3, y, CW - 3, blockH, "S");

    let by = y + 12;
    setText(11, C.neutral900);
    for (const lines of wrapped) {
      // Bullet
      doc.setFillColor(C.accent500);
      doc.circle(M + 18, by - 3, 1.6, "F");
      doc.text(lines, M + 26, by);
      by += lines.length * lineH + 8;
    }
    y += blockH + 16;
  } else {
    setText(10, C.neutral500);
    const fb = doc.splitTextToSize(
      "Nothing in this self-check rises to the level of a podiatrist conversation. This is a maintenance check.",
      CW
    );
    doc.text(fb, M, y);
    y += (fb as string[]).length * 13 + 16;
  }

  // ── Block 2: What I flagged ───────────────────────────────────────────
  const flaggedSections = data.sections.filter((s) => s.count > 0);
  if (flaggedSections.length > 0) {
    pageBreakIf(30);
    setText(8, C.accent600, "bold");
    doc.text("WHAT I FLAGGED", M, y);
    y += 14;

    for (const section of flaggedSections) {
      // Per-section header line: title + duration + count
      const headerLineH = 18;
      pageBreakIf(headerLineH + section.items.length * 14 + 16);

      setText(11, C.brand900, "bold");
      doc.text(section.title, M, y);
      const titleW = doc.getTextWidth(section.title);

      if (section.duration) {
        setText(9, C.neutral500);
        doc.text(`— for ${DURATION_LABEL[section.duration]}`, M + titleW + 6, y);
      }

      // Count on right
      setText(9, C.accent600, "bold");
      const countStr = `${section.count} flag${section.count === 1 ? "" : "s"}`;
      const countW = doc.getTextWidth(countStr);
      doc.text(countStr.toUpperCase(), W - M - countW, y);

      y += headerLineH;

      // Item bullets
      setText(10, C.neutral700);
      for (const item of section.items) {
        const lines = doc.splitTextToSize(item, CW - 24) as string[];
        pageBreakIf(lines.length * 13 + 4);
        doc.setFillColor(C.accent500);
        doc.circle(M + 10, y - 3, 1.4, "F");
        doc.text(lines, M + 20, y);
        y += lines.length * 13 + 2;
      }

      y += 8;
      hline(M, y, M + CW, C.neutral200);
      y += 12;
    }
  }

  // ── Block 3: What I'm doing in the meantime ───────────────────────────
  const hasRoutine = Boolean(data.routine);
  const hasArticles = data.articles.length > 0;
  if (hasRoutine || hasArticles) {
    pageBreakIf(40);
    setText(8, C.accent600, "bold");
    doc.text("WHAT I'M DOING IN THE MEANTIME", M, y);
    y += 14;

    if (hasRoutine && data.routine) {
      const r = data.routine;
      pageBreakIf(42);
      setText(8, C.brand500, "bold");
      doc.text(`ROUTINE · ${r.label.toUpperCase()}`, M, y);
      y += 12;
      setText(11, C.neutral900, "bold");
      doc.text(r.heading, M, y);
      y += 14;
      setText(9, C.neutral500);
      doc.text(r.time, M, y);
      y += 14;
      setText(10, C.neutral700);
      const aLines = doc.splitTextToSize(r.action, CW) as string[];
      doc.text(aLines, M, y);
      y += aLines.length * 13 + 12;
    }

    if (hasArticles) {
      pageBreakIf(16 + data.articles.length * 16);
      setText(8, C.brand500, "bold");
      doc.text("ARTICLES I'M READING", M, y);
      y += 14;
      setText(10, C.neutral700);
      for (const a of data.articles) {
        pageBreakIf(16);
        // Bullet
        doc.setFillColor(C.brand500);
        doc.circle(M + 10, y - 3, 1.4, "F");
        doc.text(a.title, M + 20, y);
        y += 16;
      }
      y += 4;
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────
  pageBreakIf(56);
  hline(M, y, M + CW, C.neutral200);
  y += 14;
  setText(8, C.neutral400);
  doc.text("This self-check is educational. It is not medical advice or a diagnosis.", M, y);
  y += 12;
  doc.text("Bring this with you, but trust the podiatrist's read of what's in front of them.", M, y);
  y += 18;

  setText(9, C.accent600, "bold");
  doc.text("menssolerevival.com", M, y);
  doc.link(M, y - 10, 130, 14, { url: BASE_URL });

  doc.save("MSR-Foot-Health-Self-Check.pdf");
}
