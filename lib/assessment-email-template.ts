// ─────────────────────────────────────────────────────────────────────────────
// HTML template for the emailed assessment results. Mirrors the on-screen
// result page / PDF: results summary → Read & do → Routine → Talk to a
// professional → Sources. Inline styles only (email-client-safe). Pure module
// (no "use server") so it can be unit-rendered as well as used by the action.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL } from "@/lib/site";
import {
  sectionTitle,
  durationLabels,
  type ComposedResult,
  type SectionId,
  type Duration,
} from "@/lib/assessment-routing";

// Exact brand tokens (see app/globals.css).
const NAVY = "#091016"; // brand-900 — dark band + headings
const ACCENT = "#A35E32"; // accent-600 — overlines, labels, accent links (readable on white)
const ACCENT_LINE = "#C4703A"; // accent-500 — the vivid divider line
const EYEBROW = "#BE7241"; // accent-400 — eyebrow on the dark band
const PODIATRIST_URL = "https://www.apma.org/find-a-podiatrist";

const SOURCES: { label: string; url: string }[] = [
  { label: "APMA · Public Opinion Research on Foot Health and Care", url: "https://www.apma.org/document-server/?cfp=/apmamain/assets/file/public/resources/todayspodiatristsurvey-9-30-10.pdf" },
  { label: "NIH / NCBI · Plantar Fasciitis StatPearls", url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/" },
  { label: "Gupta et al., Mycoses 2024 · Global Prevalence of Onychomycosis", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/myc.13725" },
  { label: "PMC · Antifungal Selection for Onychomycosis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10922011/" },
  { label: "PMC · Incorrectly Fitted Footwear, Foot Pain and Foot Disorders", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/" },
  { label: "PMC · Global Prevalence and Incidence of Hallux Valgus (2023)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10510234/" },
  { label: "AAFP · Common Foot Problems: OTC Treatments and Home Care", url: "https://www.aafp.org/pubs/afp/issues/2018/0901/p298.html" },
];

export interface ResultEmailArgs {
  totalFlags: number;
  checkIn: boolean;
  attemptedSections: SectionId[];
  flagsBySection: Partial<Record<SectionId, number>>;
  durationBySection: Partial<Record<SectionId, Duration>>;
  itemsBySection: Partial<Record<SectionId, string[]>>;
  composed: ComposedResult;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function blockHeading(title: string, sub: string): string {
  return `
    <div style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:${NAVY}">${title}</div>
    <div style="font-size:13px;color:#777;margin-top:2px">${sub}</div>`;
}

export function buildResultEmail(args: ResultEmailArgs): string {
  const { totalFlags, checkIn, attemptedSections, flagsBySection, durationBySection, itemsBySection, composed } = args;

  const sectionCards = attemptedSections
    .filter((sid) => (flagsBySection[sid] ?? 0) > 0)
    .map((sid) => {
      const count = flagsBySection[sid] ?? 0;
      const duration = durationBySection[sid];
      const items = (itemsBySection[sid] ?? [])
        .map((it) => `<li style="font-size:13px;color:#444;line-height:1.6;margin-bottom:3px">${escapeHtml(it)}</li>`)
        .join("");
      return `
        <div style="border:1px solid #e5e5e5;padding:14px 16px;margin-top:12px">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:14px;font-weight:bold;color:${NAVY}">${escapeHtml(sectionTitle[sid])}${
              duration ? ` <span style="font-weight:normal;color:#999;font-size:12px">for ${escapeHtml(durationLabels[duration].toLowerCase())}</span>` : ""
            }</td>
            <td align="right" style="font-size:11px;font-weight:bold;color:${ACCENT};text-transform:uppercase;white-space:nowrap">${count} flag${count === 1 ? "" : "s"}</td>
          </tr></table>
          ${items ? `<ul style="margin:10px 0 0;padding-left:18px">${items}</ul>` : ""}
        </div>`;
    })
    .join("");

  const noFlag = attemptedSections
    .filter((sid) => (flagsBySection[sid] ?? 0) === 0)
    .map((sid) => sectionTitle[sid]);
  const noFlagNote = noFlag.length
    ? `<p style="font-size:12px;color:#999;margin-top:10px">No flags in: ${escapeHtml(noFlag.join(", "))}.</p>`
    : "";

  const articleCards = composed.articles
    .map(
      (a) => `
        <div style="border:1px solid #e5e5e5;padding:14px 16px;margin-top:12px">
          <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};font-weight:bold">${escapeHtml(a.category)} · ${escapeHtml(a.readTime)} read</div>
          <a href="${SITE_URL}/guides/${a.slug}" style="display:block;font-size:15px;font-weight:bold;color:${NAVY};text-decoration:none;margin-top:4px">${escapeHtml(a.title)}</a>
          <div style="font-size:12px;color:#555;line-height:1.6;margin-top:10px;border-top:1px solid #f0f0f0;padding-top:10px"><strong style="color:${ACCENT};text-transform:uppercase;font-size:10px;letter-spacing:0.05em">First move:</strong> ${escapeHtml(a.action)}</div>
          <a href="${SITE_URL}/guides/${a.slug}" style="display:inline-block;margin-top:10px;font-size:11px;font-weight:bold;color:${NAVY};text-transform:uppercase;letter-spacing:0.05em;text-decoration:none">Read the guide →</a>
        </div>`
    )
    .join("");
  const articlesBlock =
    composed.articles.length > 0
      ? `${blockHeading("Read &amp; do.", "Each card is a guide plus the first concrete move from it.")}${articleCards}`
      : "";

  const r = composed.routine;
  const routineBlock = r
    ? `
      <div style="margin-top:32px">
        ${blockHeading("Routine to follow.", "One specific starting point, not a list.")}
        <div style="border:1px solid #e5e5e5;padding:16px;margin-top:12px">
          <div style="font-size:11px;font-weight:bold;color:${NAVY};text-transform:uppercase;letter-spacing:0.05em">Routine · ${escapeHtml(r.label)}</div>
          <div style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:${NAVY};margin-top:6px">${escapeHtml(r.heading)}</div>
          <div style="font-size:12px;color:#999;margin-top:2px">${escapeHtml(r.time)}</div>
          <div style="font-size:12px;color:#555;line-height:1.6;margin-top:12px;border-top:1px solid #f0f0f0;padding-top:10px"><strong style="color:${ACCENT};text-transform:uppercase;font-size:10px;letter-spacing:0.05em">First move:</strong> ${escapeHtml(r.action)}</div>
          <a href="${SITE_URL}/routines#${escapeHtml(r.anchor)}" style="display:inline-block;margin-top:10px;font-size:11px;font-weight:bold;color:${NAVY};text-transform:uppercase;letter-spacing:0.05em;text-decoration:none">See the routine →</a>
        </div>
      </div>`
    : "";

  const prep =
    composed.prepBullets.length > 0
      ? `<ul style="margin:12px 0 0;padding-left:18px">${composed.prepBullets
          .map((b) => `<li style="font-size:13px;color:#444;line-height:1.6;margin-bottom:6px">${escapeHtml(b)}</li>`)
          .join("")}</ul>`
      : `<p style="font-size:13px;color:#555;line-height:1.6;margin-top:12px">Nothing in this self-check rises to the level of a podiatrist visit. Re-take in a few months if anything changes.</p>`;
  const proBlock = `
    <div style="margin-top:32px">
      ${blockHeading("Talk to a professional.", "Read these to your podiatrist. They cover what you came to say.")}
      ${composed.recommendsClinic ? `<div style="border-left:3px solid ${ACCENT_LINE};background:#F4F2F0;padding:12px 14px;margin-top:12px;font-size:13px;color:#532F18;line-height:1.6">One or more areas came back severe enough that a podiatrist visit is the right next step. The guide and routine above help in the meantime, but they're not a substitute.</div>` : ""}
      ${prep}
      <a href="${PODIATRIST_URL}" style="display:inline-block;margin-top:14px;font-size:11px;font-weight:bold;color:${ACCENT};text-transform:uppercase;letter-spacing:0.05em;text-decoration:none">Find a podiatrist near you →</a>
    </div>`;

  const sources = `
    <div style="margin-top:32px;background:#f6f6f6;padding:16px">
      <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#999;font-weight:bold">Sources</div>
      <ul style="margin:10px 0 0;padding-left:18px">
        ${SOURCES.map((s) => `<li style="margin-bottom:4px"><a href="${s.url}" style="font-size:12px;color:#666;text-decoration:underline">${escapeHtml(s.label)}</a></li>`).join("")}
      </ul>
    </div>`;

  const checkInNote = checkIn
    ? "We'll check back in at 30 and 90 days so you can re-take and see what changed."
    : "";

  return `
  <div style="background:#f3f3f3;padding:0;margin:0">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:Helvetica,Arial,sans-serif">
      <div style="background:${NAVY};padding:26px 28px;color:#fff">
        <a href="${SITE_URL}" style="text-decoration:none;border:0">
          <img src="${SITE_URL}/logo-msr-lockup-light.png" alt="Men's Sole Revival" width="190" height="36" style="display:block;width:190px;height:auto;border:0;margin-bottom:22px" />
        </a>
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${EYEBROW}">5-minute self-check</div>
        <div style="font-family:Georgia,serif;font-size:21px;font-weight:bold;margin-top:6px">The Men's Foot Health Assessment</div>
      </div>
      <div style="height:3px;background:${ACCENT_LINE}"></div>

      <div style="padding:24px 28px">
        <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${ACCENT};font-weight:bold">Your results</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:${NAVY};margin-top:6px">Here's where you stand.</div>
        <p style="font-size:14px;color:#444;line-height:1.6;margin:10px 0 0">You flagged ${totalFlags} item${totalFlags === 1 ? "" : "s"} across the sections you took. ${checkInNote}</p>
        ${sectionCards}
        ${noFlagNote}
      </div>

      <div style="padding:8px 28px 28px">
        ${articlesBlock ? `<div style="margin-top:24px">${articlesBlock}</div>` : ""}
        ${routineBlock}
        ${proBlock}
        ${sources}
      </div>

      <div style="border-top:1px solid #eee;padding:20px 28px">
        <p style="font-size:12px;color:#999;line-height:1.6;margin:0">This self-check is educational. It is not a medical diagnosis. Bring it with you, but trust the podiatrist's read of what's in front of them.</p>
        <p style="margin:14px 0 0"><a href="${SITE_URL}/assessment" style="font-size:12px;color:${NAVY};font-weight:bold;text-decoration:none">Re-take the assessment →</a></p>
        <p style="margin:6px 0 0"><a href="${SITE_URL}" style="font-size:12px;color:${ACCENT};text-decoration:none">menssolerevival.com</a></p>
      </div>
    </div>
  </div>`;
}
