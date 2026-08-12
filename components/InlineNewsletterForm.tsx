"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { type } from "@/components/typography";
import { submitNewsletter } from "@/app/actions/newsletter";

const initialState = { status: "idle" as const };

// ─────────────────────────────────────────────────────────────────────────────
// InlineNewsletterForm — reusable single-field capture.
// Uses DS Button + Input primitives (Input.tsx supports tone="light"|"dark").
// Same server action as /newsletter, so double opt-in + Resend audience wiring
// stay identical. Lead-magnet framing (5-minute foot check) is the differentiator.
// ─────────────────────────────────────────────────────────────────────────────

type Tone = "light" | "dark";

interface Props {
  tone?: Tone;
  heading?: string;
  body?: string;
  cta?: string;
  reassurance?: string;
}

const DEFAULT_HEADING = "Get the 5-minute foot check.";
const DEFAULT_BODY =
  "Same questions the assessment asks, printable, yours to keep. Free.";
const DEFAULT_CTA = "Send it to me";
const DEFAULT_REASSURANCE =
  "One confirmation email, then the check. Unsubscribe anytime.";

export default function InlineNewsletterForm({
  tone = "light",
  heading = DEFAULT_HEADING,
  body = DEFAULT_BODY,
  cta = DEFAULT_CTA,
  reassurance = DEFAULT_REASSURANCE,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitNewsletter,
    initialState
  );

  const isDark = tone === "dark";

  const headingClass = `${type.h2} ${isDark ? "text-white" : "text-ink"}`;

  const bodyClass = isDark
    ? "mt-3 text-[0.9375rem] leading-[1.5] text-inverse-body"
    : "mt-3 text-[0.9375rem] leading-[1.5] text-neutral-600";

  const reassuranceClass = isDark
    ? "mt-3 text-xs text-inverse-muted"
    : "mt-3 text-xs text-neutral-500";

  // Success state — inline confirmation, no page redirect.
  if (state.status === "success") {
    return (
      <div>
        <h2 className={headingClass}>Check your inbox.</h2>
        <p className={bodyClass}>
          Click the confirmation link we just sent. Once you confirm, the
          5-minute foot check is yours. (No link yet? Check your spam folder.
          It lands within a minute.)
        </p>
        <p className={reassuranceClass}>
          <Link
            href="/foot-check"
            className={
              isDark
                ? "text-accent-300 underline underline-offset-4 hover:text-white"
                : "text-link underline underline-offset-4 hover:text-link-hover"
            }
          >
            See the checklist now →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={headingClass}>{heading}</h2>
      <p className={bodyClass}>{body}</p>

      <form action={formAction} className="mt-6 space-y-3" noValidate>
        {state.status === "error" && !state.field && (
          <div className="border border-signal-error/30 bg-signal-error/10 px-4 py-2 text-sm text-signal-error">
            {state.message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            id="ilf-email"
            name="email"
            type="email"
            required
            label="Email address"
            hideLabel
            placeholder="you@example.com"
            autoComplete="email"
            tone={tone}
            error={
              state.status === "error" && state.field === "email"
                ? state.message
                : undefined
            }
            containerClassName="flex-1"
          />
          <Button type="submit" disabled={isPending} size="md">
            {isPending ? "Sending…" : cta}
          </Button>
        </div>
      </form>

      <p className={reassuranceClass}>{reassurance}</p>
    </div>
  );
}
