import { createHash, createHmac, timingSafeEqual } from "crypto";

/**
 * Admin access for /admin/*: the key is exchanged once, at /admin/open, for
 * a signed session cookie. The key itself never sits in a URL after that, so
 * it stays out of browser history, request logs and analytics page views.
 */

export const ADMIN_COOKIE = "msr_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function key(): Buffer | null {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return null;
  return createHash("sha256").update(`msr-admin-session|${adminKey}`).digest();
}

function same(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** True when `provided` equals ADMIN_KEY, compared in constant time. */
export function adminKeyMatches(provided: string | null | undefined): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected || !provided) return false;
  return same(Buffer.from(expected), Buffer.from(provided));
}

export function createAdminSession(): string | null {
  const k = key();
  if (!k) return null;
  const issued = String(Date.now());
  return `${issued}.${createHmac("sha256", k).update(issued).digest("base64url")}`;
}

export function verifyAdminSession(value: string | undefined): boolean {
  const k = key();
  if (!k || !value) return false;
  const [issued, sig] = value.split(".");
  if (!issued || !sig) return false;
  const expected = createHmac("sha256", k).update(issued).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(sig, "base64url");
  } catch {
    return false;
  }
  if (!same(expected, provided)) return false;
  const at = Number(issued);
  return Number.isFinite(at) && Date.now() - at < TTL_MS;
}
