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
  // Pre-register brand fonts. Each module pushes a callback onto
  // jsPDF.API.events; the next `new jsPDF()` invokes those callbacks
  // and embeds the TTFs. Dynamic imports keep these ~2 MB of base64
  // out of the main bundle — they only load when the PDF is generated.
  let brandFontsAvailable = false;
  try {
    await Promise.all([
      import("./pdfFonts/BarlowCondensed-Bold"),
      import("./pdfFonts/DMSans-Regular"),
      import("./pdfFonts/DMSans-Bold"),
      import("./pdfFonts/DMSans-Medium"),
      import("./pdfFonts/Lora-Regular"),
      import("./pdfFonts/Lora-Bold"),
    ]);
    brandFontsAvailable = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("PDF: brand fonts failed to load, falling back to system fonts", err);
  }

  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();   // 612
  const H = doc.internal.pageSize.getHeight();  // 792
  const M = 56;
  const CW = W - M * 2;                          // 500
  let y = 0;

  // Font shortcuts. If the brand TTFs registered cleanly via the
  // events.addFonts hook, we use them. Otherwise we fall back to
  // jsPDF built-ins (helvetica + times) — the layout stays the same.
  const F = brandFontsAvailable
    ? {
        display:    "BarlowCondensed",
        body:       "DMSans",
        bodyMedium: "DMSansMedium",
        editorial:  "Lora",
      }
    : {
        display:    "helvetica",
        body:       "helvetica",
        bodyMedium: "helvetica",
        editorial:  "times",
      };

  // Verify each font actually got registered. addFonts events run on
  // jsPDF instantiation; if any threw, the font isn't usable. Fall back
  // per family if so.
  if (brandFontsAvailable) {
    const families = [
      { name: "BarlowCondensed", style: "bold",   fallback: "helvetica" },
      { name: "DMSans",          style: "normal", fallback: "helvetica" },
      { name: "DMSans",          style: "bold",   fallback: "helvetica" },
      { name: "DMSansMedium",    style: "normal", fallback: "helvetica" },
      { name: "Lora",            style: "normal", fallback: "times"     },
      { name: "Lora",            style: "bold",   fallback: "times"     },
    ];
    for (const f of families) {
      try {
        doc.setFont(f.name, f.style);
      } catch {
        // eslint-disable-next-line no-console
        console.warn(`PDF: ${f.name} ${f.style} unusable, will fall back`);
        // No per-family flip here; jsPDF would have thrown noisily —
        // safest is to just use the system fallbacks for everything.
        F.display = "helvetica";
        F.body = "helvetica";
        F.bodyMedium = "helvetica";
        F.editorial = "times";
        break;
      }
    }
  }

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

  // ── Hero band ─────────────────────────────────────────────────────────
  const HEADER_H = 152;
  fill(0, 0, W, HEADER_H, C.brand900);
  fill(0, HEADER_H, W, 3, C.accent500);

  // Logo · Lora-rendered M + wordmark (vector, crisp at any DPI)
  text("M", M, 82, { size: 48, color: C.white, font: F.editorial, weight: "bold" });
  const mWidth = textWidth("M", 48, F.editorial, "bold");
  // Vertical rule between mark and wordmark
  fill(M + mWidth + 14, 44, 0.6, 40, C.white);
  text("Men's Sole Revival", M + mWidth + 28, 72, {
    size: 20, color: C.white, font: F.editorial, weight: "normal",
  });

  // Eyebrow + title (below logo)
  text("5-MINUTE SELF-CHECK", M, 114, {
    size: SIZE.xs, color: C.accent500, font: F.body, weight: "bold",
  });
  text("The Men's Foot Health Assessment", M, 138, {
    size: SIZE["2xl"], color: C.white, font: F.display, weight: "bold",
  });

  // Date + clickable URL right-aligned
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const dateW = textWidth(dateStr, SIZE.xs, F.body);
  text(dateStr, W - M - dateW, 52, {
    size: SIZE.xs, color: C.neutral300, font: F.body,
  });

  const siteText = "menssolerevival.com";
  const siteW = textWidth(siteText, SIZE.xs, F.body, "bold");
  text(siteText, W - M - siteW, 74, {
    size: SIZE.xs, color: C.accent500, font: F.body, weight: "bold",
  });
  doc.link(W - M - siteW - 4, 62, siteW + 8, 16, { url: BASE_URL });

  y = HEADER_H + 40;

  // ── "YOUR RESULTS" headline ───────────────────────────────────────────
  text("YOUR RESULTS", M, y, {
    size: SIZE.xs, color: C.accent600, font: F.body, weight: "bold",
  });
  y += 26;

  text("Here's where you stand.", M, y, {
    size: SIZE["3xl"], color: C.brand900, font: F.display, weight: "bold",
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

  // ── Per-section card grid ─────────────────────────────────────────────
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

      text(s.title, cx + 16, cy + 24, {
        size: SIZE.sm, color: C.neutral700, font: F.bodyMedium,
      });
      if (s.duration) {
        text(`for ${DURATION_LABEL[s.duration]}`, cx + 16, cy + 40, {
          size: SIZE.xs, color: C.neutral500, font: F.body,
        });
      }
      const countStr = `${s.count} FLAG${s.count === 1 ? "" : "S"}`;
      const cw = textWidth(countStr, SIZE.xs, F.body, "bold");
      text(countStr, cx + colW - 16 - cw, cy + 24, {
        size: SIZE.xs, color: C.accent600, font: F.body, weight: "bold",
      });
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

    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    const bodyLines = doc.splitTextToSize(calloutBody, CW - 44) as string[];
    const blockH = 30 + bodyLines.length * 16 + 22;

    fill(M, y, 4, blockH, C.accent500);
    fill(M + 4, y, CW - 4, blockH, C.accent50);

    text("WORTH A PROFESSIONAL VISIT", M + 20, y + 24, {
      size: SIZE.xs, color: C.accent700, font: F.body, weight: "bold",
    });
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.sm);
    doc.setTextColor(C.neutral700);
    doc.text(bodyLines, M + 20, y + 46);

    y += blockH + 32;
  }

  // ── Block 1: Read & do ───────────────────────────────────────────────
  if (data.articles.length > 0) {
    pageBreakIf(100);
    text("BLOCK 1", M, y, {
      size: SIZE.xs, color: C.accent600, font: F.body, weight: "bold",
    });
    y += 24;
    text("Read & do.", M, y, {
      size: SIZE["2xl"], color: C.brand900, font: F.display, weight: "bold",
    });
    y += 24;
    text("Each card is a guide plus the first concrete move from it.", M, y, {
      size: SIZE.sm, color: C.neutral500, font: F.body,
    });
    y += 26;

    const colW = (CW - 14) / 2;
    const cardH = 152;
    const thumbW = 68;
    const thumbH = 52;

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

      const cat = `${a.category.toUpperCase()} · ${a.readTime.toUpperCase()} READ`;
      text(cat, textX, cy + 24, {
        size: SIZE.tiny, color: C.accent600, font: F.bodyMedium,
      });

      doc.setFont(F.body, "bold");
      doc.setFontSize(SIZE.sm);
      doc.setTextColor(C.brand900);
      const titleLines = doc.splitTextToSize(a.title, textW) as string[];
      doc.text(titleLines.slice(0, 3), textX, cy + 40);

      // Footer separator + first-move copy
      const footerY = cy + 90;
      hline(cx, footerY, cx + colW, C.neutral200);

      text("FIRST MOVE:", cx + 14, footerY + 20, {
        size: SIZE.xs, color: C.brand500, font: F.body, weight: "bold",
      });

      doc.setFont(F.body, "normal");
      doc.setFontSize(SIZE.xs);
      doc.setTextColor(C.neutral700);
      const actionLines = doc.splitTextToSize(a.action, colW - 28) as string[];
      doc.text(actionLines.slice(0, 3), cx + 14, footerY + 36);

      doc.link(cx, cy, colW, cardH, { url: `${BASE_URL}/guides/${a.slug}` });
    }
    const rows = Math.ceil(data.articles.length / 2);
    y += rows * (cardH + 14) + 32;
  }

  // ── Block 2: Routine to follow ────────────────────────────────────────
  if (data.routine) {
    pageBreakIf(200);
    text("BLOCK 2", M, y, {
      size: SIZE.xs, color: C.accent600, font: F.body, weight: "bold",
    });
    y += 24;
    text("Routine to follow.", M, y, {
      size: SIZE["2xl"], color: C.brand900, font: F.display, weight: "bold",
    });
    y += 24;
    text("One specific starting point, not a list.", M, y, {
      size: SIZE.sm, color: C.neutral500, font: F.body,
    });
    y += 26;

    const r = data.routine;
    const cardH = 116;
    rectFillAndStroke(M, y, CW, cardH, C.white, C.neutral200);

    text(`ROUTINE · ${r.label.toUpperCase()}`, M + 20, y + 24, {
      size: SIZE.xs, color: C.brand500, font: F.body, weight: "bold",
    });
    text(r.heading, M + 20, y + 50, {
      size: SIZE.xl, color: C.brand900, font: F.display, weight: "bold",
    });
    text(r.time, M + 20, y + 66, {
      size: SIZE.xs, color: C.neutral500, font: F.bodyMedium,
    });

    const footerY = y + 80;
    hline(M, footerY, M + CW, C.neutral200);
    text("FIRST MOVE:", M + 20, footerY + 20, {
      size: SIZE.xs, color: C.brand500, font: F.body, weight: "bold",
    });
    doc.setFont(F.body, "normal");
    doc.setFontSize(SIZE.xs);
    doc.setTextColor(C.neutral700);
    const actionLines = doc.splitTextToSize(r.action, CW - 40) as string[];
    doc.text(actionLines.slice(0, 2), M + 20, footerY + 36);

    y += cardH + 32;
  }

  // ── Block 3: Talk to a professional ───────────────────────────────────
  pageBreakIf(100);
  text("BLOCK 3", M, y, {
    size: SIZE.xs, color: C.accent600, font: F.body, weight: "bold",
  });
  y += 24;
  text("Talk to a professional.", M, y, {
    size: SIZE["2xl"], color: C.brand900, font: F.display, weight: "bold",
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
    size: SIZE.xs, color: C.accent600, font: F.body, weight: "bold",
  });
  const apmaW = textWidth("FIND A PODIATRIST NEAR YOU →", SIZE.xs, F.body, "bold");
  doc.link(M, y - 10, apmaW + 6, 14, { url: "https://www.apma.org/find-a-podiatrist" });
  y += 34;

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
    size: SIZE.sm, color: C.accent600, font: F.body, weight: "bold",
  });
  const footerLinkW = textWidth("menssolerevival.com", SIZE.sm, F.body, "bold");
  doc.link(M, y - 12, footerLinkW + 4, 16, { url: BASE_URL });

  doc.save("MSR-Foot-Health-Self-Check.pdf");
}
