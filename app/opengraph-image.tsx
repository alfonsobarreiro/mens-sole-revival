import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Men's Sole Revival — Foot care, footwear, and the daily habits that keep men moving";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Men's Sole Revival",
    title: "Feet that carry you into your best decades.",
    meta: "Foot care · Footwear · Daily habits",
  });
}
