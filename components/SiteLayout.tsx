"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";
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
    <main className="min-h-screen bg-white text-neutral-900">

      {/* ── Header ── */}
      <header className="sticky top-0 left-0 right-0 z-40">
        <div className="bg-white/95 shadow-md backdrop-blur-md">
          {/* ── Mobile header: logo left, hamburger right ──
              `unoptimized` keeps the original PNG bytes intact. Next's
              optimizer was flattening the lockup's transparent regions
              to white, which made the footer logo look like an opaque
              block. The PNGs are small (~3-4 KB) so skipping
              optimization costs nothing. */}
          <div className="flex items-center justify-between px-4 py-3 md:hidden">
            <Link href="/" className="flex items-center transition-transform duration-150 hover:scale-[96%] active:scale-[93%]">
              <Image
                src="/logo-msr-lockup-dark.png"
                alt="Men's Sole Revival"
                width={320}
                height={60}
                className="h-10 w-auto"
                priority
                unoptimized
              />
            </Link>
            <div className="flex items-center gap-1">
              <SearchTrigger variant="mobile" />
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 transition"
              >
                {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>

          {/* ── Desktop header: 3-col grid ── */}
          <div className="mx-auto hidden max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-3 md:grid">
            {/* Left: nav links */}
            <nav className="flex items-center gap-6">
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium transition ${
                      isActive
                        ? "text-brand-600 underline underline-offset-4 decoration-brand-300"
                        : "text-neutral-600 hover:text-brand-600 hover:underline hover:underline-offset-4 hover:decoration-brand-300"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            {/* Center: logo (M01 + wordmark horizontal lockup) */}
            <Link href="/" className="flex items-center justify-center transition-transform duration-150 hover:scale-[96%] active:scale-[93%]">
              <Image
                src="/logo-msr-lockup-dark.png"
                alt="Men's Sole Revival"
                width={320}
                height={60}
                className="h-10 w-auto"
                priority
                unoptimized
              />
            </Link>
            {/* Right: search + CTA */}
            <div className="flex items-center justify-end gap-3">
              <SearchTrigger variant="desktop" />
              <Button href="/assessment" size="sm">Take the Assessment</Button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div className="border-t border-neutral-100 md:hidden">
              <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
                {navLinks.map(({ label, href }) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`-mx-2 rounded-md px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "text-brand-600 bg-brand-50"
                          : "text-neutral-700 hover:text-brand-600 hover:bg-neutral-50"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div className="mt-3 border-t border-neutral-100 pt-3">
                  <Button href="/assessment" size="sm" className="w-full justify-center">
                    Take the Assessment
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
      <footer className="bg-brand-900">
        <Container>
          <div className="py-14">

            {/* ── Main footer row ── */}
            <div className="flex flex-col gap-10 md:flex-row md:justify-between">
              <div>
                <Image
                  src="/logo-msr-lockup-light.png"
                  alt="Men's Sole Revival"
                  width={320}
                  height={60}
                  className="h-12 w-auto"
                  unoptimized
                />
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                  Foot care, footwear, and the holistic habits that keep men
                  moving well into their best decades.
                </p>
              </div>
              <div className="flex gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Explore
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      { label: "Assessment", href: "/assessment" },
                      { label: "Guides", href: "/guides" },
                      { label: "Product Reviews", href: "/reviews" },
                      { label: "Routines", href: "/routines" },
                      { label: "About", href: "/about" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-white/80 transition hover:text-white">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Company
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      { label: "Waitlist", href: "/waitlist" },
                      { label: "Contact", href: "mailto:alfonso@barreiro.com" },
                    ].map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-white/80 transition hover:text-white">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Built by / Connect strip ── */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Built by
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Alfonso Barreiro · UX/UI Designer · Portland, OR
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Download resume */}
                  <a
                    href="/Alfonso_Barreiro_Resume_April_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Resume
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/alfonso-barreiro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                    LinkedIn
                  </a>
                  {/* Grab coffee */}
                  <a
                    href="https://cal.com/alfonso-barreiro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-accent-700 bg-accent-900/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-400 transition hover:border-accent-500 hover:bg-accent-900/60 hover:text-accent-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
                    </svg>
                    Coffee in Portland
                  </a>
                </div>
              </div>
            </div>

            {/* ── Copyright ── */}
            <div className="mt-6 text-xs text-white/40">
              © {new Date().getFullYear()} Men's Sole Revival. Built with intention.
            </div>

          </div>
        </Container>
      </footer>
    </main>
  );
}
