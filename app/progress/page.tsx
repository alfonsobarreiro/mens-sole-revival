"use client";

import { useActionState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";
import { requestProgressLink } from "@/app/actions/progress-magic-link";

const initialState = { status: "idle" as const };

// Progress entry page — user enters email, we send a magic link.
// Written as a Client Component so the form uses React's useActionState
// for inline error handling. The magic link expires in 24 hours and
// the actual history render happens on /progress/view (server component).
export default function ProgressPage() {
  const [state, formAction, isPending] = useActionState(
    requestProgressLink,
    initialState
  );

  if (state.status === "success") {
    return (
      <SiteLayout>
        <section className="border-b border-neutral-200 py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-2xl">
              <p className={type.overline}>Check your inbox</p>
              <h1 className={`mt-3 ${type.h1}`}>Link sent.</h1>
              <p className={`mt-6 ${type.lead}`}>
                If you've taken the assessment before, we just emailed you a link
                to see your history. Click it within 24 hours to open your
                progress view.
              </p>
              <p className="mt-6 text-sm text-neutral-500">
                Nothing lands in your inbox after a minute? That email might not
                have any past submissions on file. Take the assessment first, or
                double-check the address.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/assessment"
                  className="inline-block bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                >
                  Take the assessment
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="border-b border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className={type.overline}>Your progress</p>
            <h1 className={`mt-3 ${type.h1}`}>See what changed.</h1>
            <p className={`mt-6 ${type.lead}`}>
              Enter the email you used when you took the assessment. We'll send
              you a link to your history — flag counts, section-by-section, over
              time. No account needed. Link expires in 24 hours.
            </p>

            <form action={formAction} className="mt-10 space-y-4" noValidate>
              {state.status === "error" && (
                <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {state.message}
                </div>
              )}

              <label htmlFor="progress-email" className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Email address
                </span>
                <input
                  id="progress-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="mt-1 w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-brand-500 focus:outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={isPending}
                className="bg-accent-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {isPending ? "Sending..." : "Send me my link"}
              </button>

              <p className="text-xs text-neutral-500">
                We look up your history by email. Anyone with access to your inbox
                can open the link. Don't request one on a shared device.
              </p>
            </form>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
