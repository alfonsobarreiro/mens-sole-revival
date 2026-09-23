import { SITE_URL } from "@/lib/site";
import type { CheckInKind } from "@/lib/submissions/store";

/**
 * The 30-day and 90-day check-in emails. Same frame as the results email:
 * ink header, one accent line, plain body. No personal data goes in; the
 * reader's answers live behind the progress link, never in the mail.
 */

const NAVY = "#1C3F5E";
const ACCENT = "#CF5B48";
const EYEBROW = "#B8C7D6";

const COPY: Record<CheckInKind, { subject: string; eyebrow: string; title: string; body: string; close: string }> = {
  30: {
    subject: "30 days on. Time to re-take the foot check.",
    eyebrow: "30-day check-in",
    title: "Thirty days since your last check.",
    body:
      "That's long enough for a routine or a fix to show up in your answers. The check takes five minutes and asks the same questions, so the comparison is honest. Take it now, then open your progress to see the two side by side.",
    close: "One more check-in comes at 90 days.",
  },
  90: {
    subject: "90 days on. Your last check-in for this assessment.",
    eyebrow: "90-day check-in",
    title: "Ninety days since your last check.",
    body:
      "Three months is where the slower changes show: nails growing out clean, heels that stopped cracking, a morning without the first-step pain. Take the check again and open your progress to compare.",
    close: "This is the last check-in for this assessment. Retaking it restarts the clock if you want to keep tracking.",
  },
};

export function buildCheckInEmail(args: { kind: CheckInKind; stopUrl: string }): {
  subject: string;
  html: string;
} {
  const c = COPY[args.kind];
  const html = `
  <div style="background:#f3f3f3;padding:0;margin:0">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:Helvetica,Arial,sans-serif">
      <div style="background:${NAVY};padding:26px 28px;color:#fff">
        <a href="${SITE_URL}" style="text-decoration:none;border:0">
          <img src="${SITE_URL}/logo-msr-lockup-light.png" alt="Men's Sole Revival" width="190" height="36" style="display:block;width:190px;height:auto;border:0;margin-bottom:22px" />
        </a>
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${EYEBROW}">${c.eyebrow}</div>
        <div style="font-family:Georgia,serif;font-size:21px;font-weight:bold;margin-top:6px">${c.title}</div>
      </div>
      <div style="height:3px;background:${ACCENT}"></div>

      <div style="padding:24px 28px">
        <p style="font-size:14px;color:#444;line-height:1.6;margin:0">${c.body}</p>
        <p style="margin:20px 0 0">
          <a href="${SITE_URL}/assessment" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;padding:12px 22px;font-weight:600;font-size:14px">Re-take the assessment</a>
        </p>
        <p style="margin:14px 0 0"><a href="${SITE_URL}/progress" style="font-size:13px;color:${NAVY};font-weight:bold;text-decoration:none">See your progress →</a></p>
        <p style="font-size:13px;color:#666;line-height:1.6;margin:20px 0 0">${c.close}</p>
      </div>

      <div style="border-top:1px solid #eee;padding:20px 28px">
        <p style="font-size:12px;color:#999;line-height:1.6;margin:0">You asked for check-ins at 30 and 90 days when you took the assessment. <a href="${args.stopUrl}" style="color:#999;text-decoration:underline">Stop the check-ins</a> and you won't hear from this again.</p>
        <p style="font-size:12px;color:#999;line-height:1.6;margin:10px 0 0">The self-check is educational, not a diagnosis. If something hurts more, is spreading, or won't heal, see a podiatrist.</p>
        <p style="margin:14px 0 0"><a href="${SITE_URL}" style="font-size:12px;color:${ACCENT};text-decoration:none">menssolerevival.com</a></p>
      </div>
    </div>
  </div>`;
  return { subject: c.subject, html };
}
