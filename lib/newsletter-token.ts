// ─────────────────────────────────────────────────────────────────────────────
// Stateless, signed confirmation tokens for newsletter double opt-in.
// Format, keying and the legacy grace window live in lib/signed-token.ts;
// this module only fixes the purpose and the lifetime.
// ─────────────────────────────────────────────────────────────────────────────
import { createSignedToken, verifySignedToken } from "@/lib/signed-token";
import { SITE_URL } from "@/lib/site";

const PURPOSE = "newsletter-confirm";
const TTL_MS = 1000 * 60 * 60 * 48; // 48 hours

/** Create a confirmation token for `email`, valid for 48 hours. */
export function createConfirmToken(email: string): string {
  return createSignedToken(PURPOSE, email, TTL_MS);
}

/** Verify a token. Returns the email if the signature is valid and unexpired. */
export function verifyConfirmToken(token: string): { email: string } | null {
  return verifySignedToken(PURPOSE, token);
}

/** Absolute confirmation URL for an email link. */
export function confirmUrl(token: string): string {
  return `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(token)}`;
}
