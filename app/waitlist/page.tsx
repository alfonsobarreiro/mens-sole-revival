import type { Metadata } from "next";
import Container from "@/components/Container";
import SiteLayout from "@/components/SiteLayout";
import { type } from "@/components/typography";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Get early access to Men's Sole Revival starter kits and guides. Help shape what gets built first.",
};

export default function WaitlistPage() {
  return (
    <SiteLayout>

      {/* ── Header ── */}
      <section className="border-b border-neutral-200 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className={type.overline}>Early Access</p>
            <h1 className={`mt-3 ${type.h1}`}>
              Be first when kits and guides launch.
            </h1>
            <p className={`mt-6 ${type.lead}`}>
              We're building this carefully. Join the waitlist and help shape
              what gets built first. No spam, no pressure — just occasional
              updates when things are ready.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Form ── */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-md">
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className={`block mb-2 ${type.label}`}>
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Alfonso"
                  className="w-full rounded border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <div>
                <label htmlFor="email" className={`block mb-2 ${type.label}`}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <div>
                <label htmlFor="kit" className={`block mb-2 ${type.label}`}>
                  Which kit are you most interested in? <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <select
                  id="kit"
                  className="w-full rounded border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                >
                  <option value="">Select a kit…</option>
                  <option value="pain-recovery">Pain &amp; Recovery</option>
                  <option value="fungus-care">Fungus &amp; Nail Care</option>
                  <option value="alignment-mobility">Toe Alignment &amp; Mobility</option>
                  <option value="dry-skin">Dry Skin &amp; Cracking</option>
                  <option value="odor-hygiene">Odor &amp; Hygiene</option>
                  <option value="footwear-fit">Footwear Fit</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 active:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                Join the Waitlist
              </button>
              <p className="text-xs text-neutral-400">
                No spam. Unsubscribe at any time. We take privacy seriously.
              </p>
            </form>
          </div>
        </Container>
      </section>

      {/* ── Reassurance ── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                heading: "No commerce yet",
                body: "We're building this before we sell anything. Waitlist members get first access and a say in what ships.",
              },
              {
                heading: "Your input shapes the product",
                body: "The kit you select tells us what to prioritize. We read every response.",
              },
              {
                heading: "Occasional updates only",
                body: "We won't email you weekly. You'll hear from us when something meaningful is ready.",
              },
            ].map((item) => (
              <div key={item.heading}>
                <h3 className={type.h4}>{item.heading}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

    </SiteLayout>
  );
}
