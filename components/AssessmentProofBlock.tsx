import Link from "next/link";
import Container from "@/components/Container";
import { type } from "@/components/typography";

// AssessmentProofBlock — permanent stat display for the site's own traction.
//
// Placement:
//   - Home: below the founder quote, above the industry-stat section.
//   - About: below the mission callout, above the values section.
//
// Copy discipline: numbers are big, sub-labels give context so 78 doesn't
// read as thin evidence — "since April 2026" frames it as ongoing traction,
// not a one-time count. Section eyebrow ("WHAT'S ALREADY HAPPENING") names
// this as proof of MSR, distinct from the industry-scale problem stats.
//
// Numbers are hardcoded for now. Later, if GA4 Reporting API is wired,
// this becomes the auto-update surface — the component contract stays.
const STATS = [
  {
    value: "78",
    label: "men have taken the assessment",
    context: "since April 2026",
  },
  {
    value: "86%",
    label: "finish the assessment",
    context: "started → results",
  },
  {
    value: "4m 30s",
    label: "average time to complete",
    context: "honest self-check, not a drop-off",
  },
];

export default function AssessmentProofBlock() {
  return (
    <section className="bg-neutral-50 py-14 md:py-20">
      <Container>
        <p className={`${type.overline} mb-10 text-accent-600`}>
          What's already happening
        </p>
        <div className="grid grid-cols-1 divide-y divide-neutral-100 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0"
            >
              <span className={`${type.displaySection} block text-brand-900`}>
                {s.value}
              </span>
              <span className="mt-2 block text-sm leading-6 text-neutral-500">
                {s.label}
              </span>
              <span className="mt-2 block text-xs font-semibold text-accent-600">
                {s.context}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-900 underline underline-offset-4 transition hover:text-brand-600"
          >
            See the assessment →
          </Link>
        </div>
      </Container>
    </section>
  );
}
