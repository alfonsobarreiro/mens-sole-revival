// ─────────────────────────────────────────────────────────────────────────────
// GET /check-ins/stop?token=...  →  verify the signed link from a check-in
// email, switch check-ins off for that address, redirect to a plain
// confirmation page. Idempotent: a second click is still "stopped".
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse, type NextRequest } from "next/server";
import { verifyCheckInStopToken } from "@/lib/checkin-token";
import { emailRef } from "@/lib/log-safe";
import { stopCheckIns, submissionsConfigured } from "@/lib/submissions/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const dest = (status: string) =>
    NextResponse.redirect(new URL(`/check-ins/stopped?status=${status}`, req.nextUrl.origin));

  const result = verifyCheckInStopToken(token);
  if (!result) return dest("invalid");

  if (submissionsConfigured()) {
    try {
      await stopCheckIns(result.email);
    } catch (err) {
      console.error("[check-ins] stop failed", {
        to: emailRef(result.email),
        type: err instanceof Error ? err.name : typeof err,
      });
      return dest("error");
    }
  }
  return dest("ok");
}
