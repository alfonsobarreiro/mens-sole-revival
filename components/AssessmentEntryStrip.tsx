import Container from "@/components/Container";
import { Button } from "@/components/ui";
import { type } from "@/components/typography";

/**
 * Surfaces the assessment as the anchor entry point on section index pages
 * (Learn, Routines, Reviews). Sits just under the section hero.
 *
 * Uses the standard `<Container>` (max-w-6xl, px-6) to align with the rest
 * of the site (footer, hero, stats). Previously used max-w-7xl, which Cate
 * flagged as making "Start Here / 5 Minute Self-Check" feel spatially
 * disconnected from neighboring sections.
 *
 * DS conformance (2026-08-13):
 *  - bg-brand-50 → bg-neutral-100
 *  - Legacy font-display + font-bold + uppercase heading → type.displaySection
 *  - Eyebrow: uppercase/bold/wider → .eyebrow (mixed case, Medium 500, +0.01em)
 *  - Rule-of-three triad + aphorism dropped from body copy
 *  - Hand-rolled brand-900 button → DS <Button>
 */
export default function AssessmentEntryStrip() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-100">
      <Container>
        <div className="py-8 md:flex md:items-center md:justify-between md:gap-12 md:py-12">
          <div className="max-w-2xl">
            <h2 className={`${type.displaySection} text-ink`}>
              Not sure where to start?
            </h2>
            <p className="mt-2 max-w-xl text-[0.9375rem] leading-[1.5] text-neutral-600">
              Pick what brought you here, answer the questions for those
              sections, and get a specific next step: what to read and what
              to ask your podiatrist.
            </p>
          </div>
          <div className="mt-6 flex-shrink-0 md:mt-0">
            <Button href="/assessment" size="lg">
              Take the assessment →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
