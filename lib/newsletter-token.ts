// ─────────────────────────────────────────────────────────────────────────────
// Stateless, signed confirmation tokens for newsletter double opt-in.
//
// A token is `base64url(payload).base64url(hmac)` where payload is
// `email|expiry`. The HMAC (SHA-256) is keyed with RESEND_API_KEY — a strong,
// server-only secret already present in every environment, so this needs no new
// env var. No database: the signature is the proof, the expiry bounds the link.
// Rotating the API key invalidates outstanding confirm links (acceptable — they
// only live 48h anyway).
// ─────────────────────────────────────────────────────────────────────────────
import { createHmac, timingSafeEqual } from "crypto";
import { SITE_URL } from "@/lib/site";

const TTL_MS = 1000 * 60 * 60 * 48; // 48 hours

function signingSecret(): string {
  const secret = process.env.RESEND_API_KEY;
  if (!secret) {
    throw new Error("RESEND_API_KEY is required to sign confirmation tokens.");
  }
  return secret;
}

function hmac(payload: string): Buffer {
  return createHmac("sha256", signingSecret()).update(payload).digest();
}

/** Create a confirmation token for `email`, valid for 48 hours. */
export function createConfirmToken(email: string): string {
  const payload = `${email}|${Date.now() + TTL_MS}`;
  return `${Buffer.from(payload).toString("base64url")}.${hmac(payload).toString(
    "base64url"
  )}`;
}

/** Verify a token. Returns the email if the signature is valid and unexpired. */
export function verifyConfirmToken(token: string): { email: string } | null {
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
  // Constant-time compare; bail if lengths differ (timingSafeEqual throws otherwise).
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

/** Absolute confirmation URL for an email link. */
export function confirmUrl(token: string): string {
  return `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(token)}`;
}
