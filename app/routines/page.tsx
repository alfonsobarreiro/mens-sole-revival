import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import Button from "@/components/Button";
import AssessmentEntryStrip from "@/components/AssessmentEntryStrip";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Routines | Men's Sole Revival",
  description:
    "Daily and weekly foot care routines for men. Stretches, soaking, lotion, toe strengthening: what to actually do.",
};

// ── Routine categories ──────────────────────────────────────────────────────

const categories = [
  {
    anchor: "daily",
    label: "Daily",
    heading: "The nightly 5 minutes.",
    body:
      "Wash, dry, inspect, moisturize. Done before your phone goes to the charger. This is the foundation. Everything else builds on it.",
    time: "5 min",
    frequency: "Every night",
    icon: "🌙",
  },
  {
    anchor: "weekly",
    label: "Weekly",
    heading: "The Sunday reset.",
    body:
      "Foot soak, nail trim, heel treatment. Once a week, 20 minutes. The difference between cracked heels and healthy skin is mostly this one habit.",
    time: "20 min",
    frequency: "Once a week",
    icon: "🛁",
  },
  {
    anchor: "movement",
    label: "Movement",
    heading: "Plantar stretch sequence.",
    body:
      "Calf stretch, plantar fascia stretch, toe extension. Three moves, three minutes, right after you get out of bed. The men who do this consistently stop having morning heel pain.",
    time: "3 min",
    frequency: "Every morning",
    icon: "🦶",
  },
  {
    anchor: "strength",
    label: "Strength",
    heading: "Toe spread and grip.",
    body:
      "Towel scrunches, toe spreads, single-leg balance work. Your toes are supposed to be able to move independently. Most men's can't. That's a fixable problem.",
    time: "5 min",
    frequency: "3x per week",
    icon: "💪",
  },
  {
    anchor: "treatment",
    label: "Treatment",
    heading: "Antifungal protocol.",
    body:
      "Twice daily application, consistent for 4–6 weeks minimum. Most men stop at two weeks when it looks better. That's why recurrence rates are 40%. Don't stop early.",
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


      {/* ── Hero ── */}
      <section className="relative flex h-[45vh] flex-col overflow-hidden bg-brand-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pexels-4909313.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900/90 via-brand-900/50 to-transparent" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>Routines</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                What to actually<br />do.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Stretches, soaks, daily habits, and treatment protocols. Not a
                plan you'll quit. A set of small consistent actions that compound
                over months.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <AssessmentEntryStrip />

      {/* ── Routine cards ── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((r) => (
              <div
                key={r.label}
                id={r.anchor}
                className="flex flex-col border border-neutral-200 bg-white p-6 shadow-sm scroll-mt-24"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-2xl">{r.icon}</span>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                    {r.label}
                  </span>
                </div>
                <h3 className={`${type.h4} text-brand-900`}>{r.heading}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">{r.body}</p>
                <div className="mt-5 flex gap-4 border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                  <span><strong className="text-neutral-700">{r.time}</strong></span>
                  <span className="text-neutral-200">·</span>
                  <span><strong className="text-neutral-700">{r.frequency}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Coming soon callout ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
        <Container>
          <div className="md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className={`${type.overline} text-neutral-500`}>Coming soon</p>
              <h2 className={`mt-2 ${type.displaySection} text-brand-900`}>
                Full routine guides.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">
                Each routine above is becoming a full step-by-step guide with
                timing, product recommendations, and what to watch for. Subscribe
                and we'll send them as they publish.
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
