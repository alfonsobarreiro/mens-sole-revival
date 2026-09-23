import { createHash, createHmac, timingSafeEqual } from "crypto";
import { SITE_URL } from "@/lib/site";

/**
 * One-click "stop my check-ins" links. No expiry: the link in a 30-day email
 * must still work when the 90-day email arrives, and long after. The payload
 * carries a purpose tag and the key is derived for this purpose alone, so
 * this token opens nothing else on the site and nothing else opens this.
 */
const PURPOSE = "msr-checkin-stop-v1";

function signingKey(): Buffer {
  const base = process.env.RESEND_API_KEY;
  if (!base) throw new Error("RESEND_API_KEY is required to sign check-in tokens.");
  return createHash("sha256").update(`${PURPOSE}|${base}`).digest();
}

function hmac(payload: string): Buffer {
  return createHmac("sha256", signingKey()).update(payload).digest();
}

export function createCheckInStopToken(email: string): string {
  const payload = `${PURPOSE}|${email.trim().toLowerCase()}`;
  return `${Buffer.from(payload).toString("base64url")}.${hmac(payload).toString("base64url")}`;
}

export function verifyCheckInStopToken(token: string): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  let payload: string;
  let provided: Buffer;
  try {
    payload = Buffer.from(parts[0], "base64url").toString("utf8");
    provided = Buffer.from(parts[1], "base64url");
  } catch {
    return null;
  }
  const expected = hmac(payload);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  const prefix = `${PURPOSE}|`;
  if (!payload.startsWith(prefix)) return null;
  const email = payload.slice(prefix.length);
  return email ? { email } : null;
}

export function checkInStopUrl(token: string): string {
  return `${SITE_URL}/check-ins/stop?token=${encodeURIComponent(token)}`;
}
