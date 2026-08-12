"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import { Button, IconButton } from "@/components/ui";
import SearchTrigger from "@/components/SearchTrigger";

const navLinks = [
  { label: "Guides", href: "/guides" },
  { label: "Product Reviews", href: "/reviews" },
  { label: "Routines", href: "/routines" },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Reusable hamburger / close icons
  const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );

  return (
    <main className="min-h-screen bg-ground text-ink">

      {/* ── Header ── */}
      <header className="sticky top-0 left-0 right-0 z-40">
        <div className="bg-bg-elevated/95 shadow-md backdrop-blur-md">
          {/* ── Mobile header: logo left, hamburger right ──
              Explicit width alongside h-N so the browser rasterizes at
              integer bounds — viewBox 313×81 doesn't divide cleanly into
              48px height, and w-auto lands at 185.48px (sub-pixel edges).
              Paired with shape-rendering="geometricPrecision" on the SVG. */}
          <div className="flex items-center justify-between px-4 py-3 md:hidden">
            <Link
              href="/"
              aria-label="Men's Sole Revival — home"
              className="flex items-center transition-transform duration-150 hover:scale-[96%] active:scale-[93%]"
            >
              <Image
                src="/lockups/nav-light.svg"
                alt="Men's Sole Revival"
                width={313}
                height={81}
                className="h-10 w-[154px]"
                priority
                unoptimized
              />
            </Link>
            <div className="flex items-center gap-1">
              <SearchTrigger variant="mobile" />
              <IconButton
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </IconButton>
            </div>
          </div>

          {/* ── Desktop header: logo left, nav middle, actions right.
              max-w-6xl matches the Container component used by every other
              section, so nav margins line up with body margins. ── */}
          <div className="mx-auto hidden max-w-6xl items-center px-6 py-3 md:flex md:gap-12">
            {/* Logo — mark + wordmark, inline SVG for sharpness at any size */}
            <Link
              href="/"
              aria-label="Men's Sole Revival — home"
              className="flex flex-shrink-0 items-center transition-transform duration-150 hover:scale-[96%] active:scale-[93%]"
            >
              <Image
                src="/lockups/nav-light.svg"
                alt="Men's Sole Revival"
                width={313}
                height={81}
                className="h-12 w-[185px]"
                priority
                unoptimized
              />
            </Link>
            {/* Nav links — sit immediately after the logo */}
            <nav className="flex items-center gap-6">
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`text-[0.9375rem] font-medium transition ${
                      isActive
                        ? "text-ink underline underline-offset-4 decoration-neutral-300"
                        : "text-neutral-600 hover:text-ink hover:underline hover:underline-offset-4 hover:decoration-neutral-300"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            {/* Right — search + CTA, pushed to the far right */}
            <div className="ml-auto flex items-center gap-3">
              <SearchTrigger variant="desktop" />
              <Button href="/assessment" variant="secondary" size="sm">Assessment</Button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div className="border-t border-neutral-200 md:hidden">
              <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
                {navLinks.map(({ label, href }) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`-mx-2 px-3 py-3 text-[0.9375rem] font-medium transition ${
                        isActive
                          ? "text-ink bg-neutral-100"
                          : "text-neutral-600 hover:text-ink hover:bg-neutral-100"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div className="mt-3 border-t border-neutral-200 pt-3">
                  <Button href="/assessment" size="sm" fullWidth>
                    Take the assessment
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ── Page content ── */}
      {children}

      {/* ── Footer ── */}
      <footer className="bg-ink">
        <Container>
          <div className="py-16">

            {/* ── Main footer row ── */}
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div>
                <Image
                  src="/lockups/footer-dark.svg"
                  alt="Men's Sole Revival"
                  width={226}
                  height={60}
                  className="h-12 w-[181px]"
                  unoptimized
                />
                <p className="mt-4 max-w-xs text-[0.9375rem] leading-[1.5] text-inverse-muted">
                  Foot care and footwear for men who want to keep moving after 40.
                </p>
              </div>
              {/* Footer link discipline — DS rule:
                  · Links = text-inverse-body (80% white). Hover promotes to text-inverse
                    with underline. Accent is reserved for the ONE action, never for stacked link lists.
                  · Column labels = uppercase eyebrow, muted (text-inverse-caption).
                  · Row density = space-y-1 + leading-6 — tight enough that the column reads
                    as one block, not five orphaned links.
                  · Taxonomy = Explore (destinations) vs Company (about the org). */}
              <div className="flex gap-16">
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-inverse-caption">
                    Explore
                  </p>
                  <ul className="mt-4 space-y-1">
                    {[
                      { label: "Assessment", href: "/assessment" },
                      { label: "Guides", href: "/guides" },
                      { label: "Product Reviews", href: "/reviews" },
                      { label: "Routines", href: "/routines" },
                      { label: "Newsletter", href: "/newsletter" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-[0.9375rem] leading-6 text-inverse-body transition hover:text-inverse hover:underline underline-offset-4"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-inverse-caption">
                    Company
                  </p>
                  <ul className="mt-4 space-y-1">
                    {[
                      { label: "About", href: "/about" },
                      { label: "Contact", href: "mailto:alfonso@barreiro.com" },
                    ].map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-[0.9375rem] leading-6 text-inverse-body transition hover:text-inverse hover:underline underline-offset-4"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Copyright ── */}
            <div className="mt-12 border-t border-inverse-hairline pt-8 text-xs text-inverse-caption">
              © {new Date().getFullYear()} Men&rsquo;s Sole Revival. Independent, reader-supported.
            </div>

          </div>
        </Container>
      </footer>
    </main>
  );
}
