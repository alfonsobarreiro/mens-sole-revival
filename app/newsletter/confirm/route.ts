// ─────────────────────────────────────────────────────────────────────────────
// Newsletter double opt-in confirmation endpoint.
//
// GET /newsletter/confirm?token=...  →  verify signature + expiry, flip the
// Resend contact to subscribed (unsubscribed:false), notify alfonso@ of a
// *confirmed* signup, then redirect to the confirmed page.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse, type NextRequest } from "next/server";
import { verifyConfirmToken } from "@/lib/newsletter-token";
import { EMAIL_FROM } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const result = verifyConfirmToken(token);

  // Redirect relative to the current origin so this works in dev and prod.
  const dest = (status: string) =>
    NextResponse.redirect(new URL(`/newsletter/confirmed?status=${status}`, req.nextUrl.origin));

  if (!result) return dest("invalid");

  const { email } = result;
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (apiKey && audienceId) {
    try {
      // Flip pending → subscribed.
      const patch = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unsubscribed: false }),
        }
      );
      if (!patch.ok) {
        console.error("Resend (confirm update) error", patch.status, await patch.text());
      }

      // Notify alfonso@ — now it means a genuinely confirmed subscriber.
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: ["alfonso@barreiro.com"],
          subject: `New confirmed subscriber — ${email}`,
          html: `<div style="font-family:sans-serif;color:#1a1a1a"><h3 style="color:#1C3F5E">New confirmed subscriber</h3><p>${escapeHtml(
            email
          )} confirmed their newsletter subscription.</p></div>`,
        }),
      });
    } catch (err) {
      console.error("Newsletter confirm error:", err);
      // Token was valid; treat as confirmed even if the notification hiccupped.
    }
  }

  return dest("ok");
}
