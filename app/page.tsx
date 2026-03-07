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
  { value: "1 in 4", label: "men over 40 experience chronic foot pain" },
  { value: "75%", label: "of foot problems are preventable with consistent care" },
  { value: "6 months", label: "average time to see results from proper treatment" },
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
                Foot Care · Footwear · Holistic Health
              </p>

              {/* Display-scale hero headline — Barlow Condensed */}
              <h1 className={`${type.displayHero} text-white`}>
                Your feet<br />
                carry you<br />
                through<br />
                everything.
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-brand-200">
                Evidence-based foot care for men over 40. Clear routines,
                honest guides, and starter kits for the problems men actually
                deal with — without the miracle claims.
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

      {/* ── Stats ── */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-14 md:py-16">
        <Container>
          <p className={`${type.displaySm} mb-8 text-neutral-300`}>
            By the numbers
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.value}
                className="flex flex-col gap-1 rounded-lg bg-white p-5 shadow-sm ring-1 ring-neutral-100"
              >
                <span className="font-heading text-3xl font-semibold text-brand-500">
                  {s.value}
                </span>
                <span className="text-sm text-neutral-600">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why it matters ── */}
      <section className="py-16 md:py-24">
        <Container>
          {/* Display-scale section opener */}
          <div className="mb-12 max-w-2xl">
            <p className={`${type.displaySection} text-brand-900`}>
              Know your feet.
            </p>
            <p className="mt-4 max-w-lg text-base leading-7 text-neutral-500">
              Foot problems rarely announce themselves. By the time they're obvious,
              they've usually been building for years.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                heading: "Problems start quietly",
                body: "Foot issues rarely announce themselves. By the time they're obvious — the pain, the discoloration, the cramped toes — they've usually been building for years.",
              },
              {
                heading: "Most advice is backwards",
                body: "The internet is full of miracle products and 3-day fixes. Real foot care is a long game that rewards consistency over shortcuts.",
              },
              {
                heading: "It compounds upward",
                body: "When your feet work well, everything else gets easier — your knees, your posture, your energy. This is the leverage most men overlook.",
              },
            ].map((item) => (
              <div
                key={item.heading}
                className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-1 w-8 rounded-full bg-accent-500" />
                <h3 className={type.h4}>{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
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

      {/* ── From the Library ── */}
      <section className="border-t border-neutral-200 py-16 md:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`${type.displaySection} text-brand-900`}>
                From the library.
              </p>
              <p className="mt-3 max-w-xl text-base leading-7 text-neutral-500">
                Practical, evidence-based articles built to reduce confusion
                and help you make better decisions about your feet.
              </p>
            </div>
            <Link
              href="/learn"
              className="hidden text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700 md:block"
            >
              Browse all →
            </Link>
          </div>

          {/* Editorial layout: featured article large, two compact below */}
          <div className="grid gap-4 md:grid-cols-3">

            {/* Featured — spans 2 columns on desktop */}
            <Link
              href={`/blog/${articles[0].slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md md:col-span-2"
            >
              <div className="relative h-52 w-full overflow-hidden md:h-64">
                <Image
                  src={articles[0].image}
                  alt={articles[0].title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                    {articles[0].category}
                  </span>
                  <span className="text-xs text-neutral-400">{articles[0].readTime} read</span>
                </div>
                <h2 className={`mt-3 ${type.h3} group-hover:text-brand-700`}>
                  {articles[0].title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">
                  {articles[0].excerpt}
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-500 group-hover:text-brand-700">
                  Read article →
                </p>
              </div>
            </Link>

            {/* Two compact articles stacked */}
            <div className="flex flex-col gap-4">
              {articles.slice(1).map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600">
                        {a.category}
                      </span>
                      <span className="text-xs text-neutral-400">{a.readTime} read</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-neutral-800 group-hover:text-brand-700">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/learn"
              className="text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700"
            >
              Browse all articles →
            </Link>
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
