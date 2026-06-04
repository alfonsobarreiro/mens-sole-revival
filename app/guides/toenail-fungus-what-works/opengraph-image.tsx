import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Toenail Fungus: What Actually Works (and What's a Scam) — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Nail Care",
    title: "Toenail Fungus: What Actually Works (and What's a Scam)",
    meta: "8 min read",
  });
}
