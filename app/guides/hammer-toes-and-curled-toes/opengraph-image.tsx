import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Hammer Toes and Curled Toes: What Straightens, What Doesn't, and the Shoe Fix \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Alignment",
    title: "Hammer Toes and Curled Toes",
    meta: "7 min read",
  });
}
