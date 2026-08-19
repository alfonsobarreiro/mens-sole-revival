import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import AssessmentProofBlock from "@/components/AssessmentProofBlock";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { buildBreadcrumb } from "@/lib/breadcrumb";
import { Card } from "@/components/ui/Card";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: { absolute: "About Men's Sole Revival: Why We Built This" },
  description:
    "Built by Alfonso Barreiro for men over 40. Every guide traces the mechanism, then cites the research behind the fix. Foot care that starts before you need a podiatrist.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Men's Sole Revival",
    description:
      "Built by Alfonso Barreiro for men over 40. Foot care that starts before you need a podiatrist.",
    url: "/about",
    type: "website",
  },
};

// Values — three load-bearing operating principles. Copy tightened per
// DS Guardrails: no "Not X. Y." reveals, no "actually" filler, no aphoristic
// closes. State the mechanic.
const values = [
  {
    heading: "Evidence over claims",
    body: "We cite our sources and say so when the evidence is thin. If something doesn't have solid data behind it, we tell you.",
  },
  {
    heading: "Long game over quick fixes",
    body: "Real improvement takes months. We design routines and write guides for that timeline.",
  },
  {
    heading: "Simple over comprehensive",
    body: "A 5-minute routine repeated for months beats a 30-minute routine abandoned in week two.",
  },
];

const aboutBreadcrumb = buildBreadcrumb([{ name: "About", path: "/about" }]);

export default function AboutPage() {
  return (
    <SiteLayout>
      <JsonLd schema={aboutBreadcrumb} />
      {/* ── Hero ────────────────────────────────────────────────────────────
          Full-bleed photo with DS dual scrim (vertical grounding + horizontal
          text-edge, both ink-token — no stop below ink/30 in the text zone),
          muted-photo LUT, and text-inverse. Deck copy dropped: the sentence
          repeated verbatim in the story below (F10 aphoristic hero redundancy). */}
      <section className="relative flex min-h-[45vh] flex-col overflow-hidden bg-ink py-16 md:py-24">
        <Image
          src="/images/pexels-8637976.jpg"
          alt=""
          fill
          className="muted-photo object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/30" />

        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl">
              <h1 className={`${type.h1} text-inverse`}>
                Built for the men finally paying attention.
              </h1>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          {/* One left rail — no mx-auto on the grid; left-aligned inside Container. */}
          <div className="grid max-w-5xl gap-12 md:grid-cols-[1fr_2fr] md:items-start">
            {/* Photo — sharp corners (DS radius = 0), muted-photo LUT. */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 shadow-sm">
              <Image
                src="/about-alfonso.png"
                alt="Alfonso Barreiro at Silver Falls"
                fill
                className="muted-photo object-cover object-top"
              />
            </div>

            {/* Story text — .article-body scope (17px / 1.6 / text-ink). */}
            <div className="article-body">
              <p>
                I spent years taking care of everyone around me. That's what you
                do when you're a dad, when you're the one who shows up. Your own
                health, specifically your feet, you stop thinking about.
              </p>
              <p>
                Mine were bad. Nail fungus on both big toes for longer than I
                want to admit. Plantar fasciitis from running while overweight,
                not understanding which muscles I was supposed to be using.
                Cracked skin I assumed was just how feet looked. A low-grade
                shame whenever the subject came up, which meant I avoided it.
              </p>
              <p>
                At some point I got serious. Gradually. I started treating the
                fungal infection the right way: the right medication, kept them
                dry, stayed consistent. I learned what actually helps plantar
                fasciitis and what does nothing. I built a nightly lotion
                routine. I figured out how to stop the ingrown nail cycles. It
                took months, not days. Things changed.
              </p>
              <p>
                What I noticed was that none of that information was in one
                place. I was Googling in private and reading Reddit threads at
                midnight. For a problem that affects a huge percentage of men
                over 40, the resources were scattered, product-heavy, and built
                for people who were already motivated.
              </p>
              <p>
                I wanted something that started earlier, with the man who knows
                something is wrong but doesn't know where to begin. That is what
                this site is.
              </p>
              <p className={`${type.small} text-neutral-500`}>
                Alfonso Barreiro, UX/UI Designer · Portland, OR
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Mission callout ─────────────────────────────────────────────────
          Dark rhythm break between the personal story and the operational
          values below. Accent divider removed per one-accent-per-screen
          restraint (the Subscribe CTA below owns the accent budget). */}
      <section className="bg-ink py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className={`font-heading text-[1.75rem] font-medium italic leading-[1.15] text-inverse`}>
              This site exists because I couldn't find one when I needed one. A
              place that starts with a 5-minute self-check and gives you a real
              place to begin.
            </p>
          </div>
        </Container>
      </section>

      <AssessmentProofBlock />

      {/* ── Values ── */}
      <section className="border-t border-neutral-200 bg-neutral-100 py-16 md:py-24">
        <Container>
          <div className="max-w-xl">
            <h2 className={`${type.h2} text-ink`}>What we believe.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <Card
                key={item.heading}
                variant="outline"
                className="p-6"
              >
                <h3 className={`${type.h3} text-ink`}>{item.heading}</h3>
                <p className={`mt-3 ${type.body} text-neutral-600`}>
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="max-w-xl">
            <h2 className={`${type.h2} text-ink`}>Get the guides.</h2>
            <p className={`mt-4 ${type.lead} text-neutral-600`}>
              We publish evidence-based guides, reviews, and routines for men
              over 40. Subscribe and we'll send the new ones. No spam,
              unsubscribe anytime.
            </p>
            <div className="mt-8">
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
