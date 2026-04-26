/**
 * Generates a personalized MSR Foot Health Assessment PDF
 * matching the results-page layout with hero image, score block,
 * section rows linking to guides, and recommendation.
 */

interface SectionResult {
  title: string;
  count: number;
  items: string[];
  guideHref: string;
  note?: string;
}

interface AssessmentData {
  totalFlags: number;
  tier: string;
  headline: string;
  recommendation: string;
  sections: SectionResult[];
}

// ── Brand tokens (matches globals.css) ──────────────────────
const C = {
  brand900: "#091016",
  brand700: "#172A3A",
  accent500: "#C4703A",
  accent400: "#BE7241",
  neutral200: "#E5E7EB",
  neutral400: "#9CA3AF",
  neutral500: "#6B7280",
  neutral700: "#374151",
  neutral800: "#1F2937",
  white: "#FFFFFF",
  bgLight: "#F9FAFB",
  border: "#E5E7EB",
};

const BASE_URL = "https://www.menssolerevival.com";

// ── Load image as base64 ────────────────────────────────────
async function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateAssessmentPDF(data: AssessmentData) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth(); // 612
  const H = doc.internal.pageSize.getHeight(); // 792
  const M = 48; // margin
  const CW = W - M * 2; // content width
  let y = 0;

  // ── Helpers ───────────────────────────────────────────────
  function checkPage(needed: number) {
    if (y + needed > H - 60) {
      doc.addPage();
      y = M;
    }
  }

  function drawRect(
    x: number,
    yPos: number,
    w: number,
    h: number,
    fill: string
  ) {
    doc.setFillColor(fill);
    doc.rect(x, yPos, w, h, "F");
  }

  function drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ) {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y2);
  }

  // ── Hero header with image + gradient overlay ─────────────
  const HEADER_H = 160;

  // Try to load the hero image
  try {
    const imgData = await loadImageAsBase64("/images/pexels-11873696.jpg");
    // Place image full-bleed across header
    // The image is landscape; we crop-to-fill the header area
    doc.addImage(imgData, "JPEG", 0, 0, W, HEADER_H, undefined, "FAST");
  } catch {
    // Fallback: solid dark background if image fails
    drawRect(0, 0, W, HEADER_H, C.brand900);
  }

  // Gradient overlay: draw semi-transparent dark rectangles
  // jsPDF doesn't support real gradients, so we simulate with bands
  const bands = 20;
  const bandH = HEADER_H / bands;
  for (let i = 0; i < bands; i++) {
    const opacity = 0.3 + (i / bands) * 0.55; // 0.3 at top → 0.85 at bottom
    doc.setGState(new (doc as any).GState({ opacity }));
    drawRect(0, i * bandH, W, bandH + 1, C.brand900);
  }
  // Reset opacity
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Brand name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(C.accent500);
  doc.text("MEN'S SOLE REVIVAL", M, 36);

  // Title
  doc.setFontSize(24);
  doc.setTextColor(C.white);
  doc.text("Your Foot Health Assessment", M, 64);

  // Date
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(9);
  doc.setTextColor(C.neutral400);
  doc.text(dateStr, M, 84);

  // Accent stripe under header
  drawRect(0, HEADER_H, W, 4, C.accent500);

  y = HEADER_H + 28;

  // ── "HERE'S WHERE YOU STAND" label ────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(C.neutral400);
  doc.text("HERE'S WHERE YOU STAND", M, y);
  y += 20;

  // ── Score block (centered, matches web layout) ────────────
  const SCORE_H = 140;
  drawRect(M, y, CW, SCORE_H, C.brand900);

  // "YOUR RESULTS" label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(C.accent400);
  doc.text("YOUR RESULTS", W / 2, y + 24, { align: "center" });

  // Big score number
  doc.setFontSize(52);
  doc.setTextColor(C.white);
  doc.text(String(data.totalFlags), W / 2, y + 68, { align: "center" });

  // "flags checked"
  doc.setFontSize(10);
  doc.setTextColor("#FFFFFF80");
  doc.text(
    data.totalFlags === 1 ? "flag" : "flags checked",
    W / 2,
    y + 82,
    { align: "center" }
  );

  // Accent divider
  drawRect(W / 2 - 24, y + 90, 48, 2, C.accent500);

  // Tier
  doc.setFontSize(8);
  doc.setTextColor(C.accent500);
  doc.text(data.tier.toUpperCase(), W / 2, y + 108, { align: "center" });

  // Headline
  doc.setFontSize(16);
  doc.setTextColor(C.white);
  const headlineLines = doc.splitTextToSize(data.headline, CW - 80);
  const headlineY = y + 124;
  doc.text(headlineLines, W / 2, headlineY, { align: "center" });

  // Adjust score block height if headline wraps
  const actualScoreH = headlineY + (headlineLines.length - 1) * 18 + 16 - y;
  if (actualScoreH > SCORE_H) {
    // Extend the dark block
    drawRect(M, y + SCORE_H, CW, actualScoreH - SCORE_H, C.brand900);
  }
  y += Math.max(SCORE_H, actualScoreH) + 20;

  // ── Section breakdown (card rows with links) ──────────────
  const flaggedSections = data.sections.filter((s) => s.count > 0);
  if (flaggedSections.length > 0) {
    checkPage(40 + flaggedSections.length * 36);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(C.neutral400);
    doc.text("FLAGS BY SECTION", M, y);
    y += 14;

    for (const section of flaggedSections) {
      checkPage(36);
      const ROW_H = 32;

      // Row background with border
      drawRect(M, y, CW, ROW_H, C.white);
      doc.setDrawColor(C.neutral200);
      doc.setLineWidth(0.5);
      doc.rect(M, y, CW, ROW_H, "S");

      // Count badge
      const badgeSize = 20;
      const badgeX = M + 12;
      const badgeY = y + (ROW_H - badgeSize) / 2;
      drawRect(badgeX, badgeY, badgeSize, badgeSize, C.accent500);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(C.white);
      doc.text(String(section.count), badgeX + badgeSize / 2, badgeY + 14, {
        align: "center",
      });

      // Section title
      doc.setFontSize(10);
      doc.setTextColor(C.neutral800);
      doc.text(section.title, M + 42, y + ROW_H / 2 + 4);

      // "Read the guide →" link
      const linkText = "Read the guide →";
      doc.setFontSize(8);
      doc.setTextColor(C.accent500);
      const linkX = M + CW - 12;
      doc.text(linkText, linkX, y + ROW_H / 2 + 3, { align: "right" });

      // Make the entire row a clickable link
      const linkUrl = BASE_URL + section.guideHref;
      doc.link(M, y, CW, ROW_H, { url: linkUrl });

      y += ROW_H + 4;
    }

    // Helper text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.neutral400);
    doc.text("Each row links to the guide for that area.", M, y + 4);
    y += 20;
  }

  // ── Recommendation block ──────────────────────────────────
  checkPage(80);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(C.neutral700);
  const recoLines = doc.splitTextToSize(data.recommendation, CW - 36);
  const recoH = recoLines.length * 14 + 28;

  // White card with left accent border
  drawRect(M, y, CW, recoH, C.white);
  drawRect(M, y, 3, recoH, C.accent500);

  doc.text(recoLines, M + 18, y + 18);
  y += recoH + 20;

  // ── Detailed breakdown (items per section) ────────────────
  const sectionsWithFlags = data.sections.filter((s) => s.count > 0);
  if (sectionsWithFlags.length > 0) {
    checkPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(C.neutral400);
    doc.text("YOUR FLAGGED ITEMS", M, y);
    y += 16;

    for (const section of sectionsWithFlags) {
      checkPage(section.items.length * 15 + 40);

      // Section title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(C.brand900);
      doc.text(section.title, M, y + 4);

      // Guide link next to title
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(C.accent500);
      const titleWidth = doc.getTextWidth(section.title);
      doc.text("  View guide →", M + titleWidth + 4, y + 4);
      doc.link(
        M + titleWidth + 4,
        y - 6,
        80,
        14,
        { url: BASE_URL + section.guideHref }
      );

      y += 18;

      // Checked items
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const item of section.items) {
        checkPage(16);

        // Orange checkmark
        doc.setTextColor(C.accent500);
        doc.text("✓", M + 8, y);

        // Item text
        doc.setTextColor(C.neutral700);
        const itemLines = doc.splitTextToSize(item, CW - 36);
        doc.text(itemLines, M + 24, y);
        y += itemLines.length * 13;
      }

      y += 8;
      drawLine(M, y, M + CW, y, C.border);
      y += 12;
    }
  }

  // ── Sections with no flags ────────────────────────────────
  const cleanSections = data.sections.filter((s) => s.count === 0);
  if (cleanSections.length > 0) {
    checkPage(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(C.neutral400);
    doc.text("NO FLAGS", M, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(C.neutral500);
    doc.text(cleanSections.map((s) => s.title).join("  ·  "), M, y);
    y += 24;
  }

  // ── Footer ────────────────────────────────────────────────
  checkPage(70);
  drawLine(M, y, M + CW, y, C.border);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.neutral400);
  doc.text(
    "This assessment is educational — it is not medical advice.",
    M,
    y
  );
  y += 12;
  doc.text(
    "If you have pain, swelling, or infection, see a podiatrist.",
    M,
    y
  );
  y += 20;

  // Website link
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(C.accent500);
  doc.text("menssolerevival.com", M, y);
  doc.link(M, y - 10, 120, 14, { url: BASE_URL });

  // ── Save ──────────────────────────────────────────────────
  doc.save("MSR-Foot-Health-Assessment.pdf");
}
