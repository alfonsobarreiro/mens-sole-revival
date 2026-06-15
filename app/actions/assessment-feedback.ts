"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Assessment feedback Server Action.
//
// Lightweight capture for the "share assessment, collect responses" loop on
// Cate's punch list. Mirrors app/actions/newsletter.ts: if RESEND_API_KEY is set
// in the environment, fires an email to alfonso@barreiro.com; otherwise logs
// locally and returns success so dev testing works.
//
// Captures three signals:
//   - usefulness:   yes / somewhat / no
//   - improvement:  freeform text (optional)
//   - totalFlags:   from the user's session (optional, anonymised context)
// ─────────────────────────────────────────────────────────────────────────────

import { EMAIL_FROM } from "@/lib/site";

export type FeedbackState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitAssessmentFeedback(
  _prevState: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const usefulness =
    (formData.get("usefulness") as string | null)?.trim() ?? "";
  const improvement =
    (formData.get("improvement") as string | null)?.trim() ?? "";
  const totalFlags =
    (formData.get("totalFlags") as string | null)?.trim() ?? "";

  // ── Validation ───────────────────────────────────────────────────────────
  if (!["yes", "somewhat", "no"].includes(usefulness)) {
    return {
      status: "error",
      message: "Pick one of the three options so we can use the answer.",
    };
  }

  // ── Always log locally so dev/test runs capture data ─────────────────────
  console.log("[Assessment feedback]", {
    usefulness,
    improvement,
    totalFlags,
    at: new Date().toISOString(),
  });

  // ── Send via Resend if configured ────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "success" };
  }

  const usefulnessLabel = {
    yes: "Yes — useful",
    somewhat: "Somewhat",
    no: "Not really",
  }[usefulness] ?? usefulness;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: ["alfonso@barreiro.com"],
        subject: `Assessment feedback — ${usefulnessLabel}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
            <h2 style="color:#1C3F5E;margin-bottom:16px">Assessment feedback</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600;width:160px;border-radius:4px 0 0 4px">Usefulness</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${usefulnessLabel}</td>
              </tr>
              ${
                improvement
                  ? `<tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600;vertical-align:top">What would help</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(improvement)}</td>
              </tr>`
                  : ""
              }
              ${
                totalFlags
                  ? `<tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600">Flags this session</td>
                <td style="padding:8px 12px">${escapeHtml(totalFlags)}</td>
              </tr>`
                  : ""
              }
            </table>
            <p style="margin-top:24px;font-size:12px;color:#9ca3af">
              Sent from mensolerevival.com · assessment results screen
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error", res.status, body);
      return {
        status: "error",
        message: "Couldn't send right now. Try again in a minute.",
      };
    }

    return { status: "success" };
  } catch (err) {
    console.error("Assessment feedback action error:", err);
    return {
      status: "error",
      message: "Network hiccup. Try again.",
    };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
