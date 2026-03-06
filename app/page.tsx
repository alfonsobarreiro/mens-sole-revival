import Container from "@/components/Container";
import Button from "@/components/Button";
import Card from "@/components/Card";
import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import { type } from "@/components/typography";

// ── Data ────────────────────────────────────────────────────
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
    title: "Toenail fungus: what actually works (and what's a scam)",
    href: "/blog/toenail-fungus-what-works",
    readTime: "8 min",
    category: "Nail Care",
    // Unsplash: close-up of foot/nail care
    image: "https://images.unsplash.com/photo-1608138278598-7e595958dbe0?w=600&q=75",
  },
  {
    title: "Why toe alignment affects your knees and hips",
    href: "/blog/why-toe-alignment-affects-knees-and-hips",
    readTime: "6 min",
    category: "Alignment",
    // Unsplash: man walking/running outdoors
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=75",
  },
  {
    title: "A 5-minute daily foot-care routine you can stick to",
    href: "/blog/5-minute-routine",
    readTime: "4 min",
    category: "Routine",
    // Unsplash: morning routine / self-care
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=75",
  },
];

const stats = [
  { value: "1 in 4", label: "men over 40 experience chronic foot pain" },
  { value: "75%", label: "of foot problems are preventable with consistent care" },
  { value: "6 months", label: "average time to see results from proper treatment" },
];

// ── Page ────────────────────────────────────────────────────
export default function Home() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-brand-900 py-20 md:py-28">
        {/* Background photo — man outdoors, feet/trail theme */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=1600&q=60"
            alt=""
            fill
            className="object-cover object-center opacity-20"
            priority
          />
        </div>
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-900/95 via-brand-900/80 to-brand-900/40" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-400">
              Foot Care · Footwear · Holistic Health
            </p>
            <h1 className={`${type.h1} text-white`}>
              Your feet carry you through everything.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-200">
              Evidence-based foot care for men over 40. Clear routines,
              honest guides, and starter kits for the problems men actually
              deal with — without the miracle claims.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/waitlist" size="lg">
                Join the Waitlist
              </Button>
              <Button href="/learn" variant="outline" size="lg"
                className="border-white/30 text-white hover:bg-white/10 active:bg-white/20">
                Browse Articles
              </Button>
            </div>
            <p className="mt-5 text-sm text-brand-400">
              No commerce yet — we're building this in the open.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-neutral-200 bg-brand-50 py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((s) => (
              <div key={s.value} className="flex flex-col gap-1">
                <span className="font-heading text-3xl font-semibold text-brand-600">
                  {s.value}
                </span>
                <span className="text-sm text-neutral-600">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why it matters ── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-xl">
            <p className={type.overline}>Why this exists</p>
            <h2 className={`mt-3 ${type.h2}`}>
              Foot health is the foundation of how you move.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
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

      {/* ── Kits ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 md:py-20">
        <Container>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={type.overline}>Starter kits</p>
              <h2 className={`mt-3 ${type.h2}`}>Start with a kit</h2>
              <p className={`mt-2 max-w-xl ${type.lead}`}>
                Each kit bundles a simple routine with the right tools.
                Tell us which you need — we'll prioritize what ships first.
              </p>
            </div>
            <Link href="/kits"
              className="hidden text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700 md:block">
              View all kits →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {kits.map((kit) => (
              <Card key={kit.title} {...kit} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Articles ── */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={type.overline}>From the library</p>
              <h2 className={`mt-3 ${type.h2}`}>Clear guides, no hype</h2>
              <p className={`mt-2 max-w-xl ${type.lead}`}>
                Practical, evidence-based articles built to reduce confusion
                and help you make better decisions about your feet.
              </p>
            </div>
            <Link href="/learn"
              className="hidden text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700 md:block">
              Browse all →
            </Link>
          </div>
          <div className="mt-8 space-y-3">
            {articles.map((a) => (
              <Link key={a.href} href={a.href}
                className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-sm md:px-5 md:py-4">
                {/* Thumbnail */}
                <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded md:h-14 md:w-20">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                {/* Text */}
                <div className="flex flex-1 items-center gap-4">
                  <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 md:inline-block">
                    {a.category}
                  </span>
                  <span className="text-sm font-medium text-neutral-800 group-hover:text-brand-700">
                    {a.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <span className="hidden text-xs md:block">{a.readTime}</span>
                  <span className="text-sm group-hover:text-brand-500">→</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 md:hidden">
            <Link href="/learn"
              className="text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-700">
              Browse all articles →
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-neutral-200 bg-brand-800 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className={`${type.overline} text-brand-400`}>Get early access</p>
            <h2 className={`mt-3 ${type.h2} text-white`}>
              Be first when kits and guides launch.
            </h2>
            <p className="mt-4 text-base leading-7 text-brand-300">
              We're building this carefully. Join the waitlist and help shape
              what gets built first — no spam, no pressure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/waitlist" size="lg">
                Join the Waitlist
              </Button>
              <Button href="/about" variant="outline" size="lg"
                className="border-white/30 text-white hover:bg-white/10">
                Learn more about us
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
