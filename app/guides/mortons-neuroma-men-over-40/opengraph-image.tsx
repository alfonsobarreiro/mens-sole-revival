import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Morton's Neuroma: The Pebble Under the Foot and What Fixes It \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Pain",
    title: "Morton's Neuroma",
    meta: "7 min read",
  });
}
