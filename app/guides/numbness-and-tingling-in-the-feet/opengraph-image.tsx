import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Numbness and Tingling in the Feet: Nerve, Shoe, or Something Upstream — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Foot Health",
    title: "Numbness and Tingling in the Feet",
    meta: "8 min read",
  });
}
