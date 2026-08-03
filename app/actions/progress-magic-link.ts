"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Progress magic-link Server Action.
//
// Flow:
//   1. Validate the email format.
//   2. ALWAYS return success (even for unknown emails) so an attacker can't
//      enumerate which emails have taken the assessment.
//   3. If Resend is configured AND at least one submission exists for that
//      email in Sanity, send the magic link. Silently skip otherwise — the
//      user just won't see an email land, which is fine given step 2.
//
// Rate limiting is not implemented in-app; rely on Resend's per-sender limits
// and Vercel's function-invocation limits for basic abuse resistance.
// ─────────────────────────────────────────────────────────────────────────────

import { EMAIL_FROM } from "@/lib/site";
import { createProgressToken, progressUrl } from "@/lib/progress-token";
import { client } from "@/sanity/lib/client";

export type ProgressMagicLinkState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function requestProgressLink(
  _prevState: ProgressMagicLinkState,
  formData: FormData
): Promise<ProgressMagicLinkState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email || !emailOk) {
    return {
      status: "error",
      message: "That email doesn't look right. Try again.",
    };
  }

  console.log("[Progress magic-link]", { email, at: new Date().toISOString() });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev without keys — still return success so the UI doesn't leak the
    // dev-vs-prod distinction to the user.
    return { status: "success" };
  }

  // Only send the link if at least one submission exists for this email.
  // Prevents accidentally sending links to random emails; also confirms the
  // email actually has history worth viewing.
  let hasHistory = false;
  try {
    const count = await client.fetch<number>(
      `count(*[_type == "assessmentSubmission" && email == $email])`,
      { email }
    );
    hasHistory = count > 0;
  } catch (err) {
    console.error("[Progress magic-link] Sanity count query failed:", err);
    // On query error, treat as no-history: don't send a link, but return
    // success to the user (the "check your inbox" experience is the same).
  }

  if (!hasHistory) {
    return { status: "success" };
  }

  const url = progressUrl(createProgressToken(email));

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
        subject: "Your Men's Sole Revival progress link",
        html: `
          <div style="font-family:sans-serif;max-width:520px;color:#1a1a1a">
            <h2 style="color:#1C3F5E;margin-bottom:8px">Your progress link</h2>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#444">
              Click below to see your assessment history. The link expires in 24 hours.
            </p>
            <a href="${url}" style="display:inline-block;background:#CF5B48;color:#ffffff;text-decoration:none;padding:12px 22px;font-weight:600;font-size:14px;border-radius:4px">
              Open my progress
            </a>
            <p style="margin:24px 0 0 0;font-size:12px;line-height:1.6;color:#888">
              If the button doesn't work, paste this link into your browser:<br>
              <a href="${url}" style="color:#1C3F5E;word-break:break-all">${url}</a>
            </p>
            <p style="margin:20px 0 0 0;font-size:12px;color:#aaa">
              If you didn't request this, ignore this email. Your data won't be exposed
              without someone clicking this specific link.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[Progress magic-link] Resend send failed:", res.status, body);
      return {
        status: "error",
        message: "We couldn't send the email. Try again in a moment.",
      };
    }

    return { status: "success" };
  } catch (err) {
    console.error("[Progress magic-link] send exception:", err);
    return { status: "error", message: "Network hiccup. Try again in a moment." };
  }
}
