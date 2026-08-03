// ─────────────────────────────────────────────────────────────────────────────
// Stateless, signed magic-link tokens for /progress.
//
// Same signing model as lib/newsletter-token.ts: base64url(payload).base64url(hmac)
// where payload is `email|expiry`. HMAC (SHA-256) keyed with RESEND_API_KEY so
// there's no new secret to manage; rotating the API key invalidates outstanding
// links (acceptable — they only live 24 hours).
//
// TTL is shorter than the newsletter confirm token (24h vs 48h) because the
// magic link exposes personal health data (all past assessment submissions
// for that email). Shorter window means a leaked or forwarded link decays fast.
// ─────────────────────────────────────────────────────────────────────────────
import { createHmac, timingSafeEqual } from "crypto";
import { SITE_URL } from "@/lib/site";

const TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function signingSecret(): string {
  const secret = process.env.RESEND_API_KEY;
  if (!secret) {
    throw new Error("RESEND_API_KEY is required to sign progress tokens.");
  }
  return secret;
}

function hmac(payload: string): Buffer {
  return createHmac("sha256", signingSecret()).update(payload).digest();
}

/** Create a progress-view token for `email`, valid for 24 hours. */
export function createProgressToken(email: string): string {
  const payload = `${email}|${Date.now() + TTL_MS}`;
  return `${Buffer.from(payload).toString("base64url")}.${hmac(payload).toString(
    "base64url"
  )}`;
}

/** Verify a token. Returns the email if the signature is valid and unexpired. */
export function verifyProgressToken(token: string): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  let payload: string;
  try {
    payload = Buffer.from(parts[0], "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expected = hmac(payload);
  let provided: Buffer;
  try {
    provided = Buffer.from(parts[1], "base64url");
  } catch {
    return null;
  }
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return null;
  }

  const sep = payload.lastIndexOf("|");
  if (sep < 0) return null;
  const email = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!email || !Number.isFinite(exp) || Date.now() > exp) return null;

  return { email };
}

/** Absolute magic-link URL for an email. */
export function progressUrl(token: string): string {
  return `${SITE_URL}/progress/view?token=${encodeURIComponent(token)}`;
}
