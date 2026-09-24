import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Gout in the Big Toe: How to Tell It From Stiffness (and What to Do) — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Pain",
    title: "Gout in the Big Toe",
    meta: "7 min read",
  });
}
