import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Routines | Men's Sole Revival",
  description:
    "Daily and weekly foot care routines for men. Stretches, soaking, lotion, toe strengthening: what to actually do.",
};

// ── Routine categories ──────────────────────────────────────────────────────
// Aphoristic card-closes swept per feedback_no_aphorisms.

const categories = [
  {
    anchor: "daily",
    label: "Daily",
    heading: "The nightly 5 minutes.",
    body:
      "Wash, dry, inspect, moisturize. Done before your phone goes to the charger. This is the foundation.",
    time: "5 min",
    frequency: "Every night",
    icon: "🌙",
  },
  {
    anchor: "weekly",
    label: "Weekly",
    heading: "The Sunday reset.",
    body:
      "Foot soak, nail trim, heel treatment. Once a week, 20 minutes.",
    time: "20 min",
    frequency: "Once a week",
    icon: "🛁",
  },
  {
    anchor: "movement",
    label: "Movement",
    heading: "Plantar stretch sequence.",
    body:
      "Calf stretch, plantar fascia stretch, toe extension. Three moves, three minutes, right after you get out of bed. Men who do this consistently stop having morning heel pain.",
    time: "3 min",
    frequency: "Every morning",
    icon: "🦶",
  },
  {
    anchor: "strength",
    label: "Strength",
    heading: "Toe spread and grip.",
    body:
      "Towel scrunches, toe spreads, single-leg balance work. Your toes are supposed to move independently. Most men's can't.",
    time: "5 min",
    frequency: "3x per week",
    icon: "💪",
  },
  {
    anchor: "treatment",
    label: "Treatment",
    heading: "Antifungal protocol.",
    body:
      "Twice daily application, consistent for 4 to 6 weeks minimum. Most men stop at two weeks when it looks better. That is why recurrence rates run around 40%.",
    time: "2 min",
    frequency: "Twice daily",
    icon: "💊",
  },
  {
    anchor: "recovery",
    label: "Recovery",
    heading: "Lacrosse ball work.",
    body:
      "Roll the arch, hold on the sore spot, let it release. Three minutes on each foot. Combine with the plantar stretch for results you'll feel within a week.",
    time: "6 min",
    frequency: "Daily or as needed",
    icon: "⚽",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RoutinesPage() {
  return (
    <SiteLayout>
      {/* ── Hero ────────────────────────────────────────────────────────────
          Full-bleed photo with DS dual scrim (vertical grounding +
          horizontal text-edge protection), muted-photo LUT, and ink
          tokens. Copy trimmed of "actually" filler and the "Not X. It's
          Y." AI-tell contrast structure. */}
      <section className="relative flex h-[45vh] flex-col overflow-hidden bg-ink">
        <Image
          src="/images/pexels-4909313.jpg"
          alt=""
          fill
          className="muted-photo object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/30" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-16 md:pb-24">
              {/* Inline classes so type.overline's baked-in text-neutral-500
                  doesn't override text-accent-300 — DS token-cascade gotcha. */}
              <p className="text-xs font-medium tracking-[0.05em] text-accent-300">
                Routines
              </p>
              <h1 className={`mt-3 ${type.displayHero} text-inverse`}>
                What to do.
              </h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.5] text-inverse">
                Stretches, soaks, daily habits, and treatment protocols. Five
                to twenty minutes at a time, most days of the week.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <AssessmentEntryStrip />

      {/* ── Routine cards ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((r) => (
              <Card
                key={r.label}
                id={r.anchor}
                variant="elevated"
                className="flex flex-col p-6 scroll-mt-24"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-xl leading-none" aria-hidden>
                    {r.icon}
                  </span>
                  <Tag variant="accent-kicker" className="!px-0">
                    {r.label}
                  </Tag>
                </div>
                <h3 className={`${type.h3} text-ink`}>{r.heading}</h3>
                <p className={`${type.body} mt-2 flex-1 text-neutral-600`}>
                  {r.body}
                </p>
                <div
                  className={`${type.small} mt-6 flex gap-4 border-t border-border-subtle pt-4 text-neutral-500`}
                >
                  <span>
                    <span className="font-medium text-neutral-700">{r.time}</span>
                  </span>
                  <span className="text-neutral-400" aria-hidden>
                    ·
                  </span>
                  <span>
                    <span className="font-medium text-neutral-700">
                      {r.frequency}
                    </span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Coming soon callout ── */}
      <section className="border-t border-neutral-200 bg-neutral-100 py-16 md:py-24">
        <Container>
          <div className="md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className={`${type.h2} text-ink`}>
                Full routine guides.
              </h2>
              <p className={`${type.lead} mt-3 text-neutral-600`}>
                Each routine above is becoming a full step-by-step guide with
                timing, product recommendations, and what to watch for.
                Subscribe and we'll send them as they publish.
              </p>
            </div>
            <div className="mt-8 flex-shrink-0 md:ml-12 md:mt-0">
              <Button href="/newsletter" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
