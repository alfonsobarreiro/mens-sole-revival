import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Why Toe Alignment Affects Your Knees and Hips — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Alignment",
    title: "Why Toe Alignment Affects Your Knees and Hips",
    meta: "6 min read",
  });
}
