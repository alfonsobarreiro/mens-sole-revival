import { timingSafeEqual } from "crypto";
import { buildCheckInEmail } from "@/lib/checkin-email-template";
import { checkInStopUrl, createCheckInStopToken } from "@/lib/checkin-token";
import { emailRef } from "@/lib/log-safe";
import { EMAIL_FROM } from "@/lib/site";
import {
  dueCheckIns,
  markCheckInSent,
  submissionsConfigured,
  type CheckInKind,
} from "@/lib/submissions/store";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/cron/check-ins
//
// Runs once a day from Vercel Cron (vercel.json). For each address whose
// latest opted-in submission crossed the 30-day or 90-day mark, sends one
// email and stamps the row, so a rerun sends nothing twice. Vercel calls it
// with "Authorization: Bearer <CRON_SECRET>"; any other caller gets 401.
//
// ?dry=1 reports what would be sent and sends nothing (for local checks).
// Logs carry counts and hashed addresses only.
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KINDS: CheckInKind[] = [30, 90];

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET) {
    console.error("[check-ins] CRON_SECRET is not set");
    return json({ code: "not_configured" }, 503);
  }
  if (!authorized(request)) return json({ code: "unauthorized" }, 401);

  const dry = new URL(request.url).searchParams.get("dry") === "1";
  if (!submissionsConfigured()) return json({ code: "no_database", sent: 0 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !dry) {
    console.error("[check-ins] RESEND_API_KEY is not set");
    return json({ code: "not_configured" }, 503);
  }

  const report: Record<string, { due: number; sent: number; failed: number }> = {};

  for (const kind of KINDS) {
    const due = await dueCheckIns(kind);
    const tally = { due: due.length, sent: 0, failed: 0 };
    report[`day${kind}`] = tally;
    if (dry) continue;

    for (const item of due) {
      const { subject, html } = buildCheckInEmail({
        kind,
        stopUrl: checkInStopUrl(createCheckInStopToken(item.email)),
      });
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: EMAIL_FROM, to: [item.email], subject, html }),
        });
        if (!res.ok) {
          tally.failed += 1;
          console.error("[check-ins] send failed", { kind, status: res.status, to: emailRef(item.email) });
          continue;
        }
        await markCheckInSent(item.id, kind);
        tally.sent += 1;
      } catch (err) {
        tally.failed += 1;
        console.error("[check-ins] send error", {
          kind,
          to: emailRef(item.email),
          type: err instanceof Error ? err.name : typeof err,
        });
      }
    }
  }

  console.log("[check-ins] run", { dry, ...report });
  return json({ dry, ...report });
}
