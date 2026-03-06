"use client";

import { useActionState } from "react";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";
import { submitWaitlist } from "@/app/actions/waitlist";

const initialState = { status: "idle" as const };

// ── Success screen ───────────────────────────────────────────────────────────
function SuccessView() {
  return (
    <SiteLayout>
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Early Access</p>
            <h1 className={`mt-3 ${type.h1}`}>You're on the list.</h1>
            <p className={`mt-6 ${type.lead}`}>
              We'll be in touch when your kit is ready. No spam, ever — just a
              note when something meaningful is ready for you.
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
            <p className={type.h4}>Submission received.</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              We're working through the waitlist carefully. Expect to hear from
              us within a few weeks — or sooner if your kit ships first.
            </p>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function WaitlistPage() {
  const [state, formAction, isPending] = useActionState(
    submitWaitlist,
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
            <p className={type.overline}>Early Access</p>
            <h1 className={`mt-3 ${type.h1}`}>
              Be first when kits and guides launch.
            </h1>
            <p className={`mt-6 ${type.lead}`}>
              We're building this carefully. Join the waitlist and help shape
              what gets built first. No spam, no pressure — just occasional
              updates when things are ready.
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
                  Your name
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

              {/* Kit selector */}
              <div>
                <label htmlFor="kit" className={`block mb-2 ${type.label}`}>
                  Which kit are you most interested in?{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <select
                  id="kit"
                  name="kit"
                  className="w-full rounded border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
                >
                  <option value="">Select a kit…</option>
                  <option value="pain-recovery">Pain &amp; Recovery</option>
                  <option value="fungus-care">Fungus &amp; Nail Care</option>
                  <option value="alignment-mobility">Toe Alignment &amp; Mobility</option>
                  <option value="dry-skin">Dry Skin &amp; Cracking</option>
                  <option value="odor-hygiene">Odor &amp; Hygiene</option>
                  <option value="footwear-fit">Footwear Fit</option>
                </select>
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
                    Submitting…
                  </>
                ) : (
                  "Join the Waitlist"
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
                heading: "No commerce yet",
                body: "We're building this before we sell anything. Waitlist members get first access and a say in what ships.",
              },
              {
                heading: "Your input shapes the product",
                body: "The kit you select tells us what to prioritize. We read every response.",
              },
              {
                heading: "Occasional updates only",
                body: "We won't email you weekly. You'll hear from us when something meaningful is ready.",
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
