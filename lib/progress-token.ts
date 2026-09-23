// ─────────────────────────────────────────────────────────────────────────────
// Signed magic-link tokens for the progress view. Format, keying and the
// legacy grace window live in lib/signed-token.ts. The emailed link points at
// /progress/open, which moves the token into an httpOnly cookie and redirects
// to a clean /progress/view, so the token never rides in a rendered URL.
// ─────────────────────────────────────────────────────────────────────────────
import { createSignedToken, verifySignedToken } from "@/lib/signed-token";
import { SITE_URL } from "@/lib/site";

const PURPOSE = "progress-view";
const TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export const PROGRESS_COOKIE = "msr_progress";
export const PROGRESS_COOKIE_MAX_AGE = TTL_MS / 1000;

/** Create a progress-view token for `email`, valid for 24 hours. */
export function createProgressToken(email: string): string {
  return createSignedToken(PURPOSE, email, TTL_MS);
}

/** Verify a token. Returns the email if the signature is valid and unexpired. */
export function verifyProgressToken(token: string): { email: string } | null {
  return verifySignedToken(PURPOSE, token);
}

/** Absolute magic-link URL for an email. */
export function progressUrl(token: string): string {
  return `${SITE_URL}/progress/open?token=${encodeURIComponent(token)}`;
}
