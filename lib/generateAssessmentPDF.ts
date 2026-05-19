/**
 * Generates a doctor-visit PDF for the Men's Sole Revival assessment.
 *
 * Matches the live results page (components/AssessmentResults.tsx) for
 * visual fidelity: same brand palette, same card structure, AND the
 * three brand fonts embedded directly so typography reads identically.
 *
 *   - Barlow Condensed Bold → display headlines (font-display)
 *   - DM Sans Regular / Medium / Bold → body, UI, eyebrows (default UI font)
 *   - Lora Regular / Bold → wordmark in the logo lockup
 *
 * Fonts ship as static TTFs in /public/fonts/. They're fetched once per
 * PDF generation, base64-encoded, and registered with jsPDF. Each font
 * adds ~300 KB to the output, which is acceptable for a single-page
 * artifact users save + print.
 *
 * Layout (top → bottom):
 *   1. Brand-900 hero band with vector lockup, eyebrow, title, date
 *   2. "Your results" headline + flag summary + per-section card grid
 *   3. Optional clinic callout (when recommendsClinic is true)
 *   4. Block 1 — Read & do: 2-col article cards with thumbnail + category
 *      + title + "First move:" footer; whole card is hyperlinked
 *   5. Block 2 — Routine to follow: single routine card
 *   6. Block 3 — Talk to a professional: prep bullets
 *   7. Footer disclaimer + clickable URL
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

// CSS px → PDF pt conversion factor (web is 96 DPI, PDF is 72 DPI).
const PX_TO_PT = 0.75;

// Web type sizes → PDF pt (matches the recipes in components/typography.ts)
const SIZE = {
  xs:   12 * PX_TO_PT,  // 9pt   · text-xs
  sm:   14 * PX_TO_PT,  // 10.5  · text-sm
  base: 16 * PX_TO_PT,  // 12    · text-base
  lg:   18 * PX_TO_PT,  // 13.5  · text-lg
  xl:   20 * PX_TO_PT,  // 15    · text-xl · routine heading
  "2xl":24 * PX_TO_PT,  // 18    · text-2xl · block headlines
  "3xl":30 * PX_TO_PT,  // 22.5  · text-3xl · "Here's where you stand"
  "4xl":36 * PX_TO_PT,  // 27    · text-4xl
  "5xl":48 * PX_TO_PT,  // 36    · text-5xl
  tiny: 10 * PX_TO_PT,  // 7.5   · text-[10px] · card category eyebrows
};

// ── Image loading (for article thumbnails) ──────────────────────────────
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
  // Note: brand fonts (Barlow Condensed / DM Sans / Lora) are NOT
  // embedded here. jsPDF's TTF parser can't read the Google Fonts
  // TTFs we have — they ship with cmap format 12, jsPDF only handles
  // format 0/4. Tracking this as a follow-up; the fix is to switch
  // to pdf-lib (uses fontkit, handles modern TTFs) or to find a
  // jsPDF-compatible TTF source.
  //
  // For now we use system fonts (helvetica + times) so the PDF always
  // generates. The size + weight + layout work from previous commits
  // still applies; only the typeface approximates.
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();   // 612
  const H = doc.internal.pageSize.getHeight();  // 792
  const M = 56;
  const CW = W - M * 2;                          // 500
  let y = 0;

  // Font shortcuts mapping the on-screen recipes to jsPDF built-ins.
  //   helvetica = stands in for DM Sans (sans-serif body / UI)
  //   times     = stands in for Lora + Barlow Condensed (serif display)
  // Sizes and weights still mirror the live page exactly via SIZE map.
  const F = {
    display:    "helvetica",  // mirrors font-display (Barlow Condensed)
    body:       "helvetica",  // mirrors body / UI (DM Sans)
    bodyMedium: "helvetica",  // mirrors text-sm font-medium (DM Sans Medium)
    editorial:  "times",      // mirrors editorial / logo wordmark (Lora)
  };

  // ── Drawing helpers ───────────────────────────────────────────────────
  function fill(x: number, yPos: number, w: number, h: number, color: string) {
    doc.setFillColor(color);
    doc.rect(x, yPos, w, h, "F");
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
  function text(
    str: string | string[],
    x: number,
    yPos: number,
    opts: {
      size: number;
      color: string;
      font?: string;
      weight?: "normal" | "bold";
    },
    drawOpts?: { align?: "left" | "right" | "center" }
  ) {
    doc.setFont(opts.font || F.body, opts.weight || "normal");
    doc.setFontSize(opts.size);
    doc.setTextColor(opts.color);
    doc.text(str, x, yPos, drawOpts);
  }
  function paintPageBackground() {
    // Match the assessment results screen exactly — both pages run on
    // neutral-50 (#F8F7F7). In some PDF viewers this reads very close
    // to pure white, but visual parity with the live page wins over
    // PDF-viewer contrast on this artifact.
    fill(0, 0, W, H, C.neutral50);
  }
  function pageBreakIf(needed: number) {
    if (y + needed > H - 96) {
      doc.addPage();
      paintPageBackground();
      y = M;
    }
  }
  function textWidth(str: string, size: number, font: string, weight: "normal" | "bold" = "normal") {
    doc.setFont(font, weight);
    doc.setFontSize(size);
    return doc.getTextWidth(str);
  }

  paintPageBackground();

  // ── Preload article thumbnails ────────────────────────────────────────
  const articleThumbs = await Promise.all(
    data.articles.map((a) =>
      loadImage(a.imageUrl, "jpeg", 240).catch(() => null)
    )
  );

  // ── Header structure (mirrors the on-screen page) ─────────────────────
  //
  //   1. NAV strip (white):    logo lockup left + date right
  //   2. HERO band (brand-900): eyebrow + big uppercase title
  //   3. Accent rule (cognac):  separates hero from content
  //
  // On the live page the logo is in the site nav above the hero, and
  // the hero itself is just the eyebrow + title (THE MEN'S FOOT HEALTH
  // ASSESSMENT). We replicate that two-band split here so the PDF
  // reads as the same product.

  // 1. NAV strip — white bg, logo lockup + date
  const NAV_H = 56;
  fill(0, 0, W, NAV_H, C.white);

  // Logo lockup: serif M + thin rule + wordmark, all in editorial Times
  text("M", M, 40, { size: 28, color: C.brand500, font: F.editorial, weight: "normal" });
  const mWidth = textWidth("M", 28, F.editorial, "normal");
  fill(M + mWidth + 10, 22, 0.5, 22, C.neutral300);
  text("Men's Sole Revival", M + mWidth + 22, 36, {
    size: 13, color: C.brand500, font: F.editorial, weight: "normal",
  });

  // Date right-aligned
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const dateW = textWidth(dateStr, SIZE.xs, F.body);
  text(dateStr, W - M - dateW, 36, {
    size: SIZE.xs, color: C.neutral500, font: F.body,
  });

  // Subtle divider line under the nav
  hline(0, NAV_H, W, C.neutral200);

  // 2. HERO band — brand-900, eyebrow + big uppercase title
  const HERO_TOP = NAV_H;
  const HERO_H = 130;
  fill(0, HERO_TOP, W, HERO_H, C.brand900);

  // Accent rule under hero (matches the live site)
  fill(0, HERO_TOP + HERO_H, W, 3, C.accent500);

  // Eyebrow — cognac, small uppercase
  text("5-MINUTE SELF-CHECK", M, HERO_TOP + 44, {
    size: SIZE.xs, color: C.accent500, font: F.body, weight: "normal",
  });

  // Title — big uppercase, matches the page displaySection treatment
  text("THE MEN'S FOOT HEALTH ASSESSMENT", M, HERO_TOP + 88, {
    size: SIZE["3xl"], color: C.white, font: F.display, weight: "normal",
  });

  y = HERO_TOP + HERO_H + 36;

  // ── "YOUR RESULTS" headline ───────────────────────────────────────────
  text("YOUR RESULTS", M, y, {
    size: SIZE.xs, color: C.accent600, font: F.body, weight: "normal",
  });
  y += 26;

  text("Here's where you stand.", M, y, {
    size: SIZE["3xl"], color: C.brand900, font: F.display, weight: "normal",
  });
  y += 28;

  doc.setFont(F.body, "normal");
  doc.setFontSize(SIZE.sm);
  doc.setTextColor(C.neutral700);
  const summary =
    `You flagged ${data.totalFlags} item${data.totalFlags === 1 ? "" : "s"} ` +
    `across the sections you took` +
    (data.notSureCount > 0
      ? `, with ${data.notSureCount} marked "Not sure".`
      : ".");
  const sumLines = doc.splitTextToSize(summary, CW) as string[];
  doc.text(sumLines, M, y);
  y += sumLines.length * 16 + 22;

  // ── Section cards — title + duration + count + flagged items ────────
  // PDF-only deviation from the web: only sections with at least one
  // flag get a card. The doctor reading this needs the items the
  // patient flagged; "Pain & Inflammation · 0 FLAGS" is filler that
  // costs ~50pt of vertical space without adding information. Clean
  // sections are summarised in one line at the bottom of the block.
  const flaggedSections = data.sections.filter((s) => s.count > 0);
  const cleanSections = data.sections.filter((s) => s.count === 0);
  if (flaggedSections.length > 0) {
    for (const s of flaggedSections) {
      // Wrap items inside the section card width
      doc.setFont(F.body, "normal");
      doc.setFontSize(SIZE.sm);
      const wrapped: string[][] = s.items.map(
        (it) => doc.splitTextToSize(it, CW - 56) as string[]
      );
      const itemsHeight = wrapped.reduce(
        (sum, lines) => sum + lines.length * 14 + 4,
        0
      );
      // Tighter padding than v1: 32pt header row + items + 10pt bottom.
      const cardH = 32 + itemsHeight + 10;

      pageBreakIf(cardH + 12);

      // Card background + border
      rectFillAndStroke(M, y, CW, cardH, C.white, C.neutral200);

      // Header row: title + (optional) duration + count badge
      text(s.title, M + 16, y + 20, {
        size: SIZE.sm, color: C.brand900, font: F.bodyMedium,
      });
      if (s.duration) {
        const titleW = textWidth(s.title, SIZE.sm, F.bodyMedium, "normal");
        text(`for ${DURATION_LABEL[s.duration]}`, M + 16 + titleW + 8, y + 20, {
          size: SIZE.xs, color: C.neutral500, font: F.body,
        });
      }
      const countStr = `${s.count} FLAG${s.count === 1 ? "" : "S"}`;
      const cw = textWidth(countStr, SIZE.xs, F.body, "normal");
      text(countStr, M + CW - 16 - cw, y + 20, {
        size: SIZE.xs, color: C.accent600, font: F.body, weight: "normal",
      });

      // Items list
      let iy = y + 42;
      doc.setFont(F.body, "normal");
      doc.setFontSize(SIZE.sm);
      doc.setTextColor(C.neutral700);
      for (const lines of wrapped) {
        doc.setFillColor(C.accent500);
        doc.circle(M + 22, iy - 3, 1.5, "F");
        doc.text(lines, M + 32, iy);
        iy += lines.length * 14 + 4;
      }

      y += cardH + 10;
    }
  }

  // Clean sections summarised inline (one line, no card box).
  if (cleanSections.length > 0) {
    const cleanLine = `No flags in: ${cleanSections.map((s) => s.title).join(", ")}.`;
    text(cleanLine, M, y + 4, {
      size: SIZE.xs, color: C.neutral500, font: F.body,
    });
    y += 22;
  }
  if (flaggedSections.length > 0 || cleanSections.length > 0) {
    y += 10; // inter-block spacing before clinic callout / Read & do
  }

  // ── Optional clinic callout ───────────────────────────────────────────
  if (data.recommendsClinic) {
    pageBreakIf(120);
    const calloutBody = data.notSureCount >= 3
      ? "You marked several pain items as Not sure. That interpretive uncertainty is exactly what a 20-minute podiatrist consult is for."
      : "One or more sections came back severe enough that a podiatrist visit is the right next step.";

    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    const bodyLines = doc.splitTextToSize(calloutBody, CW - 44) as string[];
    const blockH = 30 + bodyLines.length * 16 + 22;

    fill(M, y, 4, blockH, C.accent500);
    fill(M + 4, y, CW - 4, blockH, C.accent50);

    text("WORTH A PROFESSIONAL VISIT", M + 20, y + 24, {
      size: SIZE.xs, color: C.accent700, font: F.body, weight: "normal",
    });
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    doc.setTextColor(C.neutral700);
    doc.text(bodyLines, M + 20, y + 46);

    y += blockH + 32;
  }

  // ── Block 1: Read & do ───────────────────────────────────────────────
  if (data.articles.length > 0) {
    // Header (74) + at least one card row (152 + 14) so the headline
    // never lands alone at the bottom of a page with cards orphaned to
    // the next page.
    pageBreakIf(240);
    text("BLOCK 1", M, y, {
      size: SIZE.xs, color: C.accent600, font: F.body, weight: "normal",
    });
    y += 24;
    text("Read & do.", M, y, {
      size: SIZE["2xl"], color: C.brand900, font: F.display, weight: "normal",
    });
    y += 24;
    text("Each card is a guide plus the first concrete move from it.", M, y, {
      size: SIZE.sm, color: C.neutral500, font: F.body,
    });
    y += 26;

    const colW = (CW - 14) / 2;
    const cardH = 162;     // sized for a 3-line action (some article
                           // actions wrap past 2 lines) + ~24pt of
                           // bottom padding below the last line.
    const thumbW = 60;
    const thumbH = 44;

    // Row-by-row: page-break check at the top of each row, both columns
    // draw at the same y, then advance.
    const rowCount = Math.ceil(data.articles.length / 2);
    for (let r = 0; r < rowCount; r++) {
      pageBreakIf(cardH + 14);
      for (let c = 0; c < 2; c++) {
        const i = r * 2 + c;
        if (i >= data.articles.length) break;
        const a = data.articles[i];
        const thumb = articleThumbs[i];
        const cx = M + c * (colW + 14);

        rectFillAndStroke(cx, y, colW, cardH, C.white, C.neutral200);

        if (thumb) {
          try {
            doc.addImage(thumb, "JPEG", cx + 14, y + 14, thumbW, thumbH);
          } catch {/* tolerate broken thumbs */}
        } else {
          fill(cx + 14, y + 14, thumbW, thumbH, C.neutral200);
        }

        const textX = cx + 14 + thumbW + 14;
        const textW = colW - (14 + thumbW + 14) - 14;

        const cat = `${a.category.toUpperCase()} · ${a.readTime.toUpperCase()} READ`;
        text(cat, textX, y + 24, {
          size: SIZE.tiny, color: C.accent600, font: F.bodyMedium,
        });

        doc.setFont(F.body, "normal");
        doc.setFontSize(SIZE.sm);
        doc.setTextColor(C.brand900);
        const titleLines = doc.splitTextToSize(a.title, textW) as string[];
        doc.text(titleLines.slice(0, 2), textX, y + 38);

        const footerY = y + 78;
        hline(cx, footerY, cx + colW, C.neutral200);

        text("FIRST MOVE:", cx + 14, footerY + 16, {
          size: SIZE.xs, color: C.brand500, font: F.body, weight: "normal",
        });

        doc.setFont(F.body, "normal");
        doc.setFontSize(SIZE.xs);
        doc.setTextColor(C.neutral700);
        const actionLines = doc.splitTextToSize(a.action, colW - 28) as string[];
        doc.text(actionLines.slice(0, 3), cx + 14, footerY + 32);
        // Action baselines: line 1 y+110, line 2 y+120, line 3 y+130.
        // Descender ~y+133; cardH=162 → bottom y+162 → 29pt buffer.

        doc.link(cx, y, colW, cardH, { url: `${BASE_URL}/guides/${a.slug}` });
      }
      y += cardH + 12;
    }
    y += 16; // inter-block spacing
  }

  // ── Block 2: Routine to follow ────────────────────────────────────────
  if (data.routine) {
    pageBreakIf(200);
    text("BLOCK 2", M, y, {
      size: SIZE.xs, color: C.accent600, font: F.body, weight: "normal",
    });
    y += 24;
    text("Routine to follow.", M, y, {
      size: SIZE["2xl"], color: C.brand900, font: F.display, weight: "normal",
    });
    y += 24;
    text("One specific starting point, not a list.", M, y, {
      size: SIZE.sm, color: C.neutral500, font: F.body,
    });
    y += 26;

    const r = data.routine;
    const cardH = 116;     // 102 was too tight — the FIRST MOVE row
                           // landed right at the card border. 116 gives
                           // the footer block ~14pt of breathing room.
    rectFillAndStroke(M, y, CW, cardH, C.white, C.neutral200);

    text(`ROUTINE · ${r.label.toUpperCase()}`, M + 20, y + 20, {
      size: SIZE.xs, color: C.brand500, font: F.body, weight: "normal",
    });
    text(r.heading, M + 20, y + 44, {
      size: SIZE.xl, color: C.brand900, font: F.display, weight: "normal",
    });
    text(r.time, M + 20, y + 60, {
      size: SIZE.xs, color: C.neutral500, font: F.bodyMedium,
    });

    const footerY = y + 78;
    hline(M, footerY, M + CW, C.neutral200);
    text("FIRST MOVE:", M + 20, footerY + 20, {
      size: SIZE.xs, color: C.brand500, font: F.body, weight: "normal",
    });
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.xs);
    doc.setTextColor(C.neutral700);
    const actionLines = doc.splitTextToSize(r.action, CW - 100) as string[];
    doc.text(actionLines.slice(0, 1), M + 100, footerY + 20);
    // Action baseline at footerY + 20 = y + 98, descender ~y + 101,
    // cardH=116 → bottom y + 116 → 15pt buffer.

    y += cardH + 22;
  }

  // ── Block 3: Talk to a professional ───────────────────────────────────
  // Header (74) + at least the empty-state card (60) so the headline
  // never lands at the bottom of a page with content jumping to the
  // next one (which is what caused the giant gap above Block 3 in the
  // earlier iteration).
  pageBreakIf(150);
  text("BLOCK 3", M, y, {
    size: SIZE.xs, color: C.accent600, font: F.body, weight: "normal",
  });
  y += 24;
  text("Talk to a professional.", M, y, {
    size: SIZE["2xl"], color: C.brand900, font: F.display, weight: "normal",
  });
  y += 24;
  text("Read these to your podiatrist. They cover what you came to say.", M, y, {
    size: SIZE.sm, color: C.neutral500, font: F.body,
  });
  y += 26;

  if (data.prepBullets.length > 0) {
    const lineH = 16;
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    let totalLines = 0;
    const wrapped: string[][] = data.prepBullets.map((b) => {
      const lines = doc.splitTextToSize(b, CW - 40) as string[];
      totalLines += lines.length;
      return lines;
    });
    const blockH = totalLines * lineH + (data.prepBullets.length - 1) * 14 + 32;
    pageBreakIf(blockH + 14);

    fill(M, y, 3, blockH, C.brand500);
    rectFillAndStroke(M + 3, y, CW - 3, blockH, C.white, C.neutral200);

    let by = y + 22;
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    doc.setTextColor(C.neutral700);
    for (let i = 0; i < wrapped.length; i++) {
      const lines = wrapped[i];
      doc.setFillColor(C.brand500);
      doc.circle(M + 18, by - 3, 1.8, "F");
      doc.text(lines, M + 28, by);
      by += lines.length * lineH;
      if (i < wrapped.length - 1) by += 14;
    }
    y += blockH + 28;
  } else {
    rectFillAndStroke(M, y, CW, 60, C.white, C.neutral200);
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    doc.setTextColor(C.neutral500);
    const fb = doc.splitTextToSize(
      "Nothing in this self-check rises to the level of a podiatrist visit. Re-take in a few months if anything changes.",
      CW - 28
    );
    doc.text(fb, M + 14, y + 24);
    y += 60 + 28;
  }

  // Find a podiatrist link
  text("FIND A PODIATRIST NEAR YOU →", M, y, {
    size: SIZE.xs, color: C.accent600, font: F.body, weight: "normal",
  });
  const apmaW = textWidth("FIND A PODIATRIST NEAR YOU →", SIZE.xs, F.body, "normal");
  doc.link(M, y - 10, apmaW + 6, 14, { url: "https://www.apma.org/find-a-podiatrist" });
  y += 34;

  // ── Sources ───────────────────────────────────────────────────────────
  // Mirrors the on-screen sources panel at the bottom of the results
  // page (app/assessment/page.tsx). Each line is hyperlinked.
  const SOURCES: { label: string; url: string }[] = [
    { label: "APMA · Public Opinion Research on Foot Health and Care",
      url: "https://www.apma.org/document-server/?cfp=/apmamain/assets/file/public/resources/todayspodiatristsurvey-9-30-10.pdf" },
    { label: "NIH / NCBI · Plantar Fasciitis StatPearls",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/" },
    { label: "Gupta et al., Mycoses 2024 · Global Prevalence of Onychomycosis",
      url: "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725" },
    { label: "PMC · Antifungal Selection for Onychomycosis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10922011/" },
    { label: "PMC · Incorrectly Fitted Footwear, Foot Pain and Foot Disorders",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/" },
    { label: "PMC · Global Prevalence and Incidence of Hallux Valgus (2023)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/" },
    { label: "AAFP · Common Foot Problems: OTC Treatments and Home Care",
      url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html" },
  ];

  // Block sizing: 22pt header + (lines × 14pt) + 16pt bottom padding.
  // Width-wrap every label first so we know the total height before
  // we commit to a page break.
  doc.setFont(F.body, "normal");
  doc.setFontSize(SIZE.xs);
  const wrappedSources: string[][] = SOURCES.map(
    (s) => doc.splitTextToSize(s.label, CW - 28) as string[]
  );
  const sourcesLines = wrappedSources.reduce((sum, l) => sum + l.length, 0);
  const sourcesBlockH = 22 + sourcesLines * 14 + 16;

  pageBreakIf(sourcesBlockH + 16);

  fill(M, y, CW, sourcesBlockH, C.neutral100);
  text("SOURCES", M + 14, y + 18, {
    size: SIZE.xs, color: C.neutral400, font: F.body, weight: "normal",
  });

  let sy = y + 36;
  for (let i = 0; i < SOURCES.length; i++) {
    const lines = wrappedSources[i];
    text(lines, M + 14, sy, {
      size: SIZE.xs, color: C.neutral500, font: F.body,
    });
    // Underline the first line of each source label so it reads as
    // a link in the PDF, then attach the link annotation across the
    // full wrapped block.
    const firstLineW = textWidth(lines[0], SIZE.xs, F.body, "normal");
    hline(M + 14, sy + 2, M + 14 + firstLineW, C.neutral400);
    doc.link(M + 14, sy - 8, CW - 28, lines.length * 14, { url: SOURCES[i].url });
    sy += lines.length * 14;
  }
  y += sourcesBlockH + 24;

  // ── Footer ────────────────────────────────────────────────────────────
  pageBreakIf(76);
  hline(M, y, M + CW, C.neutral200);
  y += 22;
  text("This self-check is educational. It is not medical advice or a diagnosis.", M, y, {
    size: SIZE.xs, color: C.neutral400, font: F.body,
  });
  y += 14;
  text("Bring this with you, but trust the podiatrist's read of what's in front of them.", M, y, {
    size: SIZE.xs, color: C.neutral400, font: F.body,
  });
  y += 26;

  text("menssolerevival.com", M, y, {
    size: SIZE.sm, color: C.accent600, font: F.body, weight: "normal",
  });
  const footerLinkW = textWidth("menssolerevival.com", SIZE.sm, F.body, "normal");
  doc.link(M, y - 12, footerLinkW + 4, 16, { url: BASE_URL });

  doc.save("MSR-Foot-Health-Self-Check.pdf");
}
