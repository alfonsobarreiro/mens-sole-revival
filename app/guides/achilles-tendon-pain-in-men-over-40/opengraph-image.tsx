import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Achilles Tendon Pain in Men Over 40 — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Pain",
    title: "Achilles Tendon Pain in Men Over 40",
    meta: "7 min read",
  });
}
