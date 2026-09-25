import { createHash, createHmac, timingSafeEqual } from "crypto";

/**
 * Assistant turns are signed on the way out and checked on the way back in.
 *
 * The client keeps the conversation and replays it as history with every
 * question. Without a check, anything can be sent in the assistant role and
 * the model will treat it as its own prior behaviour ("as I said, the
 * diagnosis is..."). So the route signs the exact text it streamed, the client
 * stores the signature next to the turn, and the route refuses any assistant
 * turn whose signature is missing or does not match. A stopped or failed
 * reply never gets a signature and simply drops out of the history.
 *
 * The key is derived from ASK_SIGNING_SECRET, or from the Anthropic key when
 * no dedicated secret is set, so nothing new is required to deploy. Rotating
 * either invalidates conversations in flight, which only means a fresh start.
 */
const PURPOSE = "msr-ask-turn-v1";

function signingKey(): Buffer {
  const base = process.env.ASK_SIGNING_SECRET ?? process.env.ANTHROPIC_API_KEY;
  if (!base) {
    throw new Error("ASK_SIGNING_SECRET (or ANTHROPIC_API_KEY) is required to sign assistant turns.");
  }
  // Derived rather than reused: the API key itself never acts as an HMAC key.
  return createHash("sha256").update(`${PURPOSE}|${base}`).digest();
}

/** Signature for the text of one completed assistant turn. */
export function signTurn(text: string): string {
  return createHmac("sha256", signingKey()).update(text, "utf8").digest("base64url");
}

/** True only when `sig` was produced by signTurn for exactly this text. */
export function verifyTurn(text: string, sig: unknown): boolean {
  if (typeof sig !== "string" || sig.length === 0 || sig.length > 64) return false;
  const expected = Buffer.from(signTurn(text), "utf8");
  const provided = Buffer.from(sig, "utf8");
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}
