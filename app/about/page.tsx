import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import Button from "@/components/Button";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Men's Sole Revival — why we're building this and who it's for.",
};

export default function AboutPage() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[55vh] flex-col overflow-hidden bg-brand-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=1600&q=60"
            alt=""
            fill
            className="object-cover object-center opacity-35"
            priority
          />
        </div>
        {/* Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/25" />

        {/* Text */}
        <div className="relative z-10 flex flex-1 items-end">
          <Container>
            <div className="max-w-3xl pb-12 md:pb-16">
              <p className={`${type.overline} text-accent-400`}>About</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                Built for the men<br />finally paying attention.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Men's Sole Revival started with a simple observation: most men
                ignore their feet until something goes wrong — and by then, the
                problem is already compounding.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl space-y-6 text-base leading-7 text-neutral-700">
            <p>
              This site exists to fill a gap. There's no shortage of miracle
              products and 3-day fixes online. What's harder to find is
              straightforward, honest information about foot care — the kind that
              actually requires consistency and rewards patience.
            </p>
            <p>
              We write for men in their 40s and 50s who are serious about
              staying healthy. Not athletes, not podiatrists — just men who've
              started to realize that the feet are the foundation of how
              everything else moves.
            </p>
            <p>
              Right now we're building this in the open: publishing guides,
              developing starter kits, and letting the waitlist shape what gets
              built first. No venture funding. No commerce yet. Just the work.
            </p>
          </div>
        </Container>
      </section>

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
                body: "We cite our sources and acknowledge uncertainty. If something doesn't have solid evidence behind it, we'll say so.",
              },
              {
                heading: "Long game over quick fixes",
                body: "Real improvement in foot health takes months, not days. We design routines and products for that reality.",
              },
              {
                heading: "Simple over comprehensive",
                body: "A 5-minute routine you actually do beats a perfect one you don't. We optimize for adherence.",
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
            <h2 className={`${type.displaySection} text-brand-900`}>Join us as<br />we build.</h2>
            <p className={`mt-4 ${type.lead}`}>
              Get on the waitlist and help shape what gets built first.
              No spam, no pressure — just occasional updates.
            </p>
            <div className="mt-8">
              <Button href="/waitlist" size="lg">
                Join the Waitlist
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
