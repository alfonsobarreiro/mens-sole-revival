/**
 * Generates a doctor-visit PDF for the Men's Sole Revival assessment.
 *
 * Per MSR-Assessment-Redesign.md §3.5, the PDF is reframed as a
 * podiatrist-visit artifact — a single-page handout the user can read
 * to their doctor. Layout:
 *
 *   1. Header band:  MSR lockup logo + "For your podiatrist visit"
 *                    + date + clickable URL
 *   2. Context line: "X flagged items across N sections, with Y not sure."
 *   3. Block 1:      "Talk to your doctor about" — prep bullets
 *   4. Block 2:      "What I flagged" — per-section checked items + duration
 *   5. Block 3:      "What I'm doing in the meantime" — routine + articles
 *                    (each article title is hyperlinked to its guide URL)
 *   6. Footer:       Disclaimer + clickable website URL
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

// ── Load a PNG (transparent-aware) as base64 ────────────────────────────
function loadPNGAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      // PNG preserves transparency — needed for the light lockup over
      // the brand-900 header band.
      resolve(canvas.toDataURL("image/png"));
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
    if (y + needed > H - 80) {
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
  const HEADER_H = 132;
  fill(0, 0, W, HEADER_H, C.brand900);
  fill(0, HEADER_H, W, 3, C.accent500); // accent rule under the band

  // Logo (lockup-light = white M + wordmark on transparent bg)
  let logoFailed = false;
  try {
    const logoData = await loadPNGAsBase64("/logo-msr-lockup-light.png");
    // Original PNG is 320×60. Draw at h=32 → w=170, top-left of header.
    doc.addImage(logoData, "PNG", M, 32, 170, 32);
  } catch {
    logoFailed = true;
  }

  // Eyebrow + secondary title (sits under the logo)
  setText(8, C.accent500, "bold");
  doc.text("FOR YOUR PODIATRIST VISIT", M, 90);

  setText(16, C.white, "bold");
  doc.text(logoFailed ? "Men's Foot Health Self-Check" : "Self-check results", M, 110);

  // Date + site link (right-aligned)
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  setText(9, C.neutral300);
  const dateW = doc.getTextWidth(dateStr);
  doc.text(dateStr, W - M - dateW, 50);

  // Site URL (right side, hyperlinked)
  setText(9, C.accent500, "bold");
  const siteText = "menssolerevival.com";
  const siteW = doc.getTextWidth(siteText);
  doc.text(siteText, W - M - siteW, 70);
  doc.link(W - M - siteW - 4, 58, siteW + 8, 16, { url: BASE_URL });

  y = HEADER_H + 40;

  // ── Quick context line ────────────────────────────────────────────────
  setText(11, C.neutral700);
  const attempted = data.sections.length;
  const ctx =
    `${data.totalFlags} flagged item${data.totalFlags === 1 ? "" : "s"} ` +
    `across ${attempted} section${attempted === 1 ? "" : "s"}` +
    (data.notSureCount > 0
      ? `, with ${data.notSureCount} marked "Not sure".`
      : ".");
  doc.text(ctx, M, y);
  y += 20;

  if (data.recommendsClinic) {
    setText(10, C.accent600, "bold");
    doc.text(
      "This self-check suggests a podiatrist visit is the right next step.",
      M,
      y
    );
    y += 20;
  }
  y += 16;

  // ── Block 1: Talk to your doctor about ────────────────────────────────
  setText(8, C.accent600, "bold");
  doc.text("TALK TO YOUR DOCTOR ABOUT", M, y);
  y += 22;

  if (data.prepBullets.length > 0) {
    const bullets = data.prepBullets;
    const lineH = 16;
    const padBetween = 14;
    let totalLines = 0;
    const wrapped: string[][] = bullets.map((b) => {
      const lines = doc.splitTextToSize(b, CW - 44) as string[];
      totalLines += lines.length;
      return lines;
    });
    const blockH =
      totalLines * lineH +
      (bullets.length - 1) * padBetween +
      28; // top + bottom padding
    pageBreakIf(blockH);

    // Left accent rule
    fill(M, y, 4, blockH, C.accent500);
    fill(M + 4, y, CW - 4, blockH, C.white);
    doc.setDrawColor(C.neutral200);
    doc.setLineWidth(0.5);
    doc.rect(M + 4, y, CW - 4, blockH, "S");

    let by = y + 18;
    setText(11, C.neutral900);
    for (let i = 0; i < wrapped.length; i++) {
      const lines = wrapped[i];
      doc.setFillColor(C.accent500);
      doc.circle(M + 22, by - 3, 1.8, "F");
      doc.text(lines, M + 32, by);
      by += lines.length * lineH;
      if (i < wrapped.length - 1) by += padBetween;
    }
    y += blockH + 28;
  } else {
    setText(11, C.neutral500);
    const fb = doc.splitTextToSize(
      "Nothing in this self-check rises to the level of a podiatrist conversation. This is a maintenance check.",
      CW
    );
    doc.text(fb, M, y);
    y += (fb as string[]).length * 15 + 24;
  }

  // ── Block 2: What I flagged ───────────────────────────────────────────
  const flaggedSections = data.sections.filter((s) => s.count > 0);
  if (flaggedSections.length > 0) {
    pageBreakIf(40);
    setText(8, C.accent600, "bold");
    doc.text("WHAT I FLAGGED", M, y);
    y += 22;

    for (const section of flaggedSections) {
      const headerLineH = 22;
      pageBreakIf(headerLineH + section.items.length * 18 + 24);

      // Section header
      setText(12, C.brand900, "bold");
      doc.text(section.title, M, y);
      const titleW = doc.getTextWidth(section.title);

      if (section.duration) {
        setText(10, C.neutral500);
        doc.text(`— for ${DURATION_LABEL[section.duration]}`, M + titleW + 8, y);
      }

      setText(9, C.accent600, "bold");
      const countStr = `${section.count} FLAG${section.count === 1 ? "" : "S"}`;
      const countW = doc.getTextWidth(countStr);
      doc.text(countStr, W - M - countW, y);

      y += headerLineH;

      setText(11, C.neutral700);
      for (const item of section.items) {
        const lines = doc.splitTextToSize(item, CW - 28) as string[];
        pageBreakIf(lines.length * 15 + 6);
        doc.setFillColor(C.accent500);
        doc.circle(M + 12, y - 3, 1.6, "F");
        doc.text(lines, M + 24, y);
        y += lines.length * 15 + 4;
      }

      y += 14;
      hline(M, y, M + CW, C.neutral200);
      y += 20;
    }
  }

  // ── Block 3: What I'm doing in the meantime ───────────────────────────
  const hasRoutine = Boolean(data.routine);
  const hasArticles = data.articles.length > 0;
  if (hasRoutine || hasArticles) {
    pageBreakIf(50);
    setText(8, C.accent600, "bold");
    doc.text("WHAT I'M DOING IN THE MEANTIME", M, y);
    y += 22;

    if (hasRoutine && data.routine) {
      const r = data.routine;
      pageBreakIf(80);
      setText(8, C.brand500, "bold");
      doc.text(`ROUTINE · ${r.label.toUpperCase()}`, M, y);
      y += 18;
      setText(12, C.neutral900, "bold");
      doc.text(r.heading, M, y);
      y += 20;
      setText(10, C.neutral500);
      doc.text(r.time, M, y);
      y += 20;
      setText(11, C.neutral700);
      const aLines = doc.splitTextToSize(r.action, CW) as string[];
      doc.text(aLines, M, y);
      y += aLines.length * 15 + 24;
    }

    if (hasArticles) {
      pageBreakIf(20 + data.articles.length * 24);
      setText(8, C.brand500, "bold");
      doc.text("ARTICLES I'M READING", M, y);
      y += 22;

      setText(11, C.brand500); // links read as primary-brand color
      for (const a of data.articles) {
        const lines = doc.splitTextToSize(a.title, CW - 28) as string[];
        pageBreakIf(lines.length * 16 + 6);

        // Bullet
        doc.setFillColor(C.brand500);
        doc.circle(M + 12, y - 3, 1.6, "F");

        // Title (clickable)
        doc.text(lines, M + 24, y);
        const linkW = CW - 24;
        const linkH = lines.length * 16;
        doc.link(M + 24, y - 12, linkW, linkH, {
          url: `${BASE_URL}/guides/${a.slug}`,
        });

        y += lines.length * 16 + 6;
      }
      y += 12;
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────
  pageBreakIf(80);
  y += 12;
  hline(M, y, M + CW, C.neutral200);
  y += 22;

  setText(9, C.neutral400);
  doc.text(
    "This self-check is educational. It is not medical advice or a diagnosis.",
    M,
    y
  );
  y += 16;
  doc.text(
    "Bring this with you, but trust the podiatrist's read of what's in front of them.",
    M,
    y
  );
  y += 28;

  setText(10, C.accent600, "bold");
  doc.text("menssolerevival.com", M, y);
  const footerLinkW = doc.getTextWidth("menssolerevival.com");
  doc.link(M, y - 12, footerLinkW + 4, 16, { url: BASE_URL });

  doc.save("MSR-Foot-Health-Self-Check.pdf");
}
