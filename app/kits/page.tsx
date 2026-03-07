import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Card from "@/components/Card";
import SiteLayout from "@/components/SiteLayout";
import Button from "@/components/Button";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Starter Kits",
  description: "Curated starter kits for the most common men's foot health problems. Simple routines, honest tools.",
};

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
  {
    title: "Dry Skin & Cracking",
    tag: "Quick wins",
    desc: "For rough heels, persistent dryness, and cracking that comes back no matter what lotion you use.",
    href: "/waitlist?kit=dry-skin",
  },
  {
    title: "Odor & Hygiene",
    tag: "Foundation",
    desc: "For persistent odor, excessive sweating, and the hygiene habits that most men were never taught.",
    href: "/waitlist?kit=odor-hygiene",
  },
  {
    title: "Footwear Fit",
    tag: "Prevention",
    desc: "For men who suspect their shoes are causing problems. How to assess fit and what to look for.",
    href: "/waitlist?kit=footwear-fit",
  },
];

export default function KitsPage() {
  return (
    <SiteLayout>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[55vh] flex-col overflow-hidden bg-brand-900">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=75"
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
              <p className={`${type.overline} text-accent-400`}>Starter Kits</p>
              <h1 className={`mt-3 ${type.displaySection} text-white`}>
                Start with<br />a kit.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200">
                Each kit bundles a simple routine with the right tools for a
                specific problem. Tell us which you need — we'll prioritize
                what ships first.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Kits grid ── */}
      <section className="py-12">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kits.map((kit) => (
              <Card key={kit.title} {...kit} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Waitlist nudge ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <Container>
          <div className="max-w-lg">
            <h2 className={`${type.displaySm} text-brand-900`}>Not sure where to start?</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Join the waitlist and we'll ask you a few questions about
              what you're dealing with. We'll recommend the right kit and
              let you know when it's ready.
            </p>
            <div className="mt-6">
              <Button href="/waitlist" size="md">
                Join the Waitlist
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
