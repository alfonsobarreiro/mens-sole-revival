import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Measure Your Feet at Home: Length, Width, and Why Your Size Changed After 40 \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Footwear Fit",
    title: "Measure Your Feet at Home",
    meta: "7 min read",
  });
}
