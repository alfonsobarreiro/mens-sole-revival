import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Diabetic Foot Care: The Daily Check, the Shoe Rules, and When a Small Thing Is an Emergency — Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide · Foot Health",
    title: "Diabetic Foot Care",
    meta: "8 min read",
  });
}
