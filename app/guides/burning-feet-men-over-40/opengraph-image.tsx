import { renderMsrOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Burning Feet: Neuropathy, Athlete's Foot, or the Shoe \u2014 Men's Sole Revival";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderMsrOg({
    overline: "Guide \u00b7 Foot Health",
    title: "Burning Feet",
    meta: "7 min read",
  });
}
