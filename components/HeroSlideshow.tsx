"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt?: string; position?: string };

/**
 * Full-bleed hero background that slowly crossfades between images.
 *
 * Deliberately NOT a carousel — no slide, no dots, no arrows. Just a gentle
 * opacity fade so the motion never competes with the headline/CTA.
 *
 * - Respects prefers-reduced-motion: those users see only the first frame.
 * - LCP-protected: the first image is priority-loaded; the rest are lazy.
 * - The scrim lives above this (in the hero), so legibility is constant.
 */
export default function HeroSlideshow({
  images,
  intervalMs = 6000,
}: {
  images: Slide[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % images.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt ?? ""}
          fill
          priority={i === 0}
          sizes="100vw"
          style={{ objectPosition: img.position ?? "center" }}
          className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
