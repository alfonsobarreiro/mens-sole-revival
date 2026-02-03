import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="font-semibold tracking-tight">
              Men’s Sole Revival
            </div>
            <Button href="/waitlist">Join the Waitlist</Button>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="py-14">
        <Container>
          <p className="mb-3 text-sm font-medium text-zinc-600">
            Waitlist-first MVP • No commerce yet
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Foot care for men over 40 — made practical.
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-700">
            Evidence-based routines and starter kits for the problems men
            actually deal with: pain, nail fungus, and toe alignment.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/waitlist">Join the Waitlist</Button>
            <Button href="/kits" variant="secondary">
              View Kits
            </Button>
          </div>

          <p className="mt-4 text-sm text-zinc-600">
            No miracle claims. Clear routines. Built for consistency.
          </p>
        </Container>
      </section>

      {/* Kits */}
      <section className="pb-14">
        <Container>
          <h2 className="text-xl font-semibold tracking-tight">
            Start with a kit
          </h2>
          <p className="mt-2 text-zinc-700">
            Each kit bundles a simple routine + recommended tools. Join the kit
            waitlist to help prioritize what ships first.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card
              title="Pain & Recovery"
              desc="For soreness, fatigue, plantar discomfort, and everyday foot ache."
              href="/waitlist?kit=pain-recovery"
            />
            <Card
              title="Fungus & Nail Care"
              desc="For discoloration, thick nails, and the confidence tax of hiding your feet."
              href="/waitlist?kit=fungus-care"
            />
            <Card
              title="Toe Alignment & Mobility"
              desc="For cramped toes, bunions, balance, and restoring natural foot function."
              href="/waitlist?kit=alignment-mobility"
            />
          </div>
        </Container>
      </section>

      {/* Learn */}
      <section className="pb-14">
        <Container>
          <h2 className="text-xl font-semibold tracking-tight">Learn</h2>
          <p className="mt-2 text-zinc-700">
            Quick, practical guides. Built to reduce confusion and filter out
            gimmicks.
          </p>

          <div className="mt-6 space-y-3">
            <LearnRow
              title="Toenail fungus: what actually works (and what’s a scam)"
              href="/learn/toenail-fungus-what-works"
            />
            <LearnRow
              title="Why toe alignment affects knees and hips"
              href="/learn/toe-alignment-chain"
            />
            <LearnRow
              title="A 5-minute daily foot-care routine you can stick to"
              href="/learn/5-minute-routine"
            />
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="pb-20">
        <Container>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              What this is
            </h2>
            <p className="mt-2 max-w-3xl text-zinc-700">
              Men’s Sole Revival is a waitlist-first product concept focused on
              practical foot care for men over 40. The goal: make at-home foot
              health normal, simple, and worth doing — without shame or hype.
            </p>

            <div className="mt-6">
              <Button href="/waitlist">Join the Waitlist</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <Container>
          <div className="flex items-center justify-between py-6 text-sm text-zinc-600">
            <span>© {new Date().getFullYear()} Men’s Sole Revival</span>
            <div className="flex gap-4">
              <a className="hover:text-zinc-900" href="/about">
                About
              </a>
              <a className="hover:text-zinc-900" href="/waitlist">
                Waitlist
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}

function LearnRow({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-zinc-900">{title}</span>
        <span className="text-sm text-zinc-600">→</span>
      </div>
    </a>
  );
}
