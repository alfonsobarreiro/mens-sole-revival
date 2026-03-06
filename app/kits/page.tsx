import type { Metadata } from "next";
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

      {/* ── Header ── */}
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Starter Kits</p>
            <h1 className={`mt-3 ${type.h1}`}>Start with a kit.</h1>
            <p className={`mt-6 ${type.lead}`}>
              Each kit bundles a simple routine with the right tools for a
              specific problem. Tell us which you need — we'll prioritize what
              ships first.
            </p>
          </div>
        </Container>
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
            <h2 className={type.h3}>Not sure where to start?</h2>
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
