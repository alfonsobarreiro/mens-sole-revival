import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Athlete's Foot and Foot Odor: What Works (and Why It Comes Back) — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Skin",
    title: "Athlete's Foot and Foot Odor",
    meta: "7 min read",
  });
}
