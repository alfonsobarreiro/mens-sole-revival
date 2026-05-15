import Link from "next/link";

/**
 * Surfaces the assessment as the anchor entry point on section index pages
 * (Learn, Routines, Reviews). Sits just under the section hero.
 */
export default function AssessmentEntryStrip() {
  return (
    <section className="border-y border-neutral-200 bg-brand-50">
      <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between md:gap-10 md:py-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
            Start here · 5-min self-check
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900 md:text-3xl">
            Not sure where to start?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 md:text-base">
            The self-check is the way in. Pick what brought you here, answer
            the questions for those sections, and get a specific next step:
            what to read, what to do, and what to ask a podiatrist.
          </p>
        </div>
        <div className="mt-6 flex-shrink-0 md:mt-0">
          <Link
            href="/assessment"
            className="inline-block bg-brand-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
          >
            Take the assessment →
          </Link>
        </div>
      </div>
    </section>
  );
}
