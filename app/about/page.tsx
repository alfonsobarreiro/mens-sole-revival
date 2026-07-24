import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import Button from "@/components/Button";
import AssessmentProofBlock from "@/components/AssessmentProofBlock";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Men's Sole Revival — why we're building this and who it's for.",
};

export default function AboutPage() {
  return (
    <SiteLayout>


      {/* ── Hero ── */}
      <section className="relative flex h-[45vh] flex-col overflow-hidden bg-brand-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pexels-8637976.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-70"
            priority
          />
        </div>
        {/* Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900/90 via-brand-900/50 to-transparent" />

        {/* Text */}
        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>About</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                Built for the men<br />finally paying attention.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                I spent most of my life taking care of other people.
                That's what got ignored.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_2fr] md:items-start">

            {/* Photo */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100 shadow-md">
              {/* Replace /images/about-alfonso.jpg with your photo.
                  Drop the file into /public/images/ and update the src below. */}
              <Image
                src="/about-alfonso.png"
                alt="Alfonso Barreiro at Silver Falls"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Story text */}
            <div className="space-y-5 text-base leading-7 text-neutral-700">
              <p>
                I spent years taking care of everyone around me. That's what you do
                when you're a dad, when you're the one who shows up. Your own health
                — specifically your feet — you stop thinking about.
              </p>
              <p>
                Mine were bad. Nail fungus on both big toes for longer than I want
                to admit. Plantar fasciitis from running while overweight, not
                understanding which muscles I was supposed to be using. Cracked skin
                I assumed was just how feet looked. A low-grade shame whenever the
                subject came up, which meant I avoided it.
              </p>
              <p>
                At some point I got serious. Not overnight — gradually. I started
                treating the fungal infection the right way: the right medication,
                kept them dry, stayed consistent. I learned what actually helps
                plantar fasciitis and what does nothing. I built a nightly lotion
                routine. I figured out how to stop the ingrown nail cycles. It took
                months, not days. Things changed.
              </p>
              <p>
                What I noticed was that none of that information was in one place.
                I was Googling in private and reading Reddit threads at midnight. For
                a problem that affects a huge percentage of men over 40, the
                resources were scattered, product-heavy, and built for people who
                were already motivated.
              </p>
              <p>
                I wanted something that started earlier — with the man who knows
                something is wrong but doesn't know where to begin.
              </p>
              <p className="font-semibold text-brand-900">
                That's what this is.
              </p>
              <p className="text-sm text-neutral-500">
                Alfonso Barreiro, UX/UI Designer · Portland, OR
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Mission callout — the site's own voice, not the founder's.
           Dark rhythm break between the personal story and the operational
           values below. Names what the site is and what it explicitly isn't. ── */}
      <section className="bg-brand-900 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 h-0.5 w-10 bg-accent-500" />
            <p className="font-heading text-2xl italic leading-snug text-white md:text-3xl">
              This site exists because I couldn't find one when I needed one.
              Not a product catalog. Not a blog with 30 supplements to buy.
              A place that starts with a 5-minute self-check and gives you a
              real place to begin.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Assessment proof block — same component as home, reused so both
           pages carry the same MSR-traction numbers in the same treatment. ── */}
      <AssessmentProofBlock />

      {/* ── Values ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 md:py-20">
        <Container>
          <div className="max-w-xl">
            <p className={`${type.overline} text-neutral-500`}>How we work</p>
            <h2 className={`mt-3 ${type.displaySection} text-brand-900`}>What we believe.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                heading: "Evidence over claims",
                body: "We cite our sources and say so when the evidence is thin. If something doesn't have solid data behind it, we'll tell you.",
              },
              {
                heading: "Long game over quick fixes",
                body: "Real improvement takes months. We design routines and write guides for that reality — not for a 3-day result.",
              },
              {
                heading: "Simple over comprehensive",
                body: "A 5-minute routine you actually do beats a perfect one you don't. We optimize for consistency.",
              },
            ].map((item) => (
              <div key={item.heading}
                className="rounded-lg border border-neutral-200 bg-white p-6">
                <div className="mb-3 h-1 w-8 rounded-full bg-accent-500" />
                <h3 className={type.h4}>{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-xl">
            <h2 className={`${type.displaySection} text-brand-900`}>Get the<br />guides.</h2>
            <p className={`mt-4 ${type.lead}`}>
              We publish evidence-based guides, reviews, and routines for men
              over 40. Subscribe and we'll send the new ones — no spam,
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
