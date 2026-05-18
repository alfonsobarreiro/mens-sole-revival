"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const topics = [
  {
    label: "Pain",
    href: "/routines",
    leftImage: "/images/pexels-15098712.jpg",
    tagline: "Your body is sending a signal.",
    description:
      "Plantar fasciitis, heel spurs, arch strain — foot pain rarely disappears on its own. Learn how to identify the source, reduce inflammation, and build the resilience to move without hesitation.",
  },
  {
    label: "Nails",
    href: "/guides/toenail-fungus-what-works",
    leftImage: "/images/pexels-9767780.jpg",
    tagline: "Small details, big confidence.",
    description:
      "Thick, discolored, or ingrown nails are more common than you think — and more treatable. A consistent trimming habit and the right antifungal protocol can restore clean, healthy nails in weeks.",
  },
  {
    label: "Alignment",
    href: "/guides/why-toe-alignment-affects-knees-and-hips",
    leftImage: "/images/pexels-33360918.jpg",
    tagline: "Your toes set the foundation.",
    description:
      "Bunions, hammer toes, and crowded toe boxes all trace back to how your foot contacts the ground. Simple daily spreader exercises and footwear awareness can reverse years of drift.",
  },
  {
    label: "Routine",
    href: "/guides/5-minute-routine",
    leftImage: "/images/pexels-4909313.jpg",
    tagline: "Five minutes. Every day.",
    description:
      "The men who take care of their feet do it consistently — not occasionally. Washing, drying, moisturizing, inspecting: a simple morning or evening ritual that prevents 90% of common foot problems.",
  },
  {
    label: "Fit",
    href: "/guides/what-your-dress-shoes-are-doing-to-your-feet",
    leftImage: "/images/pexels-8729236.jpg",
    tagline: "The wrong shoe is a slow injury.",
    description:
      "Most men wear shoes half a size too small and twice as narrow as their feet need. Understanding your foot shape — length, width, arch — changes how you buy footwear for the rest of your life.",
  },
  {
    label: "Skin",
    href: "/guides/cracked-heels-what-actually-works",
    leftImage: "/images/pexels-11873696.jpg",
    tagline: "Cracks heal. Calluses soften.",
    description:
      "Heel fissures and rough skin aren't just cosmetic — deep cracks can split and become painful entry points for infection. A targeted moisturizing routine with the right emollients makes a visible difference in days.",
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
      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "580px" }}>

          {/* Left: stacked words + active description */}
          <div className="flex flex-col justify-center px-10 py-12 lg:px-16">

            {/* Stacked word list */}
            <div className="mb-10">
              {topics.map((topic, i) => (
                <Link
                  key={i}
                  href={topic.href}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={(e) => handleTopicClick(e, i)}
                  className={`flex items-center gap-2 font-display font-bold uppercase tracking-tight leading-none py-0.5 transition-colors duration-300 ${
                    isActive(i)
                      ? "text-brand-900"
                      : "text-neutral-300 hover:text-neutral-600"
                  }`}
                  style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
                >
                  {topic.label}
                  {/* Tap indicator — mobile only */}
                  <span
                    className={`md:hidden text-accent-500 transition-opacity duration-300 ${
                      isActive(i) ? "opacity-100" : "opacity-40"
                    }`}
                    style={{ fontSize: "0.65em" }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </Link>
              ))}
            </div>

            {/* Active description — stacked via absolute to avoid layout shift */}
            <div className="relative hidden md:block" style={{ minHeight: "11rem" }}>
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-500 ${
                    i === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <span className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3">
                    {String(i + 1).padStart(2, "0")} / {String(topics.length).padStart(2, "0")}
                  </span>
                  <p className="font-heading text-accent-600 text-sm tracking-wide italic leading-snug mb-2">
                    {topic.tagline}
                  </p>
                  <p className="font-body text-neutral-600 text-base leading-snug mb-5">
                    {topic.description}
                  </p>
                  <Link
                    href={topic.href}
                    className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-accent-600 hover:text-brand-900 transition-colors duration-200 group"
                  >
                    Explore this topic
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile hint */}
            <p className="md:hidden mt-6 font-body text-xs text-neutral-400 tracking-[0.12em] uppercase">
              Tap a topic to learn more
            </p>
          </div>

          {/* Right: crossfading image — inset from all edges for breathing room */}
          <div className="relative hidden md:block" style={{ minHeight: "580px" }}>
            <div className="absolute inset-8 overflow-hidden bg-brand-900">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image src={topic.leftImage} alt="" fill className="object-cover object-center" />
                  <div className="absolute inset-0 bg-brand-900/10" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Mobile bottom sheet ────────────────────────────────── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setPanelOpen(false)}
        className={`fixed inset-0 z-40 bg-brand-900/60 md:hidden transition-opacity duration-300 ${
          panelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.label}
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-accent-50 rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-out
          ${panelOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "78vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Cognac rule */}
        <div className="mx-6 mt-3 h-[2px] bg-accent-500" />

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pt-5 pb-10" style={{ maxHeight: "calc(78vh - 48px)" }}>

          {/* Index + close row */}
          <div className="flex items-center justify-between mb-5">
            <span className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400">
              {String(panelIndex + 1).padStart(2, "0")} / {String(topics.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => setPanelOpen(false)}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors text-neutral-600 text-sm font-body"
            >
              ✕
            </button>
          </div>

          {/* Editorial content */}
          <p className="font-heading text-accent-600 text-sm tracking-wide italic leading-snug mb-3">
            {t.tagline}
          </p>
          <h3 className="font-display font-bold uppercase text-brand-900 leading-tight tracking-tight text-3xl mb-4">
            {t.label}
          </h3>
          <p className="font-body text-neutral-600 text-base leading-snug mb-8">
            {t.description}
          </p>

          {/* CTA */}
          <Link
            href={t.href}
            onClick={() => setPanelOpen(false)}
            className="inline-flex items-center gap-2 bg-brand-900 text-white font-body text-xs tracking-[0.15em] uppercase px-5 py-3 rounded-full hover:bg-brand-800 transition-colors"
          >
            Explore this topic
            <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
