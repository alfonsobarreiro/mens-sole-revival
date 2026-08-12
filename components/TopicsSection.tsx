"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { Button, IconButton } from "@/components/ui";
import { type } from "@/components/typography";

// Copy rewritten 2026-08-11 per AI-tells sweep + Alfonso's no-em-dash rule.
// Rewrite log lives in alfOS: [[AI tells — 50 patterns to hunt]].
const topics = [
  {
    label: "Pain",
    href: "/routines",
    leftImage: "/images/pexels-15098712.jpg",
    tagline: "Heel pain rarely resolves on its own.",
    description:
      "Plantar fasciitis, heel spurs, and arch strain hold for months and years without treatment. Identifying the source and loading the tissue correctly is the difference between a six-week recovery and a five-year problem.",
  },
  {
    label: "Nails",
    href: "/guides/toenail-fungus-what-works",
    leftImage: "/images/pexels-9767780.jpg",
    tagline: "Fungal infection needs a 12-week protocol.",
    description:
      "Thick, discolored, or ingrown nails are more common than most men admit, and more treatable. Physical debridement plus a topical antifungal used for the full 12 weeks (not just until it looks better) is the fix path that actually works.",
  },
  {
    label: "Alignment",
    href: "/guides/why-toe-alignment-affects-knees-and-hips",
    leftImage: "/images/pexels-33360918.jpg",
    tagline: "Your big toe drives 40–60% of push-off.",
    description:
      "Bunions, hammer toes, and crowded toe boxes all trace back to how your foot contacts the ground. Daily spreader work and wide toe-box footwear can slow or reverse years of drift.",
  },
  {
    label: "Routine",
    href: "/guides/5-minute-routine",
    leftImage: "/images/pexels-4909313.jpg",
    tagline: "Five minutes. Every day.",
    description:
      "A two-minute check done every night after the shower: wash, dry, moisturize, inspect. Same time every day is what turns it into a habit that heads off most of the routine problems men over 40 develop.",
  },
  {
    label: "Fit",
    href: "/guides/what-your-dress-shoes-are-doing-to-your-feet",
    leftImage: "/images/pexels-8729236.jpg",
    tagline: "Most men wear the wrong size for 20+ years.",
    description:
      "63–72% of adults wear shoes that don't fit, and the number climbs after 40 because feet keep changing. Getting your length and width measured, both feet at day's end, is the highest-leverage fix on this site.",
  },
  {
    label: "Skin",
    href: "/guides/cracked-heels-what-actually-works",
    leftImage: "/images/pexels-11873696.jpg",
    tagline: "Cracks close in 2–3 weeks with a nightly routine.",
    description:
      "Heels don't have oil glands, so rough skin and cracks are a moisture-loss problem. Nightly urea cream on damp feet in a sock shifts it. Pumice comes second, not first.",
  },
];

export default function TopicsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelIndex, setPanelIndex] = useState(0);
  // Track whether the user is on a mobile viewport
  const [isMobile, setIsMobile] = useState(false);
  // On mobile, nothing appears "selected" until the user first taps
  const [mobileTapped, setMobileTapped] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (panelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [panelOpen]);

  const handleTopicClick = (e: React.MouseEvent, i: number) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setMobileTapped(true);
      setActiveIndex(i);
      setPanelIndex(i);
      setPanelOpen(true);
    }
  };

  // A topic is "active" on desktop always; on mobile only after the first tap
  const isActive = (i: number) => i === activeIndex && (!isMobile || mobileTapped);

  const t = topics[panelIndex];

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-12">
            <h2 className={`${type.displaySection} text-ink`}>
              The topics.
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.5] text-neutral-600">
              Six areas of foot health that men over 40 actually deal with.
              Hover or tap to see what each one covers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "512px" }}>

          {/* Left: stacked words + active description */}
          <div className="flex flex-col justify-center px-8 py-12 lg:px-16">

            {/* Stacked word list */}
            <div className="mb-12">
              {topics.map((topic, i) => (
                <Link
                  key={i}
                  href={topic.href}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={(e) => handleTopicClick(e, i)}
                  className={`flex items-center gap-2 ${type.displayHero} py-1 transition-colors duration-300 ${
                    isActive(i)
                      ? "text-ink"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {topic.label}
                  {/* Tap indicator — mobile only */}
                  <span
                    className={`md:hidden text-neutral-500 text-sm transition-opacity duration-300 ${
                      isActive(i) ? "opacity-100" : "opacity-40"
                    }`}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </Link>
              ))}
            </div>

            {/* Active description — stacked via absolute to avoid layout shift.
                No translate animation (bounce removed); opacity swap only. */}
            <div className="relative hidden md:block" style={{ minHeight: "12rem" }}>
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-200 ${
                    i === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="font-body text-[0.9375rem] leading-[1.5] text-neutral-600 mb-6">
                    {topic.description} {topic.tagline}
                  </p>
                  <Link
                    href={topic.href}
                    className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-link underline underline-offset-4 hover:text-link-hover transition-colors duration-200 group"
                  >
                    Explore this topic
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile hint */}
            <p className="md:hidden mt-6 font-body text-xs text-neutral-500">
              Tap a topic to learn more
            </p>
          </div>

          {/* Right: crossfading image — inset from all edges for breathing room */}
          <div className="relative hidden md:block" style={{ minHeight: "512px" }}>
            <div className="absolute inset-8 overflow-hidden bg-ink">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image src={topic.leftImage} alt="" fill className="muted-photo object-cover object-center" />
                  <div className="absolute inset-0 bg-ink/10" />
                </div>
              ))}
            </div>
          </div>

          </div>
        </Container>
      </section>

      {/* ── Mobile bottom sheet ────────────────────────────────── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setPanelOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/60 md:hidden transition-opacity duration-300 ${
          panelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet — sharp corners per DS radius=0 rule */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.label}
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-elevated shadow-2xl
          transition-transform duration-300 ease-out
          ${panelOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "78vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* DS 2px ink divider */}
        <div className="mx-6 mt-3 h-[2px] bg-ink" />

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pt-6 pb-8" style={{ maxHeight: "calc(78vh - 48px)" }}>

          {/* Close row */}
          <div className="flex items-center justify-end mb-6">
            <IconButton
              onClick={() => setPanelOpen(false)}
              aria-label="Close"
              size="sm"
            >
              ✕
            </IconButton>
          </div>

          {/* Editorial content */}
          <h3 className={`${type.h3} text-ink mb-4`}>
            {t.label}
          </h3>
          <p className="font-body text-[0.9375rem] leading-[1.5] text-neutral-600 mb-8">
            {t.description} {t.tagline}
          </p>

          {/* CTA — DS Button primitive */}
          <Button href={t.href} size="md" onClick={() => setPanelOpen(false)}>
            Explore this topic →
          </Button>
        </div>
      </div>
    </>
  );
}
