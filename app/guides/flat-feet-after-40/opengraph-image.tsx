import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Flat Feet After 40: When It's a Problem, When It Isn't, and What Helps \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Alignment",
    title: "Flat Feet After 40",
    meta: "7 min read",
  });
}
