import { createHash, createHmac, timingSafeEqual } from "crypto";

/**
 * Signed, stateless email tokens with a purpose tag.
 *
 * Token = base64url(payload) "." base64url(hmac). The payload carries the
 * purpose, the address and the expiry, and the HMAC key is derived per
 * purpose from RESEND_API_KEY, so a newsletter-confirm token can never open
 * the progress view and vice versa. Before 2026-09-23 both flows used the
 * bare `email|expiry` payload with the raw key; those links stay valid until
 * LEGACY_UNTIL so nothing in an inbox breaks on deploy, then the legacy path
 * switches itself off.
 */

/** After this instant, only purpose-tagged tokens verify. */
const LEGACY_UNTIL = Date.parse("2026-09-26T00:00:00Z");

function baseSecret(): string {
  const secret = process.env.RESEND_API_KEY;
  if (!secret) throw new Error("RESEND_API_KEY is required to sign tokens.");
  return secret;
}

function hmac(key: Buffer | string, payload: string): Buffer {
  return createHmac("sha256", key).update(payload).digest();
}

function purposeKey(purpose: string): Buffer {
  return createHash("sha256").update(`${purpose}|${baseSecret()}`).digest();
}

function split(token: string): { payload: string; provided: Buffer } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  try {
    return {
      payload: Buffer.from(parts[0], "base64url").toString("utf8"),
      provided: Buffer.from(parts[1], "base64url"),
    };
  } catch {
    return null;
  }
}

function same(expected: Buffer, provided: Buffer): boolean {
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export function createSignedToken(purpose: string, email: string, ttlMs: number): string {
  const payload = `${purpose}|${email}|${Date.now() + ttlMs}`;
  return `${Buffer.from(payload).toString("base64url")}.${hmac(purposeKey(purpose), payload).toString("base64url")}`;
}

/** The email if the token was issued for this purpose and has not expired. */
export function verifySignedToken(purpose: string, token: string): { email: string } | null {
  const parts = split(token);
  if (!parts) return null;
  const { payload, provided } = parts;

  // Current format: purpose|email|expiry, purpose-derived key.
  if (payload.startsWith(`${purpose}|`) && same(hmac(purposeKey(purpose), payload), provided)) {
    const rest = payload.slice(purpose.length + 1);
    const sep = rest.lastIndexOf("|");
    if (sep < 0) return null;
    const email = rest.slice(0, sep);
    const exp = Number(rest.slice(sep + 1));
    if (!email || !Number.isFinite(exp) || Date.now() > exp) return null;
    return { email };
  }

  // Legacy format: email|expiry, raw key. Accepted only during the grace window.
  if (Date.now() < LEGACY_UNTIL && same(hmac(baseSecret(), payload), provided)) {
    const sep = payload.lastIndexOf("|");
    if (sep < 0) return null;
    const email = payload.slice(0, sep);
    const exp = Number(payload.slice(sep + 1));
    if (!email || !Number.isFinite(exp) || Date.now() > exp) return null;
    return { email };
  }

  return null;
}
