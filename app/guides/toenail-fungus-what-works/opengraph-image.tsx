import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Toenail Fungus: What Works, What's a Scam, and Where to Start — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nail Care",
    title: "Toenail Fungus: What Works, What's a Scam, and Where to Start",
    meta: "5 min read",
  });
}
