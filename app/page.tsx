import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";
import SiteLayout from "@/components/SiteLayout";
import TopicsSection from "@/components/TopicsSection";
import HeroSlideshow from "@/components/HeroSlideshow";
import Link from "next/link";
import Image from "next/image";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: {
    absolute: "Men's Foot Health: Evidence-Based Care for Men Over 40",
  },
  description:
    "Why do your feet hurt after 40? Foot problems travel up to your knees, hips, and back. Free 5-minute self-assessment, evidence-based guides, and daily routines for men.",
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
    desc: "Wash, dry, inspect, moisturize. Done before your phone goes to the charger. This is the foundation.",
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
    desc: "Roll the arch, hold on the sore spot, let it release. Three minutes per foot. Combine with the stretch.",
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
      "\"Age\" isn't a diagnosis. Four specific things change in your feet after 40 — and because they're your foundation, you feel them in your knees, hips, and back.",
    image: "/images/pexels-7787491.jpg",
  },
  {
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "What 30 Years in Dress Shoes Actually Does to Your Feet",
    category: "Footwear Fit",
    readTime: "7 min",
    excerpt: "Most men don't connect the shoes they wore for decades to the foot problems they have now. Here's the chain of cause and effect.",
    image: "/images/pexels-12031206.jpg",
  },
  {
    slug: "big-toe-and-your-whole-body",
    title: "Your Big Toe Controls More of Your Body Than You Think",
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
    excerpt: "Scrubbing dry, cracked heel skin is the wrong starting point. Here's what's actually happening, and the routine that addresses it.",
    image: "/images/pexels-29145634.jpg",
  },
  {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    excerpt: "The evidence on OTC treatments, prescription options, and home remedies, ranked by how well they actually work.",
    image: "/images/pexels-5960467.jpg",
  },
  {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    category: "Toe Alignment",
    readTime: "5 min",
    excerpt: "When your big toe can't extend and stabilize, your knee, hip, and lower back pick up the slack every single step. Here's how it travels up the chain.",
    image: "/images/pexels-13065922.jpg",
  },
  {
    slug: "5-minute-routine",
    title: "A 5-Minute Daily Foot-Care Routine You Can Actually Stick To",
    category: "Daily Routine",
    readTime: "4 min",
    excerpt: "Consistency beats intensity. A five-minute habit done after your shower produces dramatically better long-term outcomes than anything more ambitious you'll quit.",
    image: "/images/pexels-7205913.jpg",
  },
];

const stats = [
  {
    value: "1 in 4",
    label: "men over 40 experience chronic foot pain",
    context: "That's probably someone in your household.",
    source: "American Podiatric Medical Association",
    sourceUrl: "https://www.apma.org/",
  },
  {
    value: "63–72%",
    label: "of adults wear shoes that don't fit them correctly",
    context: "The most upstream variable. And the most fixable.",
    source: "PMC · Incorrectly Fitted Footwear, Systematic Review",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064070/",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[90vh] flex-col overflow-hidden bg-brand-900">

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
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-brand-900 via-brand-900/30 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900/90 via-brand-900/45 to-brand-900/10" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 items-center">
          <Container>
            <div className="max-w-3xl py-24 md:py-32">

              <div className="mb-6 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-accent-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-white/90">
                  For men over 40 who are finally paying attention
                </p>
              </div>

              <h1 className={`${type.displayHero} text-white`}>
                Fix your feet.<br />
                Keep up with<br />
                everything else.
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/85">
                Foot problems don't stay in your feet. They change how your
                knees load, how your hips move, and how your back feels by
                evening — and most men don't notice until a decade of damage
                has already passed.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/assessment" size="lg">
                  Take the Assessment
                </Button>
                <Button
                  href="/guides"
                  variant="outline"
                  size="lg"
                  className="border-white/70 text-white hover:bg-white/10 active:bg-white/20"
                >
                  Browse Guides
                </Button>
              </div>

              <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent-400"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                5-minute self-check · no email needed to start
              </p>
            </div>
          </Container>
        </div>

        {/* Credibility strip — proof above the fold, replacing the ticker */}
        <div className="relative z-10 border-t border-white/10 bg-brand-900/80 backdrop-blur-sm">
          <Container>
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm leading-6 text-white/80">
                <span className="font-bold text-white">1 in 4</span> men over 40
                live with chronic foot pain.{" "}
                <a
                  href="https://www.apma.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 underline underline-offset-2 transition hover:text-white/90"
                >
                  APMA
                </a>
              </p>
              <Link
                href="/guides"
                className="text-xs font-bold uppercase tracking-widest text-white/70 transition hover:text-white"
              >
                Browse the guides →
              </Link>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Stats — large display numbers, no cards ── */}
      <section className="bg-neutral-50 py-14 md:py-20">
        <Container>
          <p className={`${type.overline} mb-10 text-neutral-600`}>The numbers most men ignore</p>
          <div className="grid grid-cols-1 divide-y divide-neutral-100 md:grid-cols-2 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <div key={s.value} className="py-8 md:py-0 md:px-10 first:md:pl-0">
                <span className={`${type.displaySection} block text-brand-900`}>
                  {s.value}
                </span>
                <span className="mt-2 block text-sm leading-6 text-neutral-500">{s.label}</span>
                <span className="mt-2 block text-xs font-semibold text-accent-600">{s.context}</span>
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600 transition"
                >
                  Source: {s.source}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── From the Library — featured left sticky + 3 articles right ── */}
      {/* NOTE: no overflow-hidden on this section — it breaks position:sticky */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT — sticky panel: fills viewport, heading top, article bottom */}
          <div>
            <div className="md:sticky md:top-0 md:flex md:min-h-screen md:flex-col md:justify-between p-8 md:p-10 lg:p-14">

              {/* Top: section heading + CTA */}
              <div>
                <p className={`${type.displayHero} text-brand-900 leading-none`}>
                  FROM<br />THE<br />GUIDES.
                </p>
                <Link
                  href="/guides"
                  className="mt-6 inline-flex items-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
                >
                  View all guides
                </Link>
              </div>

              {/* Bottom: featured article */}
              <Link href={`/guides/${articles[0].slug}`} className="group mt-10 block md:mt-0">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                  <Image
                    src={articles[0].image}
                    alt={articles[0].title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent-600">
                  {articles[0].category} · {articles[0].readTime} read
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600 md:text-3xl">
                  {articles[0].title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
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
                className="group flex gap-5 p-8 transition hover:bg-neutral-50/60 md:p-10"
              >
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden md:h-28 md:w-36">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                    {a.category} · {a.readTime} read
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600 md:text-2xl">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Why it matters — single editorial split panel ── */}
      <section className="flex min-h-[420px] flex-col md:flex-row md:min-h-[500px]">
        <div className="relative h-64 w-full md:h-auto md:w-1/2">
          <Image
            src="/images/pexels-34806666.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="flex w-full items-center bg-brand-900 px-8 py-14 md:w-1/2 md:px-14 lg:px-20">
          <div>
            <div className="mb-5 h-0.5 w-8 bg-accent-500" />
            <h2 className={`${type.displaySection} text-white leading-tight`}>
              IT COMPOUNDS<br />UPWARD.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-white/65">
              When your feet work well, everything else gets easier. Your knees,
              your posture, your energy. This is the edge most men overlook,
              and the reason we built this.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-400 transition hover:text-accent-300"
            >
              Why we built this →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Topics selector — interactive hover panel ── */}
      <TopicsSection />

      {/* ── Routines — what to actually do ── */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`${type.displaySection} text-brand-900`}>
                The routines.
              </p>
              <p className="mt-3 max-w-xl text-base leading-7 text-neutral-500">
                Not a program. A set of small consistent actions that compound
                over months. Start with one. Add the next.
              </p>
            </div>
            <Link
              href="/routines"
              className="hidden text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700 md:block"
            >
              View all routines →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {routineHighlights.map((r) => (
              <Link
                key={r.title}
                href={r.href}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-900 backdrop-blur-sm">
                      {r.label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold uppercase leading-tight text-neutral-900 transition group-hover:text-brand-700">
                    {r.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500">{r.desc}</p>
                  <p className="mt-4 text-xs font-semibold text-neutral-400">{r.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Parallax CTA ── */}
      <section
        className="relative overflow-hidden py-28 md:py-44"
        style={{
          backgroundImage:
            "url('/images/pexels-7787491.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-brand-900/80" />

        <Container className="relative z-10">
          <div className="flex flex-col items-center gap-8 text-center">
            <p className={`${type.displayHero} text-white leading-none`}>
              START HERE.
            </p>
            <p className="max-w-lg text-lg leading-relaxed text-brand-200">
              Five sections. 30 questions. Under five minutes. You'll know
              exactly where you stand and where to start.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/assessment" size="lg">
                Take the Assessment
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 active:bg-white/20"
              >
                Our story
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
