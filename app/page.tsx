import Container from "@/components/Container";
import Button from "@/components/Button";
import Card from "@/components/Card";
import SiteLayout from "@/components/SiteLayout";
import TopicsSection from "@/components/TopicsSection";
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
    slug: "what-your-dress-shoes-are-doing-to-your-feet",
    title: "What 30 Years in Dress Shoes Actually Does to Your Feet",
    category: "Footwear Fit",
    readTime: "7 min",
    excerpt: "Most men don't connect the shoes they wore for decades to the foot problems they have now. Here's the chain of cause and effect.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=75",
  },
  {
    slug: "big-toe-and-your-whole-body",
    title: "Your Big Toe Controls More of Your Body Than You Think",
    category: "Toe Alignment",
    readTime: "6 min",
    excerpt: "The big toe is responsible for 40–60% of your push-off force. Most men have spent decades restricting it — and wondering why their knee hurts.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75",
  },
  {
    slug: "cracked-heels-what-actually-works",
    title: "Cracked Heels: The Fix That Isn't a Pumice Stone",
    category: "Dry Skin",
    readTime: "5 min",
    excerpt: "Scrubbing dry, cracked heel skin is the wrong starting point. Here's what's actually happening — and the routine that addresses it.",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=75",
  },
  {
    slug: "toenail-fungus-what-works",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    category: "Nail Care",
    readTime: "8 min",
    excerpt: "The evidence on OTC treatments, prescription options, and home remedies — ranked by how well they actually work.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75",
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
          <div className="grid grid-cols-1 divide-y divide-neutral-100 md:grid-cols-2 md:divide-x md:divide-y-0">
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

      {/* ── From the Library — featured left sticky + 3 articles right ── */}
      <section className="border-t border-neutral-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT — sticky featured story */}
          <div className="border-b border-neutral-200 md:border-b-0 md:border-r md:border-neutral-200">
            <div className="md:sticky md:top-0 p-8 md:p-10 lg:p-14">

              {/* Section heading */}
              <p className={`${type.displayHero} text-brand-900 leading-none`}>
                FROM<br />THE<br />LIBRARY.
              </p>
              <Link
                href="/learn"
                className="mt-6 mb-10 inline-flex items-center gap-2 border border-brand-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:bg-brand-900 hover:text-white"
              >
                View all guides
              </Link>

              {/* Featured article */}
              <Link href={`/blog/${articles[0].slug}`} className="group block">
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

          {/* RIGHT — 3 articles that scroll past the sticky left */}
          <div className="divide-y divide-neutral-200">
            {articles.slice(1, 4).map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
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
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1000&q=70"
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
            <p className="mt-5 max-w-md text-base leading-7 text-brand-300">
              When your feet work well, everything else gets easier — your knees,
              your posture, your energy. This is the leverage most men overlook,
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

      {/* ── Kits — what we're building, tell us what you need ── */}
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

      {/* ── Parallax CTA ── */}
      <section
        className="relative overflow-hidden py-28 md:py-44"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1600&q=60')",
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
              BE FIRST.
            </p>
            <p className="max-w-lg text-lg leading-relaxed text-brand-200">
              We're building this carefully. Join the waitlist and help shape
              what gets built first — no spam, no pressure.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/waitlist" size="lg">
                Join the Waitlist
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 active:bg-white/20"
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
