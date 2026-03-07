"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type } from "@/components/typography";

const topics = [
  {
    label: "Pain & Recovery",
    href: "/waitlist?kit=pain-recovery",
    leftImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70",
    rightImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70",
  },
  {
    label: "Nail Care",
    href: "/waitlist?kit=fungus-care",
    leftImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=70",
    rightImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70",
  },
  {
    label: "Toe Alignment",
    href: "/waitlist?kit=alignment-mobility",
    leftImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70",
    rightImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=70",
  },
  {
    label: "Daily Routine",
    href: "/blog/5-minute-routine",
    leftImage: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=800&q=70",
    rightImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70",
  },
  {
    label: "Footwear Fit",
    href: "/waitlist?kit=footwear-fit",
    leftImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=70",
    rightImage: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=800&q=70",
  },
  {
    label: "Dry Skin & Cracking",
    href: "/waitlist?kit=dry-skin",
    leftImage: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=70",
    rightImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=70",
  },
];

export default function TopicsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="border-t border-neutral-200">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr]" style={{ minHeight: "600px" }}>

        {/* Left image panel */}
        <div className="relative hidden md:block bg-brand-900 overflow-hidden">
          {topics.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={t.leftImage}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-900/20" />
            </div>
          ))}
        </div>

        {/* Center: stacked topic words */}
        <div className="flex flex-col justify-center items-center py-16 px-6 md:px-10 border-x border-neutral-100 text-center">
          <p className={`${type.displaySection} text-brand-900 leading-none mb-10`}>
            KNOW YOUR FEET.
          </p>

          <div>
            {topics.map((t, i) => (
              <Link
                key={i}
                href={t.href}
                onMouseEnter={() => setActiveIndex(i)}
                className={`block font-display font-bold uppercase tracking-tight leading-tight py-1.5 transition-colors duration-300 ${
                  i === activeIndex
                    ? "text-brand-900"
                    : "text-neutral-300 hover:text-neutral-600"
                }`}
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.25rem)" }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right image panel */}
        <div className="relative hidden md:block bg-brand-900 overflow-hidden">
          {topics.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={t.rightImage}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-900/20" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
