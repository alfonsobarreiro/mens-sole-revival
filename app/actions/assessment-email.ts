"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Assessment email-save Server Action.
//
// Capture flow (in order):
//   1. Validate + log the payload (always — keeps dev runs observable).
//   2. Add the email to the Resend Audience (the LIST — this is the growth
//      asset). Requires RESEND_API_KEY + RESEND_AUDIENCE_ID. `checkIn` maps to
//      the contact's subscription: opted-in contacts can receive the 30/90-day
//      re-engagement cadence + the occasional guide.
//   3. Send the user a transactional copy of their results, and notify
//      alfonso@. Requires RESEND_API_KEY.
//
// All network steps are env-gated and fail soft: a missing key degrades to
// "logged only" and the user still sees a success state (the PDF download is
// always available as a fallback).
// ─────────────────────────────────────────────────────────────────────────────

import { EMAIL_FROM } from "@/lib/site";

export type AssessmentEmailState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export interface FlagsByLabel {
  label: string;
  count: number;
}

export async function submitAssessmentEmail(
  _prevState: AssessmentEmailState,
  formData: FormData
): Promise<AssessmentEmailState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const checkIn = formData.get("checkIn") === "on";
  const flagsJson = (formData.get("flags") as string | null) ?? "[]";
  const totalFlags = Number(formData.get("totalFlags") ?? 0);

  // ── Validation ───────────────────────────────────────────────────────────
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return {
      status: "error",
      message: "That email doesn't look right. Try again.",
    };
  }

  let flags: FlagsByLabel[] = [];
  try {
    const parsed = JSON.parse(flagsJson);
    if (Array.isArray(parsed)) flags = parsed;
  } catch {
    // Non-fatal — proceed with empty array. The email is still useful as a
    // capture event.
  }

  // ── Always log so dev runs capture data ──────────────────────────────────
  console.log("[Assessment email-save]", {
    email,
    checkIn,
    totalFlags,
    flags,
    at: new Date().toISOString(),
  });

  // ── Send via Resend if configured ────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No service wired yet. The capture is logged and the user sees a success
    // state. Set RESEND_API_KEY (+ RESEND_AUDIENCE_ID) to build the list.
    return { status: "success" };
  }

  // ── Add to the Resend Audience (the list / growth asset) ─────────────────
  // Fail soft: a failed list-add must not block the user's results email.
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
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
            // checkIn opt-in governs the re-engagement cadence; unchecked
            // contacts are added unsubscribed so they only get this one copy.
            unsubscribed: !checkIn,
          }),
        }
      );
      if (!contactRes.ok) {
        // 409 = already a contact; that's fine, not an error worth surfacing.
        if (contactRes.status !== 409) {
          console.error(
            "Resend (audience) error",
            contactRes.status,
            await contactRes.text()
          );
        }
      }
    } catch (err) {
      console.error("Resend audience add failed:", err);
    }
  } else {
    console.warn(
      "[Assessment email-save] RESEND_AUDIENCE_ID not set — captured email not added to a list."
    );
  }

  const flagRows = flags
    .map(
      (f) => `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${escapeHtml(
            f.label
          )}</td>
          <td style="padding:6px 12px;text-align:right;font-weight:600;border-bottom:1px solid #f0f0f0">${
            f.count
          }</td>
        </tr>`
    )
    .join("");

  try {
    // Send a copy of the results to the user.
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: "Your foot-health self-check results",
        html: `
          <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
            <h2 style="color:#1C3F5E;margin-bottom:8px">Your results</h2>
            <p style="margin:0 0 16px 0;font-size:14px;color:#444">
              You flagged ${totalFlags} item${totalFlags === 1 ? "" : "s"} across the self-check.
              ${
                checkIn
                  ? "We'll check back in at 30 and 90 days. (You can ignore those if nothing changed.)"
                  : "No follow-up scheduled."
              }
            </p>
            <table style="border-collapse:collapse;width:100%;margin-top:8px">
              <thead>
                <tr>
                  <th style="text-align:left;padding:6px 12px;background:#f7f7f7;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#666">Section</th>
                  <th style="text-align:right;padding:6px 12px;background:#f7f7f7;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#666">Flags</th>
                </tr>
              </thead>
              <tbody>${flagRows}</tbody>
            </table>
            <p style="margin-top:20px;font-size:13px;color:#444">
              The full result page is still open in your browser if you want
              to come back to it.
            </p>
            <p style="margin-top:24px;font-size:11px;color:#888">
              Sent from mensolerevival.com · this is not a medical diagnosis.
            </p>
          </div>
        `,
      }),
    });

    if (!userRes.ok) {
      const body = await userRes.text();
      console.error("Resend (user) error", userRes.status, body);
      return {
        status: "error",
        message: "Couldn't send right now. Try the PDF download instead.",
      };
    }

    // Also notify Alfonso so capture is visible without log inspection.
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: ["alfonso@barreiro.com"],
        subject: `Assessment capture — ${totalFlags} flags${checkIn ? " · check-in opted in" : ""}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;color:#1a1a1a">
            <h3 style="color:#1C3F5E">New assessment capture</h3>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Total flags:</strong> ${totalFlags}</p>
            <p><strong>30/90 check-in:</strong> ${checkIn ? "yes" : "no"}</p>
            <p><strong>Flags by section:</strong></p>
            <table style="border-collapse:collapse">
              <tbody>${flagRows}</tbody>
            </table>
          </div>
        `,
      }),
    });

    return { status: "success" };
  } catch (err) {
    console.error("Assessment email action error:", err);
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
