import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80">
              <span className="font-heading text-lg font-semibold text-brand-900">
                Men's Sole Revival
              </span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/learn" className="text-sm font-medium text-neutral-600 hover:text-brand-600">
                Learn
              </Link>
              <Link href="/kits" className="text-sm font-medium text-neutral-600 hover:text-brand-600">
                Kits
              </Link>
              <Link href="/about" className="text-sm font-medium text-neutral-600 hover:text-brand-600">
                About
              </Link>
              <Button href="/waitlist" size="sm">Join the Waitlist</Button>
            </nav>
            <Button href="/waitlist" size="sm" className="md:hidden">
              Join
            </Button>
          </div>
        </Container>
      </header>

      {/* ── Page content ── */}
      {children}

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-12">
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div>
                <p className="font-heading text-base font-semibold text-brand-900">
                  Men's Sole Revival
                </p>
                <p className="mt-2 max-w-xs text-sm text-neutral-500">
                  Foot care, footwear, and the holistic habits that keep men
                  moving well into their best decades.
                </p>
              </div>
              <div className="flex gap-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Explore
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      { label: "Learn", href: "/learn" },
                      { label: "Kits", href: "/kits" },
                      { label: "Blog", href: "/blog" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-neutral-600 hover:text-brand-600">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Company
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      { label: "About", href: "/about" },
                      { label: "Waitlist", href: "/waitlist" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-neutral-600 hover:text-brand-600">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-400">
              © {new Date().getFullYear()} Men's Sole Revival. Built with intention.
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
