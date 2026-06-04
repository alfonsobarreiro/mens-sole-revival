import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Your Big Toe Controls More of Your Body Than You Think — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Toe Alignment",
    title: "Your Big Toe Controls More of Your Body Than You Think",
    meta: "6 min read",
  });
}
