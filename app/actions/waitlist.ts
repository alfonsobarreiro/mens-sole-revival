"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter signup Server Action — powered by Resend (https://resend.com)
//
// (Formerly the "kit waitlist." Reframed to a content/newsletter signup: kits
// were replaced by the educational model, so this captures people who want new
// guides + the occasional practical tip.)
//
// Flow:
//   1. Validate (only email required — name optional, lower friction).
//   2. Add to the SAME Resend Audience the assessment uses (one unified list —
//      RESEND_AUDIENCE_ID). Fail soft.
//   3. Notify alfonso@ so signups are visible without log inspection.
//
// The "from" address comes from EMAIL_FROM (lib/site.ts) — the verified
// send.menssolerevival.com identity, overridable via the RESEND_FROM env var.
// ─────────────────────────────────────────────────────────────────────────────

import { EMAIL_FROM } from "@/lib/site";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
  field?: "name" | "email"; // which field triggered a validation error
};

export async function submitWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  // ── Validation — only email is required (name optional) ────────────────────
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email || !emailOk) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      field: "email",
    };
  }

  // ── Always log so dev runs capture data ────────────────────────────────────
  console.log("[Newsletter signup]", { name, email, at: new Date().toISOString() });

  // ── Send via Resend if configured ──────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No key — logged only. Set RESEND_API_KEY (+ RESEND_AUDIENCE_ID) to build the list.
    return { status: "success" };
  }

  // ── Add to the Resend Audience (the SAME unified list as the assessment) ───
  // Fail soft: a list-add failure must not block the user's success state.
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
      const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
      const contactRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            ...(firstName ? { firstName } : {}),
            ...(rest.length ? { lastName: rest.join(" ") } : {}),
            unsubscribed: false,
          }),
        }
      );
      // 409 = already a contact; not an error worth surfacing.
      if (!contactRes.ok && contactRes.status !== 409) {
        console.error(
          "Resend (audience) error",
          contactRes.status,
          await contactRes.text()
        );
      }
    } catch (err) {
      console.error("Newsletter audience add failed:", err);
    }
  } else {
    console.warn(
      "[Newsletter signup] RESEND_AUDIENCE_ID not set — email not added to a list."
    );
  }

  // ── Notify alfonso@ so signups are visible without log inspection ──────────
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
        subject: `New newsletter signup — ${name || email}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
            <h2 style="color:#1C3F5E;margin-bottom:16px">New newsletter signup</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600;width:140px;border-radius:4px 0 0 4px">Name</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(name) || "—"}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600">Email</td>
                <td style="padding:8px 12px">${escapeHtml(email)}</td>
              </tr>
            </table>
            <p style="margin-top:24px;font-size:12px;color:#9ca3af">
              Sent from menssolerevival.com · newsletter signup
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error", res.status, body);
      // The list-add likely succeeded; don't fail the user over the notification.
    }

    return { status: "success" };
  } catch (err) {
    console.error("Newsletter action error:", err);
    // Contact may already be on the list; treat as success to avoid double-submits.
    return { status: "success" };
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
