"use client";

import { useActionState, useState } from "react";
import {
  submitAssessmentFeedback,
  type FeedbackState,
} from "@/app/actions/assessment-feedback";

const initialState: FeedbackState = { status: "idle" };

const options = [
  { value: "yes", label: "Yes" },
  { value: "somewhat", label: "Somewhat" },
  { value: "no", label: "Not really" },
];

interface AssessmentFeedbackProps {
  /** Total flags from the user's current session. Sent along with
   * the feedback as anonymised context so we can correlate
   * usefulness with severity. */
  totalFlags: number;
}

/**
 * Two-question feedback form embedded on the assessment results screen.
 * Pairs with app/actions/assessment-feedback.ts. Captures usefulness +
 * a freeform "what would have helped" so Alfonso can iterate on the
 * results screen with real data instead of speculation.
 */
export default function AssessmentFeedback({
  totalFlags,
}: AssessmentFeedbackProps) {
  const [state, formAction, isPending] = useActionState(
    submitAssessmentFeedback,
    initialState
  );
  const [usefulness, setUsefulness] = useState<string>("");

  if (state.status === "success") {
    return (
      <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-8">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
          Thanks
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          That helps. Every reply is read by the person who designed this.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="border-t border-neutral-200 bg-neutral-50 px-6 py-8"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
        Help shape this
      </p>
      <p className="mt-2 font-display text-lg font-bold uppercase leading-tight text-brand-900">
        Was this useful?
      </p>

      {/* Hidden context */}
      <input type="hidden" name="totalFlags" value={String(totalFlags)} />

      {/* Usefulness chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = usefulness === opt.value;
          return (
            <label
              key={opt.value}
              className={`cursor-pointer border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                selected
                  ? "border-brand-900 bg-brand-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-brand-500"
              }`}
            >
              <input
                type="radio"
                name="usefulness"
                value={opt.value}
                className="sr-only"
                checked={selected}
                onChange={() => setUsefulness(opt.value)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>

      {/* Freeform follow-up */}
      <label
        htmlFor="improvement"
        className="mt-5 block text-xs font-semibold uppercase tracking-wider text-neutral-500"
      >
        What would have made it more useful? (optional)
      </label>
      <textarea
        id="improvement"
        name="improvement"
        rows={3}
        maxLength={1000}
        placeholder="A specific result you wanted. A question that wasn't asked. Anything."
        className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2 text-sm leading-6 text-neutral-800 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none"
      />

      {/* Submit */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending || !usefulness}
          className="bg-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isPending ? "Sending..." : "Send feedback"}
        </button>
        {state.status === "error" && state.message && (
          <p className="text-xs text-red-600">{state.message}</p>
        )}
      </div>
    </form>
  );
}
