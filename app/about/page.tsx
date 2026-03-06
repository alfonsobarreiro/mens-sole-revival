import type { Metadata } from "next";
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
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>About</p>
            <h1 className={`mt-3 ${type.h1}`}>
              Built for the men who are finally paying attention.
            </h1>
            <p className={`mt-6 ${type.lead}`}>
              Men's Sole Revival started with a simple observation: most men
              ignore their feet until something goes wrong — and by then, the
              problem is already compounding.
            </p>
          </div>
        </Container>
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
            <p className={type.overline}>How we work</p>
            <h2 className={`mt-3 ${type.h2}`}>What we believe</h2>
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
            <h2 className={type.h2}>Join us as we build.</h2>
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
