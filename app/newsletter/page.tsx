"use client";

import { useActionState } from "react";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";
import { submitNewsletter } from "@/app/actions/newsletter";

const initialState = { status: "idle" as const };

// ── Success screen ───────────────────────────────────────────────────────────
function SuccessView() {
  return (
    <SiteLayout>
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Almost there</p>
            <h1 className={`mt-3 ${type.h1}`}>Confirm your email.</h1>
            <p className={`mt-6 ${type.lead}`}>
              We just sent you a confirmation link. Click it and you'll start
              getting new guides, reviews, and routines. (No link yet? Check your
              spam folder — it lands within a minute.)
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-md rounded-lg border border-neutral-200 bg-brand-50 p-8 text-center shadow-sm">
            {/* Checkmark */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className={type.h4}>Check your inbox.</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Click the confirmation link we just emailed you to finish
              subscribing. The link expires in 48 hours.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function NewsletterPage() {
  const [state, formAction, isPending] = useActionState(
    submitNewsletter,
    initialState
  );

  if (state.status === "success") {
    return <SuccessView />;
  }

  return (
    <SiteLayout>
      {/* ── Header ── */}
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>The Newsletter</p>
            <h1 className={`mt-3 ${type.h1}`}>
              New guides, reviews, and routines — in your inbox.
            </h1>
            <p className={`mt-6 ${type.lead}`}>
              We publish evidence-based guides, product reviews, and daily
              routines for men over 40 — foot pain, fit, alignment, nails, skin.
              Subscribe and we'll send the new ones as they land, plus the
              occasional practical tip. No spam. Unsubscribe anytime.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Form ── */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-md">
            <form action={formAction} className="space-y-5" noValidate>

              {/* Global error banner */}
              {state.status === "error" && !state.field && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {state.message}
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className={`block mb-2 ${type.label}`}>
                  Your name{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Alfonso"
                  autoComplete="given-name"
                  className={`w-full rounded border px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition ${
                    state.status === "error" && state.field === "name"
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-neutral-300 focus:border-brand-500 focus:ring-brand-100"
                  }`}
                />
                {state.status === "error" && state.field === "name" && (
                  <p className="mt-1.5 text-xs text-red-600">{state.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={`block mb-2 ${type.label}`}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full rounded border px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition ${
                    state.status === "error" && state.field === "email"
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-neutral-300 focus:border-brand-500 focus:ring-brand-100"
                  }`}
                />
                {state.status === "error" && state.field === "email" && (
                  <p className="mt-1.5 text-xs text-red-600">{state.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    {/* Spinner */}
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Subscribing…
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>

              <p className="text-xs text-neutral-400">
                No spam. Unsubscribe at any time. We take privacy seriously.
              </p>
            </form>
          </div>
        </Container>
      </section>

      {/* ── Reassurance ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                heading: "Evidence, not hype",
                body: "Every guide is grounded in real research and what actually works. No miracle cures, no supplement pitches.",
              },
              {
                heading: "Occasional, not constant",
                body: "We email when there's something worth reading — not on a schedule to hit a quota.",
              },
              {
                heading: "Yours to leave",
                body: "One click to unsubscribe, always. Your address stays private and never gets sold.",
              },
            ].map((item) => (
              <div key={item.heading}>
                <h3 className={type.h4}>{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
