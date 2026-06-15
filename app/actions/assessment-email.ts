"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Assessment email-save Server Action.
//
// Capture flow (in order):
//   1. Validate + log the payload (always — keeps dev runs observable).
//   2. Add the email to the Resend Audience (the LIST — the growth asset).
//      `checkIn` governs whether they're subscribed or one-copy-only.
//   3. Email the user a FULL copy of their results — the same recommendations
//      the on-screen result page and the PDF show (guides, routine, podiatrist
//      prep, sources), rebuilt server-side from the structured payload via
//      composeResult() + the template in lib/assessment-email-template.ts.
//      Then notify alfonso@.
//
// All network steps are env-gated and fail soft.
// ─────────────────────────────────────────────────────────────────────────────

import { EMAIL_FROM } from "@/lib/site";
import {
  composeResult,
  type SectionId,
  type Duration,
} from "@/lib/assessment-routing";
import { buildResultEmail } from "@/lib/assessment-email-template";

export type AssessmentEmailState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export interface FlagsByLabel {
  label: string;
  count: number;
}

function parseJson<T>(raw: FormDataEntryValue | null, fallback: T): T {
  if (typeof raw !== "string") return fallback;
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export async function submitAssessmentEmail(
  _prevState: AssessmentEmailState,
  formData: FormData
): Promise<AssessmentEmailState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const checkIn = formData.get("checkIn") === "on";
  const totalFlags = Number(formData.get("totalFlags") ?? 0);

  const flags = parseJson<FlagsByLabel[]>(formData.get("flags"), []);
  const flagsBySection = parseJson<Partial<Record<SectionId, number>>>(formData.get("flagsBySection"), {});
  const durationBySection = parseJson<Partial<Record<SectionId, Duration>>>(formData.get("durationBySection"), {});
  const itemsBySection = parseJson<Partial<Record<SectionId, string[]>>>(formData.get("itemsBySection"), {});
  const attemptedSections = parseJson<SectionId[]>(formData.get("attemptedSections"), []);
  const notSureCount = Number(formData.get("notSureCount") ?? 0);

  // ── Validation ───────────────────────────────────────────────────────────
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return { status: "error", message: "That email doesn't look right. Try again." };
  }

  // ── Always log so dev runs capture data ──────────────────────────────────
  console.log("[Assessment email-save]", { email, checkIn, totalFlags, flags, at: new Date().toISOString() });

  // ── Send via Resend if configured ────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "success" };
  }

  // ── Add to the Resend Audience (the list / growth asset) ─────────────────
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
      const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email, unsubscribed: !checkIn }),
      });
      if (!contactRes.ok && contactRes.status !== 409) {
        console.error("Resend (audience) error", contactRes.status, await contactRes.text());
      }
    } catch (err) {
      console.error("Resend audience add failed:", err);
    }
  } else {
    console.warn("[Assessment email-save] RESEND_AUDIENCE_ID not set — captured email not added to a list.");
  }

  // ── Rebuild the full recommendations server-side (parity with page + PDF) ─
  const composed = composeResult({ flagsBySection, durationBySection, notSureCount });
  const resultHtml = buildResultEmail({
    totalFlags,
    checkIn,
    attemptedSections,
    flagsBySection,
    durationBySection,
    itemsBySection,
    composed,
  });

  try {
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: "Your foot-health results — and what to do next",
        html: resultHtml,
      }),
    });

    if (!userRes.ok) {
      const body = await userRes.text();
      console.error("Resend (user) error", userRes.status, body);
      return { status: "error", message: "Couldn't send right now. Try the PDF download instead." };
    }

    // Notify alfonso@ (terse ops email).
    const flagRows = flags
      .map(
        (f) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${escapeHtml(f.label)}</td><td style="padding:6px 12px;text-align:right;font-weight:600;border-bottom:1px solid #f0f0f0">${f.count}</td></tr>`
      )
      .join("");
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: ["alfonso@barreiro.com"],
        subject: `Assessment capture — ${totalFlags} flags${checkIn ? " · check-in opted in" : ""}`,
        html: `<div style="font-family:sans-serif;max-width:520px;color:#1a1a1a"><h3 style="color:#1C3F5E">New assessment capture</h3><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Total flags:</strong> ${totalFlags}</p><p><strong>30/90 check-in:</strong> ${checkIn ? "yes" : "no"}</p><table style="border-collapse:collapse"><tbody>${flagRows}</tbody></table></div>`,
      }),
    });

    return { status: "success" };
  } catch (err) {
    console.error("Assessment email action error:", err);
    return { status: "error", message: "Network hiccup. Try again in a moment." };
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
