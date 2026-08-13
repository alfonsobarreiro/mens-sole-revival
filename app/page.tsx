import type { Metadata } from "next";
import Container from "@/components/Container";
import { Button } from "@/components/ui";
import SiteLayout from "@/components/SiteLayout";
import TopicsSection from "@/components/TopicsSection";
import HeroSlideshow from "@/components/HeroSlideshow";
import InlineNewsletterForm from "@/components/InlineNewsletterForm";
import Link from "next/link";
import Image from "next/image";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: {
    absolute: "Men's Foot Health: Evidence-Based Care for Men Over 40",
  },
  description:
    "Foot problems after 40 travel up to your knees, hips and back. Free 5-minute self-assessment, evidence-based guides and daily routines for men.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Men's Foot Health: Evidence-Based Care for Men Over 40",
    description:
      "Foot problems don't stay in your feet. Free 5-minute assessment, evidence-based guides, and routines for men over 40.",
    url: "/",
    type: "website",
  },
};

// ── Data ────────────────────────────────────────────────────────────────────

const routineHighlights = [
  {
    label: "Daily",
    title: "The nightly 5 minutes.",
    desc: "Wash, dry, inspect, moisturize. Done before your phone goes to the charger.",
    time: "5 min / every night",
    href: "/routines",
    image: "/images/pexels-4909313.jpg",
  },
  {
    label: "Stretch",
    title: "Plantar stretch sequence.",
    desc: "Three moves, three minutes, right after you get out of bed. The men who do this stop having morning heel pain.",
    time: "3 min / every morning",
    href: "/routines",
    image: "/images/pexels-3771071.jpg",
  },
  {
    label: "Recovery",
    title: "Lacrosse ball work.",
    desc: "Roll the arch, then hold on the sore spot until it releases. Three minutes per foot; pair with the stretch.",
    time: "6 min / as needed",
    href: "/routines",
    image: "/images/pexels-8729018.jpg",
  },
];

const articles = [
  {
    slug: "why-your-feet-hurt-after-40",
    title: "Why Your Feet Hurt After 40 (and What's Actually Going On)",
    category: "Foot Health",
    readTime: "7 min",
    excerpt:
      "\"Age\" isn't a diagnosis. Four specific things change in your feet after 40. Because your feet are the foundation, you feel it travel up.",
    image: "/images/pexels-7787491.jpg",
  },
  {
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "What 30 Years in Dress Shoes Does to Your Feet",
    category: "Footwear Fit",
    readTime: "7 min",
    excerpt: "Decades of narrow toe boxes compress the forefoot, weaken the arch, and offload force to the knee. The chain of cause and effect runs upward.",
    image: "/images/pexels-12031206.jpg",
  },
  {
    slug: "big-toe-and-your-whole-body",
    title: "Your Big Toe Drives 40–60% of Every Step",
    category: "Toe Alignment",
    readTime: "6 min",
    excerpt: "The big toe is responsible for 40–60% of your push-off force. Most men have spent decades restricting it, and wondering why their knee hurts.",
    image: "/images/pexels-11873696.jpg",
  },
  {
    slug: "cracked-heels-what-actually-works",
    title: "Cracked Heels: The Fix That Isn't a Pumice Stone",
    category: "Dry Skin",
    readTime: "5 min",
    excerpt: "Scrubbing dry, cracked heel skin is the wrong starting point. The mechanism is moisture loss, and the routine that addresses it starts with urea cream on damp feet.",
    image: "/images/pexels-29145634.jpg",
  },
  {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    excerpt: "OTC and prescription options ranked by how well they actually work. Plus which of the home remedies do anything at all.",
    image: "/images/pexels-5960467.jpg",
  },
  {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    category: "Toe Alignment",
    readTime: "5 min",
    excerpt: "When your big toe can't extend and stabilize, your knee and lower back pick up the slack every single step. The compensation runs upward until something else gives.",
    image: "/images/pexels-13065922.jpg",
  },
  {
    slug: "5-minute-routine",
    title: "A 5-Minute Daily Foot-Care Routine You'll Stick To",
    category: "Daily Routine",
    readTime: "4 min",
    excerpt: "A five-minute habit done after your shower outperforms any more ambitious routine you'll quit inside a month.",
    image: "/images/pexels-7205913.jpg",
  },
];

const stats = [
  {
    value: "1 in 4",
    label: "men over 40 live with chronic foot pain",
    context: "That's probably someone in your household.",
    source: "American Podiatric Medical Association",
    sourceUrl: "https://www.apma.org/",
  },
  {
    value: "63–72%",
    label: "of adults wear shoes that don't fit them correctly",
    context: "The most upstream variable, and the most fixable.",
    source: "PMC · Incorrectly Fitted Footwear, Systematic Review",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
  },
  {
    value: "1 in 10",
    label: "adults will develop plantar fasciitis in their lifetime",
    context: "It peaks between 40 and 60. That's you.",
    source: "NIH · StatPearls, Plantar Fasciitis",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
  },
  {
    value: "26",
    label: "bones and 33 joints in each foot",
    context: "A quarter of your skeleton lives below your ankles.",
    source: "American Podiatric Medical Association",
    sourceUrl: "https://www.apma.org/learn/foot-health/",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[90vh] flex-col overflow-hidden bg-ink">

        {/* Background photos — slow crossfade (reduced-motion shows frame 1 only) */}
        <HeroSlideshow
          images={[
            { src: "/images/pexels-4909313.jpg", position: "center" },
            { src: "/images/pexels-17979558.jpg", position: "center right" },
            { src: "/images/unsplash-forest-run.jpg", position: "center" },
          ]}
        />

        {/* Controlled dual scrim: vertical grounds the base (and the credibility
            strip); directional keeps the headline legible on the left. Reads as
            one premium scene and holds WCAG contrast for the copy. */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/10" />

        {/* Content — H1 + tightened body + single CTA. No decorative
            anchor rule (was reading as an em-dash bookend). */}
        <div className="relative z-10 flex flex-1 items-center">
          <Container>
            <div className="max-w-3xl py-24 md:py-32">

              <h1 className={`${type.displayHero} text-white`}>
                Your turn.<br />
                Start with<br />
                your feet.
              </h1>

              <p className="mt-8 max-w-2xl text-[0.9375rem] leading-[1.5] text-inverse-body">
                Foot problems don&apos;t stay in your feet. They change how your knees load and how your hips move. By evening you feel it in your back. Most men don&apos;t notice until a decade of damage has passed.
              </p>

              <div className="mt-8">
                <Button href="/assessment" size="lg">
                  Take the assessment
                </Button>
              </div>

            </div>
          </Container>
        </div>
      </section>


      {/* ── Stats — men and their feet, in numbers ── */}
      <section className="bg-neutral-100 py-16 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className={`${type.displaySection} text-ink`}>
              Men and their feet.
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.5] text-neutral-600">
              The size of the problem, in numbers. Every stat below is
              cited to a primary source you can check.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {stats.map((s) => (
              <div key={s.value}>
                <span className={`${type.displaySection} block text-ink`}>
                  {s.value}
                </span>
                <span className="mt-3 block text-[0.9375rem] leading-[1.5] text-neutral-600">
                  {s.label}
                </span>
                <span className="mt-2 block text-[0.9375rem] leading-[1.5] text-neutral-600">
                  {s.context}
                </span>
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[0.75rem] text-link hover:text-link-hover transition"
                >
                  Source: {s.source}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Newsletter capture band — lead-magnet framed.
           Sits after the two stat sections and before the content library,
           so the reader has been given the problem (industry stats) and
           the proof (MSR traction) before we ask for the email. ── */}
      <section className="border-y border-neutral-200 bg-ink py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <InlineNewsletterForm tone="dark" />
          </div>
        </Container>
      </section>

      {/* ── From the Library — featured left sticky + 3 articles right ── */}
      {/* NOTE: no overflow-hidden on this section — it breaks position:sticky */}
      <section>
        <Container>
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT — sticky panel: fills viewport, heading top, article bottom */}
          <div>
            <div className="md:sticky md:top-0 md:flex md:min-h-screen md:flex-col md:justify-between py-8 pr-8 md:py-12 md:pr-12 lg:py-16 lg:pr-16">

              {/* Top: section heading + description + CTA */}
              <div>
                <h2 className={`${type.displayHero} text-ink leading-[1.05]`}>
                  The library.
                </h2>
                <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.5] text-neutral-600">
                  Long-form guides on the foot problems men over 40 actually
                  develop. Each one traces the mechanism, then cites the
                  research behind the fix.
                </p>
                <Button
                  href="/guides"
                  variant="secondary"
                  size="md"
                  className="mt-6"
                >
                  View all guides
                </Button>
              </div>

              {/* Bottom: featured article */}
              <Link href={`/guides/${articles[0].slug}`} className="group mt-12 block md:mt-0">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                  <Image
                    src={articles[0].image}
                    alt={articles[0].title}
                    fill
                    className="muted-photo object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-xs font-medium text-accent-700">
                  {articles[0].category}  ·  {articles[0].readTime} read
                </p>
                <h3 className={`mt-2 ${type.h2} text-ink transition group-hover:text-accent-700`}>
                  {articles[0].title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.5] text-neutral-600">
                  {articles[0].excerpt}
                </p>
              </Link>

            </div>
          </div>

          {/* RIGHT — 4 articles that scroll past the sticky left */}
          <div>
            {articles.slice(1, 5).map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                className="group flex gap-6 py-8 pl-8 transition hover:bg-neutral-100/60 md:py-12 md:pl-12"
              >
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden md:h-32 md:w-32">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="muted-photo object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-medium text-accent-700">
                    {a.category}  ·  {a.readTime} read
                  </p>
                  <h3 className={`mt-1 ${type.h3} text-ink transition group-hover:text-accent-700`}>
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.5] text-neutral-600">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
        </Container>
      </section>

      {/* ── Why it matters — single editorial split panel ── */}
      <section className="flex min-h-[416px] flex-col md:flex-row md:min-h-[512px]">
        <div className="relative h-64 w-full md:h-auto md:w-1/2">
          <Image
            src="/images/pexels-34806666.jpg"
            alt=""
            fill
            className="muted-photo object-cover"
          />
        </div>
        <div className="flex w-full items-center bg-ink px-8 py-16 md:w-1/2 md:px-12 lg:px-24">
          <div>
            <h2 className={`${type.displaySection} text-white`}>
              It travels<br />up the body.
            </h2>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.5] text-inverse-body">
              When your feet work well, your knees load evenly and your hips
              stop compensating. Most men have never felt that baseline.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent-300 transition hover:text-white"
            >
              Why I built this →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Topics selector — interactive hover panel ── */}
      <TopicsSection />

      {/* ── Routines — what to actually do ── */}
      <section className="bg-neutral-100 py-16 md:py-24">
        <Container>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={`${type.displaySection} text-ink`}>
                The routines.
              </h2>
              <p className="mt-3 max-w-xl text-[0.9375rem] leading-[1.5] text-neutral-600">
                Not a program. Small daily loads on the plantar tissue, repeated
                for months, produce the tissue adaptation. Start with one.
                Add the next.
              </p>
            </div>
            <Link
              href="/routines"
              className="hidden text-[0.9375rem] font-medium text-link hover:text-link-hover md:block"
            >
              View all routines →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {routineHighlights.map((r) => (
              <Link
                key={r.title}
                href={r.href}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-bg-elevated transition hover:border-neutral-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover muted-photo transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-bg-elevated/95 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
                      {r.label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`${type.h3} text-ink transition group-hover:text-accent-700`}>
                    {r.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-[1.5] text-neutral-600">{r.desc}</p>
                  <p className="mt-4 text-xs font-medium text-neutral-500">{r.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Parallax CTA — desktop-only parallax via @media (hover: hover).
           Mobile Safari drops background-attachment: fixed silently, so we
           apply it via the .parallax-bg utility that guards the property. ── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background — muted-photo class so the LUT is greppable, and
            isolated from the section so it doesn't desaturate the CTA button */}
        <div
          className="parallax-bg muted-photo absolute inset-0"
          style={{
            backgroundImage: "url('/images/pexels-7787491.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-ink/80" />

        <Container className="relative z-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <h2 className={`${type.displayHero} text-white`}>
              Start here.
            </h2>
            <p className="max-w-lg text-[0.9375rem] leading-[1.5] text-inverse-body">
              30 questions, under five minutes. You&apos;ll know which of the
              six concerns to address first.
            </p>
            <Button href="/assessment" size="lg">
              Take the assessment
            </Button>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
