"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";

const navLinks = [
  { label: "Library", href: "/learn" },
  { label: "Kits", href: "/kits" },
  { label: "About", href: "/about" },
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

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <Container>
          <div className="flex items-center justify-between py-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80">
              <span className="font-heading text-lg font-semibold text-brand-900">
                Men's Sole Revival
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium transition ${
                      isActive
                        ? "text-brand-600 underline underline-offset-4 decoration-brand-300"
                        : "text-neutral-600 hover:text-brand-600"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <Button href="/waitlist" size="sm">Join the Waitlist</Button>
            </nav>

            {/* Mobile: hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 transition md:hidden"
            >
              {menuOpen ? (
                // X icon
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="border-t border-neutral-100 bg-white md:hidden">
            <Container>
              <nav className="flex flex-col py-4">
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
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <Button href="/waitlist" size="sm" className="w-full justify-center">
                    Join the Waitlist
                  </Button>
                </div>
              </nav>
            </Container>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      {children}

      {/* ── Footer ── */}
      <footer className="bg-brand-900">
        <Container>
          <div className="py-14">
            <div className="flex flex-col gap-10 md:flex-row md:justify-between">
              <div>
                <p className="font-display text-xl font-bold uppercase tracking-tight text-white">
                  Men's Sole Revival
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-brand-400">
                  Foot care, footwear, and the holistic habits that keep men
                  moving well into their best decades.
                </p>
              </div>
              <div className="flex gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                    Explore
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      { label: "Library", href: "/learn" },
                      { label: "Kits", href: "/kits" },
                      { label: "About", href: "/about" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-brand-300 transition hover:text-white">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                    Company
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      { label: "About", href: "/about" },
                      { label: "Waitlist", href: "/waitlist" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-brand-300 transition hover:text-white">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-brand-800 pt-6 text-xs text-brand-600">
              © {new Date().getFullYear()} Men's Sole Revival. Built with intention.
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
