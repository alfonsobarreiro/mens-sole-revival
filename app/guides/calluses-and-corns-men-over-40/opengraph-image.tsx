import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Calluses and Corns: What to Remove, What to Leave, and What's Causing Them — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Skin",
    title: "Calluses and Corns",
    meta: "7 min read",
  });
}
