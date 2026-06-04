import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Guides — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guides",
    title: "Evidence-based guides for men's foot health.",
    meta: "Routines · Alignment · Skin · Nails · Footwear",
  });
}
