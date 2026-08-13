import Link from "next/link";
import Container from "@/components/Container";
import { type } from "@/components/typography";

// AssessmentProofBlock — permanent stat display for the site's own traction.
// Two-column layout: heading + description on the left, stat numbers stacked
// on the right. Numbers are hardcoded for now; wire GA4 later if useful.
const STATS = [
  { value: "78",     label: "men have taken the assessment", context: "since April 2026" },
  { value: "86%",    label: "finish the assessment",         context: "started → results" },
  { value: "4m 30s", label: "average time to complete",      context: "honest self-check, not a drop-off" },
];

export default function AssessmentProofBlock() {
  return (
    <section className="bg-neutral-100 py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

          {/* LEFT — heading + description */}
          <div>
            <h2 className={`${type.displaySection} text-ink`}>
              What&rsquo;s already happening.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-neutral-600">
              The assessment has been live since April 2026. Real men are
              taking it, finishing it, and using the results to have a better
              conversation with a doctor or start a routine that fits them.
            </p>
            <Link
              href="/assessment"
              className="mt-6 inline-block text-sm font-medium text-link underline underline-offset-4 transition hover:text-link-hover"
            >
              See the assessment →
            </Link>
          </div>

          {/* RIGHT — stat stack */}
          <div className="flex flex-col divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {STATS.map((s) => (
              <div key={s.value} className="py-6 flex flex-col gap-1">
                <span className="font-heading text-4xl font-medium leading-none text-ink md:text-5xl">
                  {s.value}
                </span>
                <span className="mt-2 text-base leading-6 text-neutral-600">
                  {s.label}
                </span>
                <span className="text-xs font-medium text-accent-700">
                  {s.context}
                </span>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
