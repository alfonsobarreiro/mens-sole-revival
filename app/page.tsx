import Container from "@/components/Container";
import Button from "@/components/Button";
import Card from "@/components/Card";
import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import { type } from "@/components/typography";

// ── Data ────────────────────────────────────────────────────────────────────

const kits = [
  {
    title: "Pain & Recovery",
    tag: "Most requested",
    desc: "For soreness, fatigue, plantar discomfort, and everyday foot ache. Simple routines that actually work.",
    href: "/waitlist?kit=pain-recovery",
  },
  {
    title: "Fungus & Nail Care",
    tag: "Long game",
    desc: "For discoloration, thick nails, and the confidence tax of hiding your feet. Evidence-based, not gimmicks.",
    href: "/waitlist?kit=fungus-care",
  },
  {
    title: "Toe Alignment & Mobility",
    tag: "Foundation",
    desc: "For cramped toes, bunions, balance, and restoring natural foot function before problems compound.",
    href: "/waitlist?kit=alignment-mobility",
  },
];

const articles = [
  {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    excerpt: "The evidence on OTC treatments, prescription options, and home remedies — ranked by how well they actually work.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
  },
  {
    slug: "why-toe-alignment-affects-knees-and-hips",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    category: "Alignment",
    readTime: "6 min",
    excerpt: "The connection between cramped toes, altered gait, and the knee and hip pain that follows years later.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75",
  },
  {
    slug: "5-minute-routine",
    title: "A 5-Minute Daily Foot-Care Routine You Can Stick To",
    category: "Routine",
    readTime: "4 min",
    excerpt: "A consistency-first approach: five focused minutes after your shower, anchored to a habit you already have.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=75",
  },
];

const stats = [
  {
    value: "1 in 4",
    label: "men over 40 experience chronic foot pain",
    context: "That's probably someone in your household.",
  },
  {
    value: "75%",
    label: "of foot problems are preventable with consistent care",
    context: "Most of what slows men down after 40 was preventable.",
  },
  {
    value: "6 months",
    label: "average time to see real results from proper treatment",
    context: "Slow progress. Real results. Worth starting today.",
  },
];

const marqueeItems = [
  "Nail Care", "Toe Alignment", "Daily Routine",
  "Foot Health", "Footwear Fit", "Pain & Recovery",
  "Evidence-Based", "Men's Wellness", "Long Game",
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[90vh] flex-col overflow-hidden bg-brand-800">

        {/* Background photo — full bleed, higher opacity for depth */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=1600&q=60"
            alt=""
            fill
            className="object-cover object-center opacity-30"
            priority
          />
        </div>

        {/* Strong directional gradient — content readable on left, image shows on right */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/30" />

        {/* Content — flex-1 centers it vertically */}
        <div className="relative z-10 flex flex-1 items-center">
          <Container>
            <div className="max-w-3xl py-24 md:py-32">

              <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-accent-400">
                For men over 40 who are finally paying attention.
              </p>

              <h1 className={`${type.displayHero} text-white`}>
                Fix your feet.<br />
                Keep up with<br />
                everything else.
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-brand-200">
                Foot problems don't stay in your feet — they change how your
                knees load, how your hips move, and how your back feels by
                evening. Most men don't notice until a decade of damage has
                already passed.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/waitlist" size="lg">
                  Join the Waitlist
                </Button>
                <Button
                  href="/learn"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 active:bg-white/20"
                >
                  Browse Articles
                </Button>
              </div>

              <p className="mt-5 text-sm text-brand-400">
                No commerce yet — we're building this in the open.
              </p>
            </div>
          </Container>
        </div>

        {/* Marquee ticker — sits at the very bottom of the hero */}
        <div className="relative z-10 overflow-hidden border-t border-white/10 bg-brand-900/70 py-3 backdrop-blur-sm">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="mx-5 text-xs font-semibold uppercase tracking-widest text-brand-300"
              >
                {item}
                <span className="ml-5 text-accent-500">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats — large display numbers, no cards ── */}
      <section className="border-b border-neutral-200 py-14 md:py-20">
        <Container>
          <p className={`${type.overline} mb-10 text-neutral-400`}>The numbers most men ignore</p>
          <div className="grid grid-cols-1 divide-y divide-neutral-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <div key={s.value} className="py-8 md:py-0 md:px-10 first:md:pl-0">
                <span className={`${type.displaySection} block text-brand-900`}>
                  {s.value}
                </span>
                <span className="mt-2 block text-sm leading-6 text-neutral-500">{s.label}</span>
                <span className="mt-2 block text-xs font-semibold text-accent-600">{s.context}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why it matters — three full-bleed dark image panels ── */}
      <section>
        <Container>
          <div className="py-14 md:py-16">
            <p className={`${type.overline} text-neutral-400`}>Why this matters</p>
            <p className={`mt-2 ${type.displaySection} text-brand-900`}>Know your feet.</p>
          </div>
        </Container>
        {/* Edge-to-edge panel grid — no rounded corners */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            {
              heading: "Problems start quietly",
              body: "By the time they're obvious — the pain, the discoloration, the cramped toes — they've usually been building for years.",
              image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70",
            },
            {
              heading: "Most advice is backwards",
              body: "The internet is full of miracle products and 3-day fixes. Real foot care rewards consistency over shortcuts.",
              image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=70",
            },
            {
              heading: "It compounds upward",
              body: "When your feet work well, everything else gets easier — your knees, your posture, your energy. This is the leverage most men overlook.",
              image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70",
            },
          ].map((item) => (
            <div
              key={item.heading}
              className="relative flex min-h-[340px] flex-col justify-end overflow-hidden bg-brand-900 md:min-h-[420px]"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-transparent" />
              <div className="relative z-10 p-7 md:p-8">
                <div className="mb-3 h-0.5 w-8 bg-accent-500" />
                <h3 className="font-display text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
                  {item.heading}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-300">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Kits ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 md:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`${type.displaySection} text-brand-900`}>
                The kits.
              </p>
              <p className="mt-3 max-w-xl text-base leading-7 text-neutral-500">
                Each kit bundles a simple routine with the right tools.
                Tell us which you need — we'll prioritize what ships first.
              </p>
            </div>
            <Link
              href="/kits"
              className="hidden text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700 md:block"
            >
              View all kits →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {kits.map((kit) => (
              <Card key={kit.title} {...kit} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── From the Library — Vivobarefoot "LATEST STORIES" layout ── */}
      <section className="border-t border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[5fr_8fr]">

            {/* Left: giant sticky title + link */}
            <div>
              <p className={`${type.displayHero} text-brand-900 leading-none`}>
                FROM<br />THE<br />LIBRARY.
              </p>
              <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-500">
                Practical, evidence-based articles on foot health, footwear,
                and the habits that keep men moving well.
              </p>
              <Link
                href="/learn"
                className="mt-7 inline-flex items-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
              >
                View all guides
              </Link>
            </div>

            {/* Right: article list with sharp thumbnails */}
            <div className="divide-y divide-neutral-200">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex gap-5 py-7 first:pt-0"
                >
                  {/* Sharp thumbnail — no rounding */}
                  <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden">
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
                    <p className="mt-1 text-sm leading-6 text-neutral-500">{a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-neutral-200 bg-brand-800 py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`${type.displaySection} text-white`}>
                Be first.
              </p>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-brand-200">
                We're building this carefully. Join the waitlist and help shape
                what gets built first — no spam, no pressure.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:flex-shrink-0">
              <Button href="/waitlist" size="lg">
                Join the Waitlist
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Learn more
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
