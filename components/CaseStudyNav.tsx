"use client";

import Link from "next/link";

const frames = [
  "/case-study",
  "/case-study/frame-2",
  "/case-study/frame-3",
  "/case-study/frame-4",
  "/case-study/frame-5",
  "/case-study/frame-6",
  "/case-study/frame-7",
  "/case-study/frame-8",
  "/case-study/frame-9",
];

export default function CaseStudyNav({ current }: { current: number }) {
  const prevHref = current > 1 ? frames[current - 2] : frames[frames.length - 1];
  const nextHref = current < frames.length ? frames[current] : frames[0];
  const isLast = current === frames.length;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-[88px] py-4"
      style={{ background: "rgba(248,247,247,0.0)" }}
    >
      {/* Prev */}
      {current === 1 ? (
        <div style={{ width: 80 }} />
      ) : (
        <Link
          href={prevHref}
          className="flex items-center gap-2 font-body transition-opacity hover:opacity-100"
          style={{ color: "#938C86", fontSize: 12, opacity: 0.6, textDecoration: "none" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </Link>
      )}

      {/* Dots */}
      <div className="flex items-center gap-2">
        {frames.map((_, i) => (
          <Link
            key={i}
            href={frames[i]}
            className="block rounded-full transition-all"
            style={{
              width: i + 1 === current ? 18 : 6,
              height: 6,
              background: i + 1 === current ? "#C4703A" : "#D6D3D1",
              borderRadius: 3,
            }}
          />
        ))}
      </div>

      {/* Next */}
      <Link
        href={nextHref}
        className="flex items-center gap-2 font-body transition-opacity hover:opacity-100"
        style={{ color: "#938C86", fontSize: 12, opacity: 0.6, textDecoration: "none" }}
      >
        {isLast ? "Back to Start" : "Next"}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
