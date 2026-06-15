"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter signup Server Action — powered by Resend (https://resend.com)
//
// Captures people who want new guides, reviews, and routines as they publish,
// plus the occasional practical tip.
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
import { createConfirmToken, confirmUrl } from "@/lib/newsletter-token";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message?: string;
  field?: "name" | "email"; // which field triggered a validation error
};

export async function submitNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
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

  // ── Add to the Resend Audience as PENDING (double opt-in) ──────────────────
  // unsubscribed:true until they click the confirmation link (see the confirm
  // route). Same unified list as the assessment. Fail soft.
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
            unsubscribed: true, // pending until they confirm via email
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

  // ── Send the double opt-in confirmation email to the subscriber ────────────
  // They aren't a real subscriber until they click this. alfonso@ is notified
  // on confirmation (see app/newsletter/confirm), not here, so the notification
  // always means a genuine, confirmed signup.
  const url = confirmUrl(createConfirmToken(email));
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: "Confirm your subscription — Men's Sole Revival",
        html: `
          <div style="font-family:sans-serif;max-width:520px;color:#1a1a1a">
            <h2 style="color:#1C3F5E;margin-bottom:8px">One quick step</h2>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#444">
              ${escapeHtml(name) ? `Hi ${escapeHtml(name)} — ` : ""}confirm your email to start
              getting new guides, reviews, and routines from Men's Sole Revival.
            </p>
            <a href="${url}" style="display:inline-block;background:#1C3F5E;color:#ffffff;text-decoration:none;padding:12px 22px;font-weight:600;font-size:14px;border-radius:4px">
              Confirm subscription
            </a>
            <p style="margin:24px 0 0 0;font-size:12px;line-height:1.6;color:#888">
              If the button doesn't work, paste this link into your browser:<br>
              <a href="${url}" style="color:#1C3F5E;word-break:break-all">${url}</a>
            </p>
            <p style="margin:20px 0 0 0;font-size:12px;color:#aaa">
              This link expires in 48 hours. If you didn't request this, ignore this
              email — you won't be subscribed.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend (confirmation email) error", res.status, body);
      return {
        status: "error",
        message: "We couldn't send the confirmation email. Try again in a moment.",
      };
    }

    return { status: "success" };
  } catch (err) {
    console.error("Newsletter action error:", err);
    return {
      status: "error",
      message: "Network hiccup. Try again in a moment.",
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
