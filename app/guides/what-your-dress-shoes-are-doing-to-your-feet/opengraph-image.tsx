import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "What 30 Years in Dress Shoes Actually Does to Your Feet — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Footwear Fit",
    title: "What 30 Years in Dress Shoes Actually Does to Your Feet",
    meta: "7 min read",
  });
}
