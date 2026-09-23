import { createHash } from "crypto";

/**
 * A short, stable reference for an email address that is safe to log.
 * Runtime logs and log drains should never carry the address itself; this
 * lets repeat attempts be correlated without recording who made them.
 */
export function emailRef(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 8);
}
