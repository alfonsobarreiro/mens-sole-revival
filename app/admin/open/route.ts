// ─────────────────────────────────────────────────────────────────────────────
// GET /admin/open?key=...  →  exchanges ADMIN_KEY for a signed 12-hour cookie
// and redirects to the stats page on a clean URL. Wrong or missing key: 404,
// the same as the page itself, so the route reveals nothing.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminKeyMatches, createAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const session = adminKeyMatches(key) ? createAdminSession() : null;
  if (!session) return new NextResponse(null, { status: 404 });

  const res = NextResponse.redirect(new URL("/admin/assessment-stats", req.nextUrl.origin));
  res.cookies.set(ADMIN_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
