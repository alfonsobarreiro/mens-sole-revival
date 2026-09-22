import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Bunions in Men Over 40: What Slows Them, Which Shoes, and When Surgery Is the Honest Answer — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Alignment",
    title: "Bunions in Men Over 40",
    meta: "8 min read",
  });
}
