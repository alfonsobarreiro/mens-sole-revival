// ─────────────────────────────────────────────────────────────────────────────
// GET /progress/open?token=...  →  the link from the magic-link email lands
// here. The token is verified, moved into an httpOnly cookie scoped to
// /progress, and the visitor is redirected to a clean /progress/view. The
// token never appears in the URL the page renders on, so it stays out of
// analytics page views, browser history and any referrer.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse, type NextRequest } from "next/server";
import { PROGRESS_COOKIE, PROGRESS_COOKIE_MAX_AGE, verifyProgressToken } from "@/lib/progress-token";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const res = NextResponse.redirect(new URL("/progress/view", req.nextUrl.origin));

  if (!verifyProgressToken(token)) {
    res.cookies.delete(PROGRESS_COOKIE);
    return res;
  }

  res.cookies.set(PROGRESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/progress",
    maxAge: PROGRESS_COOKIE_MAX_AGE,
  });
  return res;
}
